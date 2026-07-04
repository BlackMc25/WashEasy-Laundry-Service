from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.exceptions import ValidationError
from .models import CustomUser
from django.contrib import messages
from django.shortcuts import redirect


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def populate_user(self, request, sociallogin, data):

        user = super().populate_user(
            request,
            sociallogin,
            data
        )

        email = data.get("email", "").lower()

        if CustomUser.objects.filter(
                email__iexact=email
            ).exists():

                messages.error(
                    request,
                    "An account with this email already exists. Please log in instead."
                )

                return redirect("home")
        
        user.email = email

        user.first_name = (
            data.get("first_name")
            or data.get("given_name", "")
        )

        user.last_name = (
            data.get("last_name")
            or data.get("family_name", "")
        )

        return user