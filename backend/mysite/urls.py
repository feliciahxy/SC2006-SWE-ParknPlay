from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.get_users, name="get_users"),
    path("get_place_info/", views.get_place_info, name="get_place_info"),
    path("get_place_details/", views.get_place_details, name="get_place_details"),
    path("nearby_search/", views.nearby_search, name="nearby_search"),
    path("find_nearest_carparks/", views.find_nearest_carparks, name="find_nearest_carparks"),
]
