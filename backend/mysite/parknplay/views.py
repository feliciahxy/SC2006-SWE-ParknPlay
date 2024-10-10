from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict
import json
from django.views.decorators.csrf import csrf_exempt
import requests # to send data

# Create your views here.
def index(request):
    return HttpResponse("Backend is up")

def getUsers(request):
    data = User.objects.all()
    serialized_data = [model_to_dict(item) for item in data]
    return JsonResponse(serialized_data, safe=False)

@csrf_exempt
def SortMgr(request):
    if request.method == 'POST':
        try:
            filters = json.loads(request.body)
            #Process the filters

            #get attractions from Google Places API using filters as parameters and post to frontend
            url = ''
            nearby_places = [] #array of attractions fetched from Google Places API using filters as parameters
            response = requests.post(url, json=nearby_places, headers = {
                'Content-Type': 'application/json',
            })
            print(response.json())

            #return response to show that the filters is successfully posted from SortMgrUI to this class
            results = {
                "message": "Filters received successfully",
            }
            return JsonResponse(results, safe=False)
        except json.JSONDecodeError:
            results = {
                "error": "Invalid JSON",
            }
            return JsonResponse(results, status=400)
    else:
        results = {
            "error": "Invalid request method",
        }
        return JsonResponse(results, status=400)