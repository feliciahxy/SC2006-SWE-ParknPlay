from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} # No one can read the password

    # Meta class in Django REST Framework (for building APIs) is a special class used to provide extra configuration about how the serializer should behave.
    # extra_kwargs allows additional configuration for individual fields to be specified
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) 
        return user

    # User.objects.create_user is a method provided by Django's User model to create a new user. It handles the process of hashing the password and saving the user to the database
    # The use of ** splits up the dictionary – validated_data into keyword arguments.

