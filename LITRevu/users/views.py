from django.contrib.auth import login, logout, update_session_auth_hash
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str, force_bytes
from django.contrib.sites.shortcuts import get_current_site
from app.utils import generate_random_numbers
from django.contrib.auth.tokens import default_token_generator
from users.form import CustomUserCreationForm, CustomAuthenticationForm, CustomUserEditForm, UpdateEmailForm, UpdateUsernameForm, UpdatePasswordForm
from users.email_utils import EmailUtils
from users.models import UserActivation, CustomUser
from follows.models import UserFollow, UserBlock
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView
from django.db.models import Exists, OuterRef
from django.db.models import Case, When, BooleanField
from django.http import JsonResponse
from django.db.models import Q
import os
import uuid
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import logging
logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user:
                login(request, user)
                return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home') 

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            current_site = get_current_site(request)
            
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            UserActivation.objects.create(user=user, token=token)
            
            email_utils = EmailUtils(user, current_site.domain, form.cleaned_data.get('email'))
            email_utils.build_email()
            
            messages.success(request, f'''
            An activation link has been sent to your email address <br />
            Did not get any? 
            <a href="/resend-activation-email/{uid}/{token}/">Get a new one</a>
            '''.format(uid=uid, token=token))
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def resend_activation_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(CustomUser, pk=uid)
        
        if default_token_generator.check_token(user, token):
            if not user.is_active:
                current_site = get_current_site(request)
                email_utils = EmailUtils(user, current_site.domain, user.email)
                email_utils.build_email()                
                print('so far so good')
                messages.success(request, f'''
                An activation link has been resent to your email address. <br />
                Did not receive it? 
                <a href="/resend-activation-email/{uidb64}/{token}/">Resend activation email again</a>
                '''.format(uid=uidb64, token=token))
            else:
                messages.info(request, 'Already activated')
        else:
            messages.error(request, 'Invalid activation link')
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        messages.error(request, 'Failed to resend email')
    return redirect('home')

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        messages.success(request, "Congratulations! Your account has been successfully activated!")
    else:
        messages.error(request, 'Failed to activate account')
    return redirect('home')
        # users/views.py

@login_required
def profile_view(request):
    form = CustomUserEditForm(instance=request.user)
    email_form = UpdateEmailForm(instance=request.user)
    username_form = UpdateUsernameForm(instance=request.user)
    password_form = UpdatePasswordForm(request.user)
    blocked_users_ids = UserBlock.objects.filter(blocker=request.user).values_list('blocked', flat=True)
    blocked_users = CustomUser.objects.filter(id__in=blocked_users_ids)

    followers_status = Case(
        When(followers__follower=request.user, followers__status=True, then=True),
        default=False,
        output_field=BooleanField()
    )
       
    followed_users = CustomUser.objects.filter(
        followers__follower=request.user,
        followers__status=True
    ).exclude(pk=request.user.pk).annotate(
        followers_status=followers_status
    )

    following_users = CustomUser.objects.filter(
        following__followed=request.user,
        following__status=True
    ).exclude(
        pk=request.user.pk
    ).annotate(
        followers_status=followers_status
    )

    followed_user_ids = followed_users.values_list('id', flat=True)
    users_list = CustomUser.objects.exclude(
        pk=request.user.pk
    ).exclude(
        pk__in=followed_user_ids
    )
    colour_numbers = generate_random_numbers()[:10]
    context = {
        'form': form, 
        'email_form': email_form, 
        'username_form': username_form, 
        'password_form': password_form, 
        'followed_users': followed_users,
        'following_users': following_users,
        'users_list': users_list,
        'blocked_users' : blocked_users,
    }
    context.update({
        'col{}'.format(i): colour_numbers[i] for i in range(min(len(colour_numbers), 10))
        })

    return render(request, 'profile.html', context)

