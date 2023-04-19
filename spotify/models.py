from django.db import models

# Create your models here.
class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    token = models.CharField(max_length=255)
    refresh = models.CharField(max_length=255)
    expires_in = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    token_type = models.CharField(max_length=50)