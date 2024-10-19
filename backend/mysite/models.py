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
    
