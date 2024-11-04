from django.contrib import admin
from .models import Favourite

class FavouriteAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'latitude', 'longitude', 'created_at')
    list_filter = ('user',)
    search_fields = ('user__username', 'name')

admin.site.register(Favourite, FavouriteAdmin)
