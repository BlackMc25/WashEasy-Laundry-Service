import random
import secrets
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse


def generate_verification_data():

    otp = str(random.randint(100000, 999999))

    token = secrets.token_urlsafe(32)

    expires = timezone.now() + timedelta(minutes=10)

    return otp, token, expires


def send_verification_email(user, otp, token):
    
    verify_url = (
        settings.SITE_URL +
        reverse(
            "verify_email_link",
            args=[token]
        )
    )

    context = {

        "user": user,

        "otp": otp,

        "verify_url": verify_url,

        "expiry_minutes": 10,

    }

    html_message = render_to_string(

        "emails/verification_email.html",

        context

    )

    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(

        subject="Verify your WashEasy account",

        body=plain_message,

        from_email=settings.DEFAULT_FROM_EMAIL,

        to=[user.email],

    )

    email.attach_alternative(

        html_message,

        "text/html"

    )

    email.send()