from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Home Page!")


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            # Return a 400 Bad Request response with a custom error message
            return Response({"detail": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        # If the username doesn't exist, continue with the default creation process
        return super().create(request, *args, **kwargs)

# View is a function that handles a request and returns a response.
# CraeteAPIView handles POST requests for creating new records
# queryset defines the set of data that this view will interact with
# serializer_class specifies which serializer class to use for data validation and conversion
# permission_classes defines who can access this view