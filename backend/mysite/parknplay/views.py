from managers.CarparkMgr import find_carpark_details
from managers.SearchMgr import search

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

@csrf_exempt
def SearchMgr(request):
    if request.method == "POST":
        try:
            filters = json.loads(request.body)
            places = search(filters["region"], filters["placetype"], filters["price"])
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

@csrf_exempt
def CarparkMgr(request):
    if request.method == "GET":
        # Get latitude and longitude from the query parameters
        place_latitude = request.GET.get('lat')
        place_longitude = request.GET.get('lon')

        if place_latitude and place_longitude:
            place_location = (place_latitude, place_longitude) # convert latitude and longitude to tuple
            carparks_data = find_carpark_details(place_location) # call find_carpark_details to get carparks
            return JsonResponse({'carparks': carparks_data})
    else:
        return JsonResponse({'error': 'missing coordinates'}, status=400)

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