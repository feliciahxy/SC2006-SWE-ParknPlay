from .managers.CarparkMgr import find_carpark_details
from .managers.SearchMgr import search

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict
import requests
from django.views.decorators.csrf import csrf_exempt
import json

import jwt
from django.conf import settings

# Create your views here.
def index(request):
    return HttpResponse("Backend is up")

@csrf_exempt
def handleUsers(request):
    if request.method == 'GET':
        data = User.objects.all()
        serialized_data = [model_to_dict(item) for item in data]
        return JsonResponse(serialized_data, safe=False)
    elif request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]

        #create jwt token and send token to frontend
        user = User.objects.create(username=username, password=password)
        token = jwt.encode({'user_id': user.id}, settings.SECRET_KEY, algorithm='HS256')
        return JsonResponse({
            'token': token,
            'message': 'User created'
        }, status=201)
    else:
        return JsonResponse({
            "error": "Only GET and POST methods allowed",
        })

@csrf_exempt
def changePassword(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            user = User.objects.get(username = username)
            user.password = password
            user.save()
            return JsonResponse({
                "message": "Password Changed"
            }, safe=False)
        except User.DoesNotExist:
            return JsonResponse({
                "error": "Account with this username does not exist"
            }, status=404)


@csrf_exempt
def loginView(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]

        #authenticate user
        user = authenticate(request, username = username, password = password)
        if user is not None:
            token = jwt.encode({'user_id': user.id}, settings.SECRET_KEY, algorithm='HS256')
            return JsonResponse({'token': token})
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        """data = json.loads(request.body)
         username = data.get('username')
        password = data.get('password')
        
        user = User.objects.get(username=username)
        if user.password == password:
            return JsonResponse({"message": "Login successful", "status": "success"}, status=200)
        else:
            return JsonResponse({"message": "Invalid password", "status": "fail"}, status=401) """
    else:
        return JsonResponse({"message": "Only POST method allowed"}, status=405)





#searchMgr
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

@csrf_exempt
def nearby_search(request):
    """Google Places API: Perform a nearby search."""
    filters = json.loads(request.body)
            
    print('Received filters: ', filters) #check error
    place_type = filters['placetype']
    region = filters['region']
    min_rating = filters['rating']

    if region == "North":
        location = "1.445, 103.825"
        radius = 10000
    elif region == "South":
        location = "1.270, 103.819"
        radius = 8000
    elif region == "East":
        location = "1.335, 103.940"
        radius = 12000
    elif region == "West":
        location = "1.355, 103.690"
        radius = 15000
    keyword = filters['price']

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
                    'photo': place.get('photos', [{}])[0].get('photo_reference', None),
                    #'price_level' = place.get('price_level', 'N/A')
                    #'opening_hours' = place.get('opening_hours', {}).get('weekday_text', 'N/A'),
                })
            return JsonResponse(formatted_results, safe=False)
        else:
            return JsonResponse({'error': f"Error: {places.get('status')}"}, status=400)
    else:
        return JsonResponse({'error': f"HTTP Error: {response.status_code}"}, status=response.status_code)


#carparkMgr
@csrf_exempt
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






@csrf_exempt
def FavouritesMgr(request):
    if request.method == "POST":
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({
                    "error": "No token provided",
                }, status=401)
            
            token = auth_header.split(' ')[1]
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            user = User.objects.get(id=user_id)
            data = json.loads(request.body)
            place = data.get("place")
            action = data.get("action")

            if action == "add":
                #add to database
                favourite_place, created = Favourite.objects.get_or_create(
                    name = place["name"],
                    location = place["location"],
                    lat = place["lat"],
                    lng = place["lng"],
                    address = place["address"],
                    rating = place["rating"],
                    price_level = place["price_level"],
                    opening_hours = place["opening_hours"],
                    photos = place["photos"],
                    photo_reference = place["photo_reference"]
                )
                user.favourites.add(favourite_place)
                return JsonResponse({
                    "message": "place added to Favourites successfully"
                }, safe=False)
            elif action == "remove":
                #remove from database
                try:
                    favourite = Favourite.objects.get(
                        name=place["name"], 
                        location=place["location"]
                    )
                    user.favourites.remove(favourite)
                    return JsonResponse({
                        "message": "Place removed from Favourites successfully"
                    }, safe=False)
                except Favourite.DoesNotExist:
                    return JsonResponse({
                        "error": "Place not found in Favourites"
                    }, status=404)
            elif action == "find":
                try:
                    favourite = user.favourites.get(
                        name = place["name"],
                        location = place["location"]
                    )
                    return JsonResponse({
                        "message": "Place found in User's favourites"
                    }, safe=False)
                except user.favourites.DoesNotExist:
                    return JsonResponse({
                        "error": "Place not found in User's Favourites"
                    }, status=404)
            else:
                return JsonResponse({
                    "error": "Invalid action: Please select add to favourites or remove from favourites"
                }, status=400)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User with this username not found"
            }, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    elif request.method == "GET":
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({
                    "error": "no token provided",
                }, status=401)
            token = auth_header.split(' ')[1]
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            user = User.objects.get(id = user_id)
            user_favourites = user.favourites.all()
            serialized_data = [model_to_dict(item) for item in user_favourites]
            return JsonResponse({
                "favourites": serialized_data
            }, safe=False)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({
            "error": "Invalid request method"
        }, status=400)