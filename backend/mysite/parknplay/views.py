from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict
import requests
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def index(request):
    return HttpResponse("Backend is up")

def getUsers(request):
    data = User.objects.all()
    serialized_data = [model_to_dict(item) for item in data]
    return JsonResponse(serialized_data, safe=False)




@csrf_exempt
def SearchMgr(request):
    if request.method == "POST":
        try:
            filters = json.loads(request.body)
            places = search(filters.region, filters.placetype, filters.price)
            response = requests.post('http://127.0.0.1:8000/parknplay/search', json = places, headers = {
                'Content-Type': 'application/json'
            })
            print(response.json())

            return JsonResponse({
                "message": "Filters received successfully"
            }, safe=False)
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Invalid JSON"
            }, status=400)
    else:
        return JsonResponse({
            "error": "Invalid request method"
        }, status=400)




def get_place_details(place_id, api_key):
    # Endpoint and parameters for the Place Details API
    endpoint = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        'place_id': place_id,
        'fields': 'name,geometry,formatted_address,rating,price_level,opening_hours,photos',
        'key': api_key
    }
    
    # Make the request to the Google Place Details API
    response = requests.get(endpoint, params=params)
    
    # Parse the response JSON
    if response.status_code == 200:
        place_details = response.json()
        if place_details.get("status") == "OK":
            return place_details.get("result", {})
        else:
            return f"Error: {place_details.get('status')}"
    else:
        return f"HTTP Error: {response.status_code}"

def nearby_search(location, radius, api_key, place_type=None, max_price=None, rankby="prominence"):
    # Define the endpoint and parameters for the Nearby Search API
    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': location,  # Latitude and Longitude (comma-separated)
        'radius': radius,      # Search radius in meters
        'key': api_key,
        'rankby': rankby       # Rank results by prominence
    }
    
    # Optional filters
    if place_type:
        params['type'] = place_type  # Type of place (e.g., restaurant, cafe, etc.)
    if max_price is not None:
        params['maxprice'] = max_price  # Max price level (0 to 4)
    
    # Make the request to the Google Places API
    response = requests.get(endpoint, params=params)
    
    # Parse the response JSON
    if response.status_code == 200:
        places = response.json()
        if places.get("status") == "OK":
            return places.get("results", [])
        else:
            return f"Error: {places.get('status')}"
    else:
        return f"HTTP Error: {response.status_code}"

# Example usage:
# Latitude and longitude of San Francisco allow them to pick on the map
 # Search radius in meters
def search(region, placetype, price):
    region = "North" #to link region parameter to this 
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

    api_key = "AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM"
    place_type = placetype  # Type of place (optional) # to link place type to this
    max_price = price  # Max price level (0 to 4) # to link max price to this
    rankby = "prominence"  # Rank results by prominence (default)

    # Step 1: Get nearby places
    nearby_places = nearby_search(location, radius, api_key, place_type, max_price, rankby)
    placeslist = []
    # Step 2: Fetch detailed information for each place
    for place in nearby_places:
        place_id = place['place_id']  # Get the place_id for detailed lookup
        details = get_place_details(place_id, api_key)
        
        # Step 3: Print required details
        if details:
            name = details.get('name', 'N/A')
            location = details.get('geometry', {}).get('location', {})
            lat = location.get('lat', 'N/A')
            lng = location.get('lng', 'N/A')
            address = details.get('formatted_address', 'N/A')
            rating = details.get('rating', 'N/A')
            price_level = details.get('price_level', 'N/A')
            opening_hours = details.get('opening_hours', {}).get('weekday_text', 'N/A')
            photos = details.get('photos', [])
            photo_reference = photos[0]['photo_reference'] if photos else 'N/A'
            
            place = {
                "name" : name,
                "location" : location,
                "lat" : lat,
                "lng" : lng,
                "address" : address,
                "rating" : rating,
                "price_level" : price_level,
                "opening_hours" : opening_hours,
                "photos" : photos,
                "photo_reference" : photo_reference
            }
            placeslist.append(place)
    return placeslist
