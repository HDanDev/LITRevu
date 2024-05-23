from django.urls import path
from articles.views import (
    ArticleListView,
    ArticleDetailView,
    ArticleCreateView,
    ArticleUpdateView,
    ArticleDeleteView,
    TicketCreateView,
    TicketListView,
    TicketUpdateView,
    TicketDeleteView
)

urlpatterns = [
    path('article/<int:pk>/', ArticleDetailView.as_view(), name='article_detail'),
    path('article/new/', ArticleCreateView.as_view(), name='article_create'),
    path('article/<int:pk>/edit/', ArticleUpdateView.as_view(), name='article_update'),
    path('article/<int:pk>/delete/', ArticleDeleteView.as_view(), name='article_delete'),
    path('ticket/<int:pk>', ArticleListView.as_view(), name='article_list'),
    path('ticket/', TicketListView.as_view(), name='ticket_list'),
    path('ticket/new/', TicketCreateView.as_view(), name='ticket_form'),
    path('ticket/<int:pk>/edit/', TicketUpdateView.as_view(), name='ticket_update'),
    path('ticket/<int:pk>/delete/', TicketDeleteView.as_view(), name='ticket_delete'),
]