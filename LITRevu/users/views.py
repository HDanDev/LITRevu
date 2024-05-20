from django.contrib.auth import login, logout
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str, force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from users.form import CustomUserCreationForm, CustomAuthenticationForm
from users.email_utils import EmailUtils
from users.models import UserActivation, CustomUser

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
        