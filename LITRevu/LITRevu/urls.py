"""
URL configuration for LITRevu project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# from app.views import home as app_views_home
from tickets.views import TicketListView
from django.conf.urls import handler404, handler500
from django.conf import settings
from django.shortcuts import render
from django.conf.urls.static import static


def custom_page_not_found_view(request, exception):
    return render(request, 'errors/404.html', status=404)


def custom_error_view(request):
    return render(request, 'errors/500.html', status=500)


handler404 = 'LITRevu.urls.custom_page_not_found_view'
handler500 = 'LITRevu.urls.custom_error_view'

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', TicketListView.as_view(), name='home'),
    path("", include("users.urls")),
    path("", include("tickets.urls")),
    path("", include("reviews.urls")),
    path("", include("likedislikes.urls")),
    path("", include("follows.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
        )
