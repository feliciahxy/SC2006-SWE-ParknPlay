import requests
from geopy.distance import geodesic
from pyproj import Transformer

# Define constants for SVY21 to WGS84 conversion using pyproj
# Ensure always_xy=True to maintain (Easting, Northing) order
transformer = Transformer.from_crs("EPSG:3414", "EPSG:4326", always_xy=True)

# Define the user's location (replace with actual coordinates)
# place_location = (1.3082405, 103.8858445)  # Example coordinates for Singapore (WGS84)
TOPXCARPARKS = 5  # Number of top carparks wanted

# Function to convert SVY21 coordinates to WGS84 using Transformer
def svy21_to_wgs84(easting, northing):
    try:
        # Transform from SVY21 (Easting, Northing) to WGS84 (Longitude, Latitude)
        longitude, latitude = transformer.transform(easting, northing)        
        # Validate latitude and longitude
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            print(f"Invalid WGS84 coordinates: ({latitude}, {longitude}) for SVY21 ({easting}, {northing})")
            return None, None
        
        return latitude, longitude  # WGS84 format is (latitude, longitude)
    except Exception as e:
        print(f"Error transforming SVY21 to WGS84: {e}")
        return None, None

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
        dist = geodesic(coord1, coord2).kilometers
        return dist
    except ValueError as e:
        print(f"Error calculating distance between {coord1} and {coord2}: {e}")
        return float('inf')

# Main function to find nearest carparks
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
                    easting = float(info.get("x_coord"))
                    northing = float(info.get("y_coord"))
                    latitude, longitude = svy21_to_wgs84(easting, northing)
                    
                    # Ensure conversion is successful before using the coordinates
                    if latitude is None or longitude is None:
                        continue
                    
                    location = (latitude, longitude)  # Correct WGS84 (lat, lon)
                    
                    # Calculate distance and store
                    distance = calculate_distance(place_location, location)
                    
                    combined_carparks.append({
                        "carpark_number": carpark_number,
                        "location": location,
                        "address": info.get("address", "N/A"),
                        "distance": distance
                    })
                except (ValueError, TypeError) as e:
                    print(f"Error parsing coordinates for carpark {carpark_number}: {e}")
                    continue
                break  # Exit the inner loop once a match is found

    # Step 4: Sort carparks by distance and return nearest ones
    nearest_carparks = sorted(combined_carparks, key=lambda x: x["distance"])[:TOPXCARPARKS]
    return nearest_carparks

# Function to find carpark availability details for nearest carparks
def find_carpark_details(place_location):
    # Get the nearest carparks to the user's location
    nearest_carparks = find_nearest_carparks(place_location)
    
    # Get the carpark availability data
    carpark_availabilities = get_carpark_availability()
    carpark_details = []
    
    # Match carpark availability with the nearest carparks
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
                # print(f"{details['address']} - {details['available_lots']} out of {details['total_lots']} lots available, coordinates: {details['coordinates']}")
                break

    return carpark_details  # we only need address, # of lots out of total # and coordinates to map location

# Example usage
#find_carpark_details(place_location)  # Input attraction location after selecting attraction
