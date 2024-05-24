from django.db import models
from users.models import CustomUser

class UserFollows(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='following')
    followed_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='followed_by')

    class Meta:
        unique_together = ('user', 'followed_user')