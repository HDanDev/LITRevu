from django import template
from follows.models import UserFollow


register = template.Library()


@register.filter
def is_following(user, other_user):
    if user.is_authenticated:
        try:
            user_follow = UserFollow.objects.get(follower=user, followed=other_user)
            return user_follow.status
        except UserFollow.DoesNotExist:
            pass
    return False
