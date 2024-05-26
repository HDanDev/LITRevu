from django.urls import path
from reviews.views import (
    ReviewListView,
    ReviewDetailView,
    ReviewCreateView,
    ReviewUpdateView,
    ReviewDeleteView,
)

urlpatterns = [
    path('review/<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
    path('review/<int:pk>/new/', ReviewCreateView.as_view(), name='review_create'),
    path('review/<int:pk>/edit/', ReviewUpdateView.as_view(), name='review_update'),
    path('review/<int:pk>/delete/', ReviewDeleteView.as_view(), name='review_delete'),
    path('ticket/<int:pk>', ReviewListView.as_view(), name='review_list'),
]