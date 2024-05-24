from django.db import models
from users.models import CustomUser
from tags.models import Tag
from tickets.models import Ticket
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField(max_length=8192, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    miniature_image = models.ImageField(upload_to='miniature_images/', blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='reviews', blank=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='reviews')
    is_archived = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    followed_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
        
    def __str__(self):
        return self.title
