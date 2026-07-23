from django.contrib import admin
from .models import (
    LaundryOrder,
    PriceList,
    OrderItem,

    SubscriptionPlan,
    SubscriptionCategory,
    SubscriptionService,
    CustomerSubscription,
    SubscriptionUsage,
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

# ==========================================================
#                 SUBSCRIPTION ADMIN
# ==========================================================

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "price",
        "total_items",
        "validity_days",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )


@admin.register(SubscriptionCategory)
class SubscriptionCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "plan",
        "category_name",
    )

    list_filter = (
        "plan",
    )


@admin.register(SubscriptionService)
class SubscriptionServiceAdmin(admin.ModelAdmin):

    list_display = (
        "plan",
        "service_name",
    )

    list_filter = (
        "plan",
    )


@admin.register(CustomerSubscription)
class CustomerSubscriptionAdmin(admin.ModelAdmin):

    list_display = (
        "customer",
        "plan",
        "remaining_items",
        "status",
        "expiry_date",
    )

    list_filter = (
        "plan",
        "status",
    )

    search_fields = (
        "customer__username",
        "customer__email",
    )


@admin.register(SubscriptionUsage)
class SubscriptionUsageAdmin(admin.ModelAdmin):

    list_display = (
        "subscription",
        "order",
        "items_used",
        "created_at",
    )

    list_filter = (
        "created_at",
    )