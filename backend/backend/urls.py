from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from mysite import views as mysite_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("", include("mysite.urls")),  # Include 'mysite' URLs directly without a prefix
]
