from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser


class SignUpForm(UserCreationForm):

    first_name = forms.CharField(required=True)

    last_name = forms.CharField(required=True)

    email = forms.EmailField(required=True)

    phone_number = forms.CharField(
        max_length=15,
        required=True
    )

    class Meta:

        model = CustomUser

        fields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'phone_number',
            'password1',
            'password2'
        ]

    def clean_username(self):

        username = self.cleaned_data.get("username")

        if CustomUser.objects.filter(
            username__iexact=username
        ).exists():

            raise forms.ValidationError(
                "This username is already taken."
            )

        return username

    def clean_email(self):

        email = self.cleaned_data.get("email")

        if CustomUser.objects.filter(
            email__iexact=email
        ).exists():

            raise forms.ValidationError(
                "An account with this email already exists."
            )

        return email

class ProfileUpdateForm(forms.ModelForm):
    
    class Meta:

        model = CustomUser

        fields = [

            'first_name',

            'last_name',

            'email',

            'phone_number',

            'theme',

            'default_pickup_address',

            'default_delivery_address',

        ]

        widgets = {

            'first_name': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'last_name': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'email': forms.EmailInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'phone_number': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'theme': forms.Select(

                choices=[

                    ('light', 'Light Mode'),

                    ('dark', 'Dark Mode')

                ],

                attrs={
                    'class': 'form-select'
                }

            ),

            'default_pickup_address': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'id': 'default-pickup-address'
                }
            ),

            'default_delivery_address': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'id': 'default-delivery-address'
                }
            ),
        }



class ContactForm(forms.Form):

    name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    subject = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    message = forms.CharField(
        widget=forms.Textarea(
            attrs={
                'class': 'form-control',
                'rows': 5
            }
        )
    )