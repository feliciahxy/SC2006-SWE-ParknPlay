#to be added to views.py

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Favourite
import requests

@csrf_exempt
@require_http_methods(["POST"])
def FavouritesMgr(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            place = data.get("place")
            action = data.get("action")

            if action == "add":
                #add to database
                favourite_place = Favourite.objects.create(
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
                return JsonResponse({
                    "message": "place added to Favourites successfully"
                }, safe=False)
            elif action == "remove":
                #remove from database
                try:
                    favourite = Favourite.objects.get(name=place["name"], location=place["location"])
                    favourite.delete()
                    return JsonResponse({
                        "message": "Place removed from Favourites successfully"
                    }, safe=False)
                except Favourite.DoesNotExist:
                    return JsonResponse({
                        "error": "Place not found in Favourites"
                    }, status=404)
            else:
                return JsonResponse({
                    "error": "Invalid action: Please select add to favourites or remove from favourites"
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Invalid JSON"
            }, status=400)
    elif request.method == "GET":
        try:
            data = Favourite.objects.all()
            serialized_data = [model_to_dict(item) for item in data]
            response = requests.post('http://127.0.0.1:8000/parknplay/favourites', json = serialized_data, headers = {
                'Content-Type': 'application/json'
            })
        except Exception as e:
            return HttpResponse(str(e))
    else:
        return JsonResponse({
            "error": "Invalid request method"
        }, status=400)

