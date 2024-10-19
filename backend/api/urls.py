# api/urls.py
from django.urls import path
from .views import FavouriteListCreateView, FavouriteDeleteView

urlpatterns = [
    path('favourites/', FavouriteListCreateView.as_view(), name='favourite-list-create'),
    path('favourites/<int:pk>/', FavouriteDeleteView.as_view(), name='favourite-delete'),
]
