import requests
def get_place_info(address, api_key):
# Base URL
  base_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
# Parameters in a dictionary
  params = {
   "input": address,
   "inputtype": "textquery",
   "fields": "formatted_address,name,business_status,place_id",
   "key": api_key,
  }
# Send request and capture response
  response = requests.get(base_url, params=params)
# Check if the request was successful
  if response.status_code == 200:
    return response.json()
  else:
    return None
  

# api_key = "AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM"
# address = "76 Nanyang Drive, N2.1, #02-03, Nanyang Technological University, 637331"
# place_info = get_place_info(address, api_key)
# if place_info is not None:
#   print(place_info)
# else:
#   print("Failed to get a response from Google Places API")


import requests

def get_place_details(place_id, api_key):
    # Define the endpoint and parameters
    endpoint = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        'place_id': place_id,
        'fields': 'rating,opening_hours,formatted_address',  # Specify required fields
        'key': api_key
    }
    
    # Make the request to the Google Places API
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

# Example usage:
# api_key = "AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM"
# place_id = "ChIJ-c0P3AoP2jERmgAasZYsPdM"  # Replace with your Place ID
# details = get_place_details(place_id, api_key)

# print(details)


import requests

def nearby_search(location, radius, api_key, keyword=None, place_type=None):
    # Define the endpoint and parameters
    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': location,  # Latitude and Longitude (comma-separated)
        'radius': radius,      # Search radius in meters
        'key': api_key
    }
    
    # Optional filters
    if keyword:
        params['keyword'] = keyword  # Keyword search filter
    if place_type:
        params['type'] = place_type  # Type of place (e.g., restaurant, cafe, etc.)
    
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
location = "37.7749,-122.4194"  # Latitude and longitude: user input?
radius = 1500  # Search radius in meters
# keyword = input("restaurant")  # Optional keyword search (remove or replace as needed) user input
place_type = "restaurant"  # Optional type of place (remove or replace as needed) user input

nearby_places = nearby_search(location, radius, api_key, place_type)

# Print the result
for place in nearby_places:
    print(f"Name: {place['name']}, Address: {place.get('vicinity', 'N/A')}, Rating: {place.get('rating', 'N/A')}")
