import requests

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
api_key = "AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM"
location = "37.7749,-122.4194"  # Latitude and longitude of San Francisco
radius = 1500  # Search radius in meters
place_type = "restaurant"  # Type of place (optional)
max_price = 2  # Max price level (0 to 4)
rankby = "prominence"  # Rank results by prominence (default)

# Step 1: Get nearby places
nearby_places = nearby_search(location, radius, api_key, place_type, max_price, rankby)

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
        
        print(f"Name: {name}")
        print(f"Location (lat, lng): ({lat}, {lng})")
        print(f"Address: {address}")
        print(f"Rating: {rating}")
        print(f"Price Level: {price_level}")
        print(f"Opening Hours: {opening_hours}")
        print(f"Photo Reference: {photo_reference}")
        print("-" * 40)



