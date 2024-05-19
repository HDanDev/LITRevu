from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from users.models import CustomUser
# from users.form import CustomUserCreationForm

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserCreationForm
#     model = CustomUser
#     list_display = ('username', 'email', 'is_staff', 'is_active', 'date_of_birth',)
#     list_filter = ('is_staff', 'is_active',)
#     fieldsets = (
#         (None, {'fields': ('username', 'email', 'password', 'date_of_birth')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('username', 'email', 'date_of_birth', 'password1', 'password2', 'is_staff', 'is_active')}
#         ),
#     )
#     search_fields = ('username', 'email',)
#     ordering = ('username',)

# admin.site.register(CustomUser, CustomUserAdmin)
