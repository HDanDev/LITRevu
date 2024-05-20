from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.utils import timezone
from users.models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text='Enter a valid email address.')
    # date_of_birth = forms.DateField(required=True, widget=forms.DateInput(attrs={'type': 'date', 'min': '1910-01-01', 'max': timezone.now().strftime('%Y-%m-%d')}))
    
    class Meta:
        model = CustomUser
        fields = ("email", "username", "password1", "password2")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise ValidationError("Email field is required.")
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError("This email address is already in use.")
        return email

    # def clean_date_of_birth(self):
    #     birth_date = self.cleaned_data.get('date_of_birth')
    #     today = timezone.now().date()
    #     min_birth_date = today - timezone.timedelta(days=12*365)  # 12 years ago
    #     max_birth_date = today - timezone.timedelta(days=200*365)  # 200 years ago

    #     if birth_date:
    #         if birth_date > today:
    #             raise ValidationError('Birth date cannot be in the future.')
    #         if birth_date < min_birth_date:
    #             raise ValidationError('You must be at least 12 years old to register.')
    #         if birth_date > max_birth_date:
    #             raise ValidationError('You must be younger than 200 years old to register.')
    #     return birth_date
    
    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.is_active = False 
        if commit:
            user.save()
        return user
    
class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(CustomAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['password'].widget.attrs['class'] = 'form-control'

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
    