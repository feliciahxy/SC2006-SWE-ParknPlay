from django.db import models

# Create your models here.
class Favourite(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    rating = models.FloatField()
    coordinates = models.JSONField()
    photo = models.CharField(max_length=255)
    
class User(models.Model):
    username = models.CharField(max_length=100)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    salt = models.CharField(max_length=100)
    favourites = models.ManyToManyField(Favourite)