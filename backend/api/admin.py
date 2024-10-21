# api/admin.py
from django.contrib import admin
from .models import Favourite

class FavouriteAdmin(admin.ModelAdmin):
    # Display fields in the admin list view
    list_display = ('name', 'user', 'latitude', 'longitude', 'created_at')
    # Add filters for user and other fields
    list_filter = ('user',)
    # Add a search bar for user and name fields
    search_fields = ('user__username', 'name')

# Register the Favourite model with the custom admin class
admin.site.register(Favourite, FavouriteAdmin)
