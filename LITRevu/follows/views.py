from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from users.models import CustomUser
from django.contrib.auth.decorators import login_required
from follows.models import UserFollow

@login_required
def toggle_follow(request, pk):
    try: 
        followed_user = get_object_or_404(CustomUser, pk=pk)
        user_follow, created = UserFollow.objects.get_or_create(
            follower=request.user,
            followed=followed_user,
            defaults={'status': True}
        )
        
        if not created:
            user_follow.status = not user_follow.status
            user_follow.save()
            isSuccess = True
            error = ''
    except Exception as e:
        isSuccess = False
        error = e

    return JsonResponse({
        'success': isSuccess,
        'error': error,
        'status': user_follow.status,
        'followed_user': followed_user.id,
        'updated_at': user_follow.updated_at
    })