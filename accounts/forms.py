from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
import re
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

        if len(username) < 5:

            raise forms.ValidationError(
                "Username must contain at least 5 characters."
            )

        if len(username) > 20:

            raise forms.ValidationError(
                "Username cannot exceed 20 characters."
            )

        if not re.match(
            r'^[A-Za-z][A-Za-z0-9_]*$',
            username
        ):

            raise forms.ValidationError(
                "Username must start with a letter and contain only letters, numbers and underscore (_)."
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

        return email.lower()
    
    def clean_phone_number(self):
    
        phone = self.cleaned_data.get("phone_number")

        if CustomUser.objects.filter(
            phone_number=phone
        ).exists():

            raise forms.ValidationError(
                "This phone number is already registered."
            )

        return phone
    
    def clean_password1(self):
    
        password = self.cleaned_data.get("password1")

        if len(password) < 8:

            raise forms.ValidationError(
                "Password must contain at least 8 characters."
            )

        if not re.search(r"[A-Z]", password):

            raise forms.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", password):

            raise forms.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", password):

            raise forms.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):

            raise forms.ValidationError(
                "Password must contain at least one special character."
            )

        return password

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