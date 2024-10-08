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
api_key = "AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM"
place_id = "ChIJ-c0P3AoP2jERmgAasZYsPdM"  # Replace with your Place ID
details = get_place_details(place_id, api_key)

print(details)