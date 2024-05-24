from django.db import models
from django.utils import timezone
from users.models import CustomUser
from reviews.models import Review

class Comment(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False) 

    def __str__(self):
        return f'Comment by {self.author} on {self.review}'
