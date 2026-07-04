from django.contrib import admin
from .models import (
    LaundryOrder,
    PriceList,
    OrderItem
)

admin.site.register(LaundryOrder)
admin.site.register(PriceList)
admin.site.register(OrderItem)