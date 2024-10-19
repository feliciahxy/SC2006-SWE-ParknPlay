from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
import requests
from geopy.distance import geodesic
from pyproj import Transformer

# Hardcoded API key
API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM'
MAX_DISTANCE_METERS = 5000  # Maximum distance to find nearby carparks
TOPXCARPARKS = 5  # Number of top carparks to return

# Transformer for converting SVY21 to WGS84
transformer = Transformer.from_crs("EPSG:3414", "EPSG:4326", always_xy=True)

def svy21_to_wgs84(easting, northing):
    """Convert SVY21 coordinates to WGS84 using Transformer."""
    try:
        longitude, latitude = transformer.transform(easting, northing)
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            print(f"Invalid WGS84 coordinates: ({latitude}, {longitude}) for SVY21 ({easting}, {northing})")
            return None, None
        return latitude, longitude
    except Exception as e:
        print(f"Error transforming SVY21 to WGS84: {e}")
        return None, None

def index(request):
    """Basic endpoint to check if the backend is running."""
    return HttpResponse("Backend is up")

def get_users(request):
    """Endpoint to get all users."""
    data = User.objects.all()
    serialized_data = [model_to_dict(item) for item in data]
    return JsonResponse(serialized_data, safe=False)

def get_place_info(request):
    """Google Places API: Get place info based on address."""
    address = request.GET.get('address')
    base_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    
    if not address:
        return JsonResponse({'error': 'Address is required'}, status=400)
    
    params = {
        "input": address,
        "inputtype": "textquery",
        "fields": "formatted_address,name,business_status,place_id,geometry",
        "key": API_KEY,
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        place_data = response.json()
        if place_data.get("status") == "OK":
            place_info = place_data.get("candidates", [])[0]
            return JsonResponse(place_info)
        else:
            return JsonResponse({'error': f"Error: {place_data.get('status')}"}, status=400)
    else:
        return JsonResponse({'error': 'Failed to get a response from Google Places API'}, status=response.status_code)

def get_place_details(request):
    """Google Places API: Get detailed info based on place_id."""
    place_id = request.GET.get('place_id')
    endpoint = "https://maps.googleapis.com/maps/api/place/details/json"
    
    if not place_id:
        return JsonResponse({'error': 'Place ID is required'}, status=400)
    
    params = {
        'place_id': place_id,
        'fields': 'rating,opening_hours,formatted_address,geometry',
        'key': API_KEY
    }
    response = requests.get(endpoint, params=params)
    if response.status_code == 200:
        place_details = response.json()
        if place_details.get("status") == "OK":
            return JsonResponse(place_details.get("result", {}))
        else:
            return JsonResponse({'error': f"Error: {place_details.get('status')}"}, status=400)
    else:
        return JsonResponse({'error': f"HTTP Error: {response.status_code}"}, status=response.status_code)

def nearby_search(request):
    """Google Places API: Perform a nearby search."""
    location = request.GET.get('location')
    radius = request.GET.get('radius')
    keyword = request.GET.get('keyword')
    place_type = request.GET.get('type')
    min_rating = request.GET.get('min_rating')

    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    
    if not location or not radius:
        return JsonResponse({'error': 'Location and radius are required'}, status=400)
    
    params = {
        'location': location,
        'radius': radius,
        'key': API_KEY
    }
    
    if keyword:
        params['keyword'] = keyword
    if place_type:
        params['type'] = place_type
    
    response = requests.get(endpoint, params=params)
    if response.status_code == 200:
        places = response.json()
        if places.get("status") == "OK":
            formatted_results = []
            for place in places.get("results", []):
                rating = place.get('rating', 0)
                if min_rating and float(rating) < float(min_rating):
                    continue
                
                formatted_results.append({
                    'name': place.get('name'),
                    'address': place.get('vicinity'),
                    'rating': rating,
                    'coordinates': {
                        'lat': place['geometry']['location']['lat'],
                        'lng': place['geometry']['location']['lng'],
                    },
                    'photo': place.get('photos', [{}])[0].get('photo_reference', None)
                })
            return JsonResponse(formatted_results, safe=False)
        else:
            return JsonResponse({'error': f"Error: {places.get('status')}"}, status=400)
    else:
        return JsonResponse({'error': f"HTTP Error: {response.status_code}"}, status=response.status_code)

def find_nearest_carparks(request):
    """Find nearest carparks based on a location."""
    lat = request.GET.get('latitude')
    lng = request.GET.get('longitude')
    
    if not lat or not lng:
        return JsonResponse({'error': 'Latitude and longitude are required'}, status=400)
    
    place_location = (float(lat), float(lng))
    carpark_availabilities = get_carpark_availability()
    carpark_info_list = get_carpark_information()

    combined_carparks = []
    
    for availability in carpark_availabilities:
        carpark_number = availability.get("carpark_number")
        
        for info in carpark_info_list:
            if info.get("car_park_no") == carpark_number:
                try:
                    easting = float(info.get("x_coord"))
                    northing = float(info.get("y_coord"))
                    latitude, longitude = svy21_to_wgs84(easting, northing)
                    
                    if latitude is None or longitude is None:
                        continue
                    
                    carpark_location = (latitude, longitude)
                    distance = geodesic(place_location, carpark_location).meters
                    
                    if distance <= MAX_DISTANCE_METERS:
                        combined_carparks.append({
                            "carpark_number": carpark_number,
                            "carpark_name": info.get("address", "N/A"),
                            "location": {"latitude": latitude, "longitude": longitude},
                            "distance": distance,
                            "available_lots": availability.get('carpark_info', [])[0].get('lots_available', 'N/A'),
                        })
                except (ValueError, TypeError):
                    continue

    sorted_carparks = sorted(combined_carparks, key=lambda k: k['distance'])
    
    return JsonResponse(sorted_carparks[:TOPXCARPARKS], safe=False)

def get_carpark_availability():
    """Fetch the current carpark availability data."""
    api_url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json().get("items", [])[0].get("carpark_data", [])
    return []

def get_carpark_information():
    """Fetch HDB carpark location data."""
    carpark_info_url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_23f946fa557947f93a8043bbef41dd09&limit=500"
    response = requests.get(carpark_info_url)
    if response.status_code == 200:
        return response.json().get("result", {}).get("records", [])
    return []
