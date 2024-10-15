import requests
from geopy.distance import geodesic
from pyproj import Proj, Transformer

# Define constants for SVY21 to WGS84 conversion using pyproj
svy21 = Proj("epsg:3414")  # SVY21 (EPSG:3414)
wgs84 = Proj("epsg:4326")  # WGS84 (EPSG:4326)

# Create a transformer object for the conversion
transformer = Transformer.from_proj(svy21, wgs84)

# Define the user's location (replace with actual coordinates)
# place_location = (1.3525, 103.8198)  # Example coordinates for Singapore
TOPXCARPARKS = 10 #number of top carparks wanted

# Function to convert SVY21 coordinates to WGS84 using Transformer
def svy21_to_wgs84(x, y):
    # Transform coordinates
    lon, lat = transformer.transform(x, y)
    
    # Return in (latitude, longitude) order
    return lat, lon

# Function to fetch carpark availability
def get_carpark_availability():
    api_url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json().get("items", [])[0].get("carpark_data", [])
    else:
        print(f"Failed to fetch carpark availability: {response.status_code}")
        return []

# Function to fetch HDB carpark information (locations)
def get_carpark_information():
    carpark_info_url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_23f946fa557947f93a8043bbef41dd09&limit=500"
    response = requests.get(carpark_info_url)
    if response.status_code == 200:
        return response.json().get("result", {}).get("records", [])
    else:
        print(f"Failed to fetch carpark information: {response.status_code}")
        return []

# Function to calculate distance between two coordinates
def calculate_distance(coord1, coord2):
    try:
        # coord1 is in WGS84 (lat, lon) format
        return geodesic(coord1, coord2).kilometers
    except ValueError as e:
        print(f"Error calculating distance between {coord1} and {coord2}: {e}")
        return float('inf')

# Main function to find nearest 5 carparks
def find_nearest_carparks(place_location):
    # Step 1: Get live carpark availability
    carpark_availabilities = get_carpark_availability()

    # Step 2: Get HDB carpark information (location data)
    carpark_info_list = get_carpark_information()

    # Step 3: Combine availability and location information
    combined_carparks = []
    for availability in carpark_availabilities:
        carpark_number = availability.get("carpark_number")
        
        # Find matching carpark info by carpark_number
        for info in carpark_info_list:
            if info.get("car_park_no") == carpark_number:
                try:
                    # Convert from SVY21 to WGS84 using pyproj
                    longitude, latitude = svy21_to_wgs84(float(info.get("x_coord")), float(info.get("y_coord")))
                    # Store the converted coordinates in a location tuple
                    location = (latitude, longitude)
                except (ValueError, TypeError) as e:
                    print(f"Error parsing coordinates for carpark {carpark_number}: {e}")
                    continue
                
                combined_carparks.append({
                    "carpark_number": carpark_number,
                    "location": location,  # Use the location variable now
                    "address": info.get("address", "N/A"),
                    "distance": calculate_distance(place_location, location)  # Use the location for distance
                })
                break
    
    # Step 4: Sort the carparks by distance and get the nearest 5
    nearest_carparks = sorted(combined_carparks, key=lambda x: x["distance"])[:TOPXCARPARKS] 
    return nearest_carparks

# Function to find carpark availability details for nearest carparks
def find_carpark_details(place_location):
    # Get the nearest carparks to the user's location
    nearest_carparks = find_nearest_carparks(place_location)
    
    # Get the carpark availability data
    carpark_availabilities = get_carpark_availability()
    carpark_details = []
    
    # Match carpark availability with the nearest carparks and print details
    for carpark in nearest_carparks:
        carpark_number = carpark['carpark_number']
        for availability in carpark_availabilities:
            if availability['carpark_number'] == carpark_number:
                available_lots = availability.get('carpark_info', [])[0].get('lots_available', 'N/A')
                total_lots = availability.get('carpark_info', [])[0].get('total_lots', 'N/A')

                details = {
                    "carpark_number": carpark_number,
                    "address": carpark['address'],
                    "available_lots": available_lots,
                    "total_lots": total_lots,
                    "coordinates": carpark['location']  
                }

                # Add the details to the list
                carpark_details.append(details)
                print(f"{details['address']} - {details['available_lots']} out of {details['total_lots']} lots available, coordinates: {details['coordinates']}")
                break

    return carpark_details  # we only need address, # of lots out of total # and coordinates to map location

# Example usage
find_carpark_details(place_location) #to input attraction location after selected attraction
