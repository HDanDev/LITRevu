from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType
from django.views import View
from likedislikes.models import LikeDislike
from comments.models import Comment
from reviews.models import Review
from tickets.models import Ticket

class LikeDislikeView(View):
    model = None
    vote_type = None

    def post(self, request, pk):
        obj = get_object_or_404(self.model, pk=pk)
        content_type = ContentType.objects.get_for_model(obj)
        like_dislike, created = LikeDislike.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            object_id=obj.id,
            defaults={'vote': self.vote_type}
        )

        if not created:
            if like_dislike.vote == self.vote_type:
                like_dislike.delete()
            else:
                like_dislike.vote = self.vote_type
                like_dislike.save()

        return JsonResponse({
            'likes_count': LikeDislike.get_like_count(content_type, obj.id),
            'dislikes_count': LikeDislike.get_dislike_count(content_type, obj.id),
        })

class TicketLikeDislikeView(LikeDislikeView):
    model = Ticket

class CommentLikeDislikeView(LikeDislikeView):
    model = Comment

class ReviewLikeDislikeView(LikeDislikeView):
    model = Review
