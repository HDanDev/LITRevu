from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator


class EmailUtils:
    def __init__(self,
                 user,
                 domain,
                 email,
                 title='Activate your account.',
                 template='acc_active_email.html'
                 ) -> None:
        self._user = user
        self._domain = domain
        self._email = email
        self._title = title
        self._template = template

    def build_email(self):
        mail_subject = self._title
        message = render_to_string(self._template, {
            'user': self._user,
            'domain': self._domain,
            'uid': urlsafe_base64_encode(force_bytes(self._user.pk)),
            'token': default_token_generator.make_token(self._user),
        })
        email = EmailMessage(mail_subject, message, to=[self._email])
        email.send()
