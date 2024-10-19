# api/views.py
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from .models import Favourite
from .serializers import UserSerializer, FavouriteSerializer


def home(request):
    """Simple view to render the home page."""
    return HttpResponse("Welcome to the Home Page!")


class CreateUserView(generics.CreateAPIView):
    """
    API view to create a new user.
    - Allows any user to create an account.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')

        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)


class FavouriteListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create user favourites.
    - Only authenticated users can access this view.
    - Lists all favourites belonging to the authenticated user.
    """
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return favourites only for the authenticated user.
        """
        return Favourite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Associate the new favourite with the authenticated user.
        """
        serializer.save(user=self.request.user)


class FavouriteDeleteView(generics.DestroyAPIView):
    """
    API view to delete a favourite.
    - Only authenticated users can access this view.
    - Only favourites belonging to the authenticated user can be deleted.
    """
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return favourites only for the authenticated user.
        """
        return Favourite.objects.filter(user=self.request.user)
