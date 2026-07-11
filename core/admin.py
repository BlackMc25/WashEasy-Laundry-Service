from django.contrib import admin
from .models import (
    LaundryOrder,
    PriceList,
    OrderItem
)

admin.site.register(LaundryOrder)

@admin.register(PriceList)
class PriceListAdmin(admin.ModelAdmin):

    list_display = (
        "item_name",
        "category",
        "service_type",
        "price",
        "express_price",
        "express_available",
    )

    list_filter = (
        "category",
        "service_type",
        "express_available",
    )

    search_fields = (
        "item_name",
    )

    ordering = (
        "category",
        "item_name",
    )

admin.site.register(OrderItem)