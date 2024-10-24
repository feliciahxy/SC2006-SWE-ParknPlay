from django.http import JsonResponse
import requests

API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM'

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
    
    # Check if radius is a valid number
    try:
        radius = int(radius)
        if radius <= 0:
            return JsonResponse({'error': 'Radius must be a positive number'}, status=400)
    except ValueError:
        return JsonResponse({'error': 'Radius must be a valid number'}, status=400)

    params = {
        'location': location,
        'radius': radius,
        'key': API_KEY
    }
    
    if keyword:
        params['keyword'] = keyword
    if place_type:
        params['type'] = place_type
    
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()  # Raise an error for HTTP errors
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
    
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f"Request failed: {str(e)}"}, status=500)

    except ValueError as e:
        return JsonResponse({'error': f"Value error: {str(e)}"}, status=400)
