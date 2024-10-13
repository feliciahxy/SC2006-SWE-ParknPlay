from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User
from django.forms.models import model_to_dict
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return HttpResponse("Backend is up")

@csrf_exempt
def handleUsers(request):
    if request.method == 'GET':
        data = User.objects.all()
        serialized_data = [model_to_dict(item) for item in data]
        return JsonResponse(serialized_data, safe=False)
    else:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = User.objects.create(username=username, password=password)
        return JsonResponse({'message': 'User created', 'id': user.username}, status=201)
    
@csrf_exempt
def loginView(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = User.objects.get(username=username)
        if user.password == password:
            return JsonResponse({"message": "Login successful", "status": "success"}, status=200)
        else:
            return JsonResponse({"message": "Invalid password", "status": "fail"}, status=401)
    else:
        return JsonResponse({"message": "Only POST method allowed"}, status=405)
