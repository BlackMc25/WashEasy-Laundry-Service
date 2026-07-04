from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):

    email = models.EmailField(
        unique=True
    )

    delete_pin = models.CharField(
    max_length=4,
    blank=True,
    null=True
    )

    delete_pin_created = models.DateTimeField(
    blank=True,
    null=True
    )

    phone_number = models.CharField(
    max_length=15,
    unique=True,
    null=True,
    blank=True
    )

    theme = models.CharField(
        max_length=20,
        default='light'
    )

    default_pickup_address = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    default_delivery_address = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username
    
    

class AdminDeletePIN(models.Model):

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    pin = models.CharField(
        max_length=4
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    purpose = models.CharField(
        max_length=50,
        default="customer_delete"
    )

    customer_id = models.IntegerField()

    def __str__(self):

        return f"{self.admin.username} - {self.purpose}"
    

