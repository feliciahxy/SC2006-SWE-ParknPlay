from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Favourite
from ..serializers import FavouriteSerializer

class FavouriteListCreateView(generics.ListCreateAPIView):
    """
    View to list and create favourites for the authenticated user.
    """
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can access

    def get_queryset(self):
        # Return only the favourites of the authenticated user
        user = self.request.user
        return Favourite.objects.filter(user=user)

    def perform_create(self, serializer):
        # Save the favourite with the authenticated user
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Check if a favourite with the same name and location already exists for the user
        name = request.data.get('name')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        user = request.user

        if Favourite.objects.filter(user=user, name=name, latitude=latitude, longitude=longitude).exists():
            return Response(
                {"detail": "This favourite already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

class FavouriteDeleteView(generics.DestroyAPIView):
    """
    View to delete a specific favourite of the authenticated user.
    """
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can access

    def get_queryset(self):
        # Only allow deletion of the authenticated user's favourites
        user = self.request.user
        return Favourite.objects.filter(user=user)

    def delete(self, request, *args, **kwargs):
        # Delete the favourite and return a custom response
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Favourite deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
