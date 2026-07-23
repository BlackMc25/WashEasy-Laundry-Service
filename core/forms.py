from django import forms
from .models import LaundryOrder, SiteSettings
from datetime import date


class LaundryOrderForm(forms.ModelForm):

    pickup_address = forms.CharField(
        required=False
        )

    delivery_address = forms.CharField(
        required=False
        )

    class Meta:

        model = LaundryOrder

        fields = [
            'pickup_address',
            'delivery_address',

            'pickup_latitude',
            'pickup_longitude',

            'delivery_latitude',
            'delivery_longitude',

            'pickup_date',
            'special_instructions',
            'payment_method',

            'pickup_distance_km',
            'delivery_distance_km',
            'total_distance_km',
            'phone_number'
            
        ]

        widgets = {

            'pickup_address':
                forms.CharField(
                    required=False, widget=forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'rows': 2,
                        'id': 'pickup-address',
                        'placeholder': 'Enter Pickup Address',
                        'autocomplete': 'off'

                        }

                     )
                ),

            'delivery_address':
                forms.CharField( required=False, widget=forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'rows': 2,
                        'id': 'delivery-address',
                        'placeholder': 'Enter delivery Address',
                        'autocomplete':'off'
                        }
                    )
                ),

            'pickup_latitude':
                forms.HiddenInput(),

            'pickup_longitude':
                forms.HiddenInput(),

            'delivery_latitude':
                forms.HiddenInput(),

            'delivery_longitude':
                forms.HiddenInput(),

            'pickup_date':
                forms.DateInput(
                    attrs={
                        'class': 'form-control',
                        'type': 'date',
                        'min': date.today().strftime('%Y-%m-%d')
                    }
                ),

            'special_instructions':
                forms.Textarea(
                    attrs={
                        'class': 'form-control',
                        'rows': 3
                    }
                ),

            'payment_method':
                forms.Select(
                    attrs={
                        'class': 'form-select'
                    }
                ),

                'pickup_distance_km':
                    forms.HiddenInput(),

                'delivery_distance_km':
                    forms.HiddenInput(),

                'total_distance_km':
                    forms.HiddenInput(),
        }

class SiteSettingsForm(forms.ModelForm):
    
    class Meta:

        model = SiteSettings

        fields = [

            'business_name',

            'business_email',

            'business_phone',

            'business_address',

            'business_latitude',

            'business_longitude',

            'transport_price_per_km',

            'support_email',

            'notification_sound',

        ]

        widgets = {

            'business_name': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'business_email': forms.EmailInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'business_phone': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'business_address': forms.TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'business_latitude': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'step': 'any'
                }
            ),

            'business_longitude': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'step': 'any'
                }
            ),

            'transport_price_per_km': forms.NumberInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'support_email': forms.EmailInput(
                attrs={
                    'class': 'form-control'
                }
            ),

            'notification_sound': forms.CheckboxInput(
                attrs={
                    'class': 'form-check-input'
                }
            ),

        }

# ==========================================================
#               SUBSCRIPTION FORM
# ==========================================================

from .models import CustomerSubscription


class CustomerSubscriptionForm(forms.ModelForm):

    class Meta:

        model = CustomerSubscription

        fields = [

            "start_date",

        ]

        widgets = {

            "start_date": forms.DateInput(

                attrs={

                    "type": "date",

                    "class": "form-control",

                }

            ),

        }