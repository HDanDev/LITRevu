from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('user/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    path('users/', views.UserListView.as_view(), name='users'),
    path('profile/update-email/', views.update_email, name='update_email'),
    path('profile/update-username/', views.update_username, name='update_username'),
    path('profile/update-password/', views.update_password, name='update_password'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('resend-activation-email/<uidb64>/<token>/', views.resend_activation_email, name='resend_activation_email'),
    path('search-user/', views.search_users, name='search_users'),
]