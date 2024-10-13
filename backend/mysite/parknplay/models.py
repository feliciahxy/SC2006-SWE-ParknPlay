from django.db import models

# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=100)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    salt = models.CharField(max_length=100)
    isVerified = models.BooleanField()
    verificationCode = models.CharField(max_length=100)
    
class Favourite(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    address = models.TextField()
    rating = models.FloatField()
    price_level = models.IntegerField()
    opening_hours = models.JSONField()
    photos = models.JSONField()
    photo_reference = models.CharField(max_length=255)