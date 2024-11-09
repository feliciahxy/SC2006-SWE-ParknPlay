from django.urls import path
from .views.favouritesMgr import FavouriteListCreateView, FavouriteDeleteView
from .views.carparksMgr import find_nearest_carparks
from .views.userMgr import CreateUserView, home, GetUsersView
from .views.searchMgr import nearby_search 
from .views.passwordMgr import ChangePasswordView

urlpatterns = [
    path('favourites/', FavouriteListCreateView.as_view(), name='favourite-list-create'),
    path('favourites/<int:pk>/', FavouriteDeleteView.as_view(), name='favourite-delete'),
    path('carparks/', find_nearest_carparks, name='find_nearest_carparks'),
    path('register/', CreateUserView.as_view(), name='register'),
    path('home/', home, name='home'),
    path('users/', GetUsersView.as_view(), name='get_users'),
    path('nearby_search/', nearby_search, name='nearby_search'),  
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
