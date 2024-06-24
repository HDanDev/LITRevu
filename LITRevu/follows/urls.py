from django.urls import path
from follows import views

urlpatterns = [
    path('toggle-follow/<int:pk>/', views.toggle_follow, name='toggle_follow'),
    path('toggle-block/<int:pk>/', views.toggle_block, name='toggle_block'),
]