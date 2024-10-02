from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict

# Create your views here.
def index(request):
    return HttpResponse("Backend is up")

def getUsers(request):
    data = User.objects.all()
    serialized_data = [model_to_dict(item) for item in data]
    return JsonResponse(serialized_data, safe=False)
