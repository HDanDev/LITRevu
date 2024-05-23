from django.db import models
from django.utils import timezone
from users.models import CustomUser

class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='tickets_images/', blank=True, null=True)
    miniature = models.ImageField(upload_to='tickets_miniatures/', blank=True, null=True)
    is_archived = models.BooleanField(default=False) 
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Tag.objects.get_or_create(name=self.title)

    def __str__(self):
        return self.title

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    miniature_image = models.ImageField(upload_to='miniature_images/', blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='articles')
    is_archived = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False) 

    def __str__(self):
        return f'Comment by {self.author} on {self.article}'
