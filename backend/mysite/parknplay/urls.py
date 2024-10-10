from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.getUsers, name="getUsers")
    path("search", views.SearchMgr, name="SearchMgr")
]