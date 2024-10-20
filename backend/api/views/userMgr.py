from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from ..serializers import UserSerializer
from django.http import JsonResponse

class CreateUserView(generics.CreateAPIView):
    """API view to create a new user."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

def home(request):
    """Basic endpoint to check if the backend is running."""
    return JsonResponse({"message": "Backend is up"})

class GetUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
