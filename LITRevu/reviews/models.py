from django.db import models
from users.models import CustomUser
from tags.models import Tag
from tickets.models import Ticket
from likedislikes.models import LikeDislike
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.models import ContentType

class Review(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField(max_length=8192, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    miniature_image = models.ImageField(upload_to='miniature_images/', blank=True, null=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='reviews')
    is_archived = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    
    def save(self, *args, **kwargs):
        if self.is_archived and not self.pk:
            self.comments.all().update(is_archived=True)
        super().save(*args, **kwargs)
        
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
