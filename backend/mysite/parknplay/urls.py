from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.handleUsers, name="handleUsers"),
    path("login", views.loginView, name="loginView"),
    path("search", views.SearchMgr, name="SearchMgr")
]