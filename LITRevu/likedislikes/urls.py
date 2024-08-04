from django.urls import path
from likedislikes.views import TicketLikeDislikeView, CommentLikeDislikeView, ReviewLikeDislikeView
from likedislikes.models import LikeDislike

urlpatterns = [
    path('ticket/<int:pk>/like/', TicketLikeDislikeView.as_view(vote_type=LikeDislike.LIKE), name='ticket_like'),
    path('ticket/<int:pk>/dislike/', TicketLikeDislikeView.as_view(vote_type=LikeDislike.DISLIKE), name='ticket_dislike'),
    path('comment/<int:pk>/like/', CommentLikeDislikeView.as_view(vote_type=LikeDislike.LIKE), name='comment_like'),
    path('comment/<int:pk>/dislike/', CommentLikeDislikeView.as_view(vote_type=LikeDislike.DISLIKE), name='comment_dislike'),
    path('review/<int:pk>/like/', ReviewLikeDislikeView.as_view(vote_type=LikeDislike.LIKE), name='review_like'),
    path('review/<int:pk>/dislike/', ReviewLikeDislikeView.as_view(vote_type=LikeDislike.DISLIKE), name='review_dislike'),
]