@login_required
def update_profile(request):
    if request.method == 'POST':
        form = CustomUserEditForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            user = CustomUser.objects.get(pk=request.user.pk)
            old_profile_picture_path = user.profile_picture.path if user.profile_picture else None
            new_profile_picture = form.cleaned_data['profile_picture']
            if new_profile_picture and new_profile_picture != user.profile_picture:
                try:
                    img = Image.open(new_profile_picture)
                    img_format = img.format

                    output = BytesIO()

                    if img_format == 'JPEG':
                        img.save(output, format='JPEG', quality=85)
                        content_type = 'image/jpeg'
                    elif img_format == 'PNG':
                        img.save(output, format='PNG', optimize=True)
                        content_type = 'image/png'

                    output_size = output.tell()
                    output.seek(0)

                    new_filename = "{}.{}".format(uuid.uuid4(), img_format.lower())

                    optimized_image = InMemoryUploadedFile(
                        output, 'ImageField', new_filename, content_type, output_size, None
                    )

                    user.profile_picture = optimized_image
                    user.save()
                    request.user = user

                    if old_profile_picture_path and os.path.isfile(old_profile_picture_path):
                        try:
                            os.remove(old_profile_picture_path)
                            messages.success(request, "Your profile has been successfully updated")
                            # return JsonResponse({'success': True, 'message': 'Your profile was successfully updated!'})
                            return profile_view(request)
                            
                        except Exception as e:
                            print(f"Error deleting old profile picture: {e}")
                            # return JsonResponse({'success': False, 'errors': 'An error occurred while deleting your previous profile picture'})
                            return profile_view(request)
                except Exception as e:
                    messages.error(request, 'An error occurred while updating your profile')
                    # return JsonResponse({'success': False, 'errors': form.errors})
                    return profile_view(request)
            else: 
                user.date_of_birth = form.cleaned_data['date_of_birth']
                user.save()
                messages.success(request, "Your date of birth has been successfully updated")
                # return JsonResponse({'success': True, 'message': 'Your date of birth has been successfully updated!'})
                return profile_view(request)
        else:
            messages.error(request, 'An error occurred while updating your profile')
            # return JsonResponse({'success': False, 'errors': form.errors})
            return profile_view(request)
    else:
        # return JsonResponse({'success': False, 'message': 'Invalid request method.'})
        return profile_view(request)

@login_required
def update_email(request):
    if request.method == 'POST':
        form = UpdateEmailForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your email was successfully updated!')
            return JsonResponse({
                'success': True,
                'message': 'Your email was successfully updated!',
                'email': request.user.email
                })
        else:
            messages.error(request, 'An error occurred while updating your email')
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })

@login_required
def update_username(request):
    if request.method == 'POST':
        form = UpdateUsernameForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your username was successfully updated!')
            return JsonResponse({
                'success': True,
                'message': 'Your username was successfully updated!',
                'username': request.user.username
            })
        else:
            messages.error(request, 'An error occurred while updating your username')
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })

@login_required
def update_password(request):
    if request.method == 'POST':
        form = UpdatePasswordForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return JsonResponse({'success': True, 'message': 'Your password was successfully updated!'})
        else:
            messages.error(request, 'An error occurred while updating your password')
            return JsonResponse({'success': False, 'errors': form.errors})

class UserListView(LoginRequiredMixin, ListView):
    model = CustomUser
    template_name = 'user_list.html'
    context_object_name = 'users'

    def get_queryset(self):
        current_user = self.request.user
        return CustomUser.objects.exclude(id=current_user.id).annotate(
            is_followed_by_current_user=Exists(
                UserFollow.objects.filter(followed=OuterRef('pk'), follower=current_user, status=True)
            )
        )

class UserDetailView(LoginRequiredMixin, DetailView):
    model = CustomUser
    template_name = 'user_detail.html'
    context_object_name = 'user'

    def get_queryset(self):
        current_user = self.request.user
        return CustomUser.objects.exclude(id=current_user.id).annotate(
            is_followed_by_current_user=Exists(
                UserFollow.objects.filter(followed=OuterRef('pk'), follower=current_user, status=True)
            )
        )

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, pk=self.kwargs['pk'])

def search_users(request):
    query = request.GET.get('query', '')
    if query:
        users = CustomUser.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        )
        data = [{'username': user.username, 'email': user.email} for user in users]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse([], safe=False)
