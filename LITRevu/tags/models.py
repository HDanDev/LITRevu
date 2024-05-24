from django.db import models
from django.utils import timezone
from users.models import CustomUser

class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name
