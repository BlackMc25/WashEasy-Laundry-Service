from django.contrib import admin
from .models import CustomerReward

from .models import (
    WeekendRewardCampaign,
    RewardPrize,
    SpinHistory,
    RewardNotification,
    RewardPolicy,
    RewardPolicyCategory,
    RewardPolicyService,
)



class RewardPrizeInline(admin.TabularInline):
    
    model = RewardPrize

    extra = 1

@admin.register(WeekendRewardCampaign)
class WeekendRewardCampaignAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "status",
        "start_time",
        "end_time",
        "max_winners",
        "winners_count",
        "is_live",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "title",
    )

    readonly_fields = (
        "winners_count",
        "created_at",
        "updated_at",
    )

    inlines = [
        RewardPrizeInline,
    ]

@admin.register(RewardPrize)
class RewardPrizeAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "campaign",
        "prize_type",
        "value",          # ✅
        "policy",
        "probability",
        "is_active",
    )
    list_filter = (
        "campaign",
        "prize_type",
        "policy",
        "is_active",
    )

    search_fields = (
        "name",
    )

@admin.register(SpinHistory)
class SpinHistoryAdmin(admin.ModelAdmin):

    list_display = (
        "customer",
        "campaign",
        "prize",
        "spin_number",
        "has_won",
        "reward_claimed",
        "reward_applied",
        "spun_at",
    )

    list_filter = (
        "campaign",
        "has_won",
        "reward_claimed",
    )

    search_fields = (
        "customer__username",
    )

    readonly_fields = (
        "customer",
        "campaign",
        "prize",
        "spin_number",
        "has_won",
        "reward_claimed",
        "reward_applied",
        "spun_at",
    )

@admin.register(RewardNotification)
class RewardNotificationAdmin(admin.ModelAdmin):

    list_display = (
        "customer",
        "campaign",
        "email_sent",
        "bubble_seen",
        "notified_at",
    )

    list_filter = (
        "email_sent",
        "bubble_seen",
    )

    search_fields = (
        "customer__username",
    )
@admin.register(CustomerReward)
class CustomerRewardAdmin(admin.ModelAdmin):

    list_display = (
        "customer",
        "prize",
        "status",
        "remaining_items",
        "free_transport_trips",
        "activated_at",
    )

    list_filter = (
        "status",
        "activated_at",
    )

    search_fields = (
        "customer__username",
        "customer__email",
        "prize__name",
    )

    readonly_fields = (
        "activated_at",
    )

@admin.register(RewardPolicyCategory)
class RewardPolicyCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "policy",
        "category",
    )

    list_filter = (
        "policy",
        "category",
    )

    search_fields = (
        "policy__name",
        "category",
    )



class RewardPolicyCategoryInline(admin.TabularInline):
    
    model = RewardPolicyCategory

    extra = 1

class RewardPolicyServiceInline(admin.TabularInline):
    
    model = RewardPolicyService

    extra = 1

@admin.register(RewardPolicy)
class RewardPolicyAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "is_active",
    )

    search_fields = (
        "name",
    )

    list_filter = (
        "is_active",
    )

    inlines = [
        RewardPolicyCategoryInline,
        RewardPolicyServiceInline,
    ]