from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.handleUsers, name="handleUsers"),
    path("changePassword", views.changePassword, name="changePassword"),
    path("login", views.loginView, name="loginView"),
    path("get_place_info/", views.get_place_info, name="get_place_info"),
    path("get_place_details/", views.get_place_details, name="get_place_details"),
    path("search", views.nearby_search, name="nearby_search"),
    path("favourites", views.FavouritesMgr, name="FavouritesMgr"),
    path("carparks", views.find_nearest_carparks, name="find_nearest_carparks")
]