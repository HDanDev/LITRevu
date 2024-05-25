from django.db import models
from django.contrib.auth.models import AbstractUser
    
class CustomUser(AbstractUser):
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    def __str__(self):
        return self.username
    
class UserActivation(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
class UserFollow(models.Model):
    follower = models.ForeignKey(CustomUser, related_name='user_following', on_delete=models.CASCADE)
    followed = models.ForeignKey(CustomUser, related_name='user_followers', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('follower', 'followed')