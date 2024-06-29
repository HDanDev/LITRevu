from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth import authenticate
from django.utils import timezone
from users.models import CustomUser
from django.forms.widgets import ClearableFileInput


class CustomClearableFileInput(ClearableFileInput):
    template_name = 'custom_widgets/custom_clearable_file_input.html'

    def __init__(self, attrs=None):
        super().__init__(attrs)

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text='Enter a valid email address.')
    
    class Meta:
        model = CustomUser
        fields = ("email", "username", "password1", "password2")
        widgets = {
            'email': forms.EmailInput(
                attrs={
                    'class': 'form-control',
                    'id': 'create-email-field'
                    }),
            'username': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'id': 'create-username-field'
                }),
            'password1': forms.PasswordInput(
                attrs={
                    'class': 'form-control', 
                    'id': 'create-password-field'
                }),
            'password2': forms.PasswordInput(
                attrs={
                    'class': 'form-control', 
                    'id': 'create-password-field'
                }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise ValidationError("Email field is required.")
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError("This email address is already in use.")
        return email
    
    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.is_active = False 
        if commit:
            user.save()
        return user
    
class CustomUserEditForm(forms.ModelForm):
    date_of_birth = forms.DateField(
        required=False,
        widget=forms.DateInput(
            attrs={
                'type': 'date',
                'min': '1910-01-01',
                'max': timezone.now().strftime('%Y-%m-%d'),
                'id': 'edit-date-field',
                'class': 'form-control',
                'label': 'Date of birth'
            })
    )

    class Meta:
        model = CustomUser
        fields = ['profile_picture', 'date_of_birth']
        widgets = {
            'profile_picture': CustomClearableFileInput,
        }

    def clean_profile_picture(self):
        image = self.cleaned_data.get('profile_picture')

        if image is self.instance.profile_picture:
            return image

        if not (image.name.endswith('.jpg') or image.name.endswith('.png')):
            raise forms.ValidationError("Only .jpg and .png files are allowed.")

        if image.size > 2 * 1024 * 1024:
            raise forms.ValidationError("Image file size must be under 2MB.")
        
        return image
        

    def clean_date_of_birth(self):
        birth_date = self.cleaned_data.get('date_of_birth')
        if birth_date:
            today = timezone.now().date()
            min_birth_date = today - timezone.timedelta(days=12*365)  # 12 years ago
            max_birth_date = today - timezone.timedelta(days=200*365)  # 200 years ago

            if birth_date > today:
                raise forms.ValidationError('Birth date cannot be in the future.')

            if birth_date > min_birth_date:
                raise forms.ValidationError('You must be at least 12 years old to register.')

            if birth_date < max_birth_date:
                raise forms.ValidationError('You must be younger than 200 years old to register.')

        return birth_date
    
class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(CustomAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'id': 'auth-username-field'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'id': 'auth-password-field'})

    def confirm_login_allowed(self, user):
        if not user.is_active:
            raise forms.ValidationError("This account is inactive.", code='inactive')

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            self.user_cache = authenticate(self.request, username=username, password=password)
            if self.user_cache is None:
                raise forms.ValidationError(
                    "Invalid username or password.",
                    code='invalid_login',
                    params={'username': self.username_field.verbose_name},
                )
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data
    
class UpdateEmailForm(forms.ModelForm):
    current_password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control', 
                'id': 'update-email-password-field'
                }),
        required=True
        )

    class Meta:
        model = CustomUser        
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(
                attrs={
                    'class': 'form-control',
                    'id': 'update-email-field'
                    })
        }
        
    def clean_current_password(self):
        current_password = self.cleaned_data['current_password']
        if not self.instance.check_password(current_password):
            raise forms.ValidationError('Incorrect password.')
        return current_password

class UpdateUsernameForm(forms.ModelForm):
    current_password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control', 
                'id': 'update-username-password-field'
                }),
        required=True
        )

    class Meta:
        model = CustomUser
        fields = ['username']
        widgets = {
            'username': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'id': 'update-username-field'
                    })
        }

    def clean_current_password(self):
        current_password = self.cleaned_data['current_password']
        if not self.instance.check_password(current_password):
            raise forms.ValidationError('Incorrect password.')
        return current_password

class UpdatePasswordForm(PasswordChangeForm):
    old_password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control', 
                'id': 'update-password-old-field'
                }),
        required=True
        )
    new_password1 = forms.CharField(
        label='New password',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control', 
                'id': 'update-password-new-field'
                }),
        required=True
        )
    new_password2 = forms.CharField(
        label='Confirm new password',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control', 
                'id': 'update-password-new-repeat-field'
                }), 
        required=True
        )

    class Meta:
        model = CustomUser
        fields = ['old_password', 'new_password1', 'new_password2']