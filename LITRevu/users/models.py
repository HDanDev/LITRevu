from django.db import models
from django.contrib.auth.models import User, AbstractUser

class UserActivation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
# class CustomUser(AbstractUser):
#     date_of_birth = models.DateField(null=True, blank=True)
    
#     def __str__(self):
#         return self.username
