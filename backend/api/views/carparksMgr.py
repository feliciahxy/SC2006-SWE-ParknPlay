from django.http import JsonResponse
from geopy.distance import geodesic
from pyproj import Transformer
import requests

MAX_DISTANCE_METERS = 5000  # Maximum distance form choosen location to carpark
TOPXCARPARKS = 5  # Display a maximum of 5 carparks
transformer = Transformer.from_crs("EPSG:3414", "EPSG:4326", always_xy=True)

def svy21_to_wgs84(easting, northing):
    try:
        longitude, latitude = transformer.transform(easting, northing)
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            return None, None
        return latitude, longitude
    except Exception as e:
        return None, None

def find_nearest_carparks(request):
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

# get_carpark_availability pulls live carpark availability data from api
def get_carpark_availability():
    api_url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json().get("items", [])[0].get("carpark_data", [])
    return []

# get_carpark_information is used to obtain carpark data from api
def get_carpark_information():
    carpark_info_url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_23f946fa557947f93a8043bbef41dd09&limit=500"
    response = requests.get(carpark_info_url)
    if response.status_code == 200:
        return response.json().get("result", {}).get("records", [])
    return []
