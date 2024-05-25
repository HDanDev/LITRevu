from django.db import models
from users.models import CustomUser
from tags.models import Tag
from likedislikes.models import LikeDislike
from django.contrib.contenttypes.models import ContentType

class Ticket(models.Model):
    title = models.CharField(max_length=128)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    description = models.TextField(max_length=2048, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='tickets_images/', blank=True, null=True)
    miniature = models.ImageField(upload_to='tickets_miniatures/', blank=True, null=True)
    is_archived = models.BooleanField(default=False) 
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Tag.objects.get_or_create(name=self.title)
        
    def get_likes_count(self):
        return LikeDislike.objects.filter(
            content_type=ContentType.objects.get_for_model(self),
            object_id=self.pk,
            vote=LikeDislike.LIKE
        ).count()

    def get_dislikes_count(self):
        return LikeDislike.objects.filter(
            content_type=ContentType.objects.get_for_model(self),
            object_id=self.pk,
            vote=LikeDislike.DISLIKE
        ).count()

    def __str__(self):
        return self.title
