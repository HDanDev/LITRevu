from django.db import models
from users.models import CustomUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class LikeDislike(models.Model):
    LIKE = 1
    DISLIKE = -1

    VOTE_TYPE = (
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    vote = models.SmallIntegerField(choices=VOTE_TYPE)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')

    @classmethod
    def get_like_count(cls, content_type, object_id):
        return cls.objects.filter(content_type=content_type, object_id=object_id, vote=cls.LIKE).count()

    @classmethod
    def get_dislike_count(cls, content_type, object_id):
        return cls.objects.filter(content_type=content_type, object_id=object_id, vote=cls.DISLIKE).count()