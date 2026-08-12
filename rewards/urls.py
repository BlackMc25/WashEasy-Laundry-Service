from django.urls import path
from . import views
from .views import (
    SpinWheelAPIView,
    CurrentCampaignAPIView,
    SpinHistoryAPIView,
    RewardNotificationAPIView,
    RewardValidationAPIView,

    reward_rules,
    spin_page,
)

from core import admin_views
from core.booking_api import  RewardLaundryValidationAPIView
from core.booking_api import    RewardTransportValidationAPIView
from core.booking_api import   RewardSubscriptionValidationAPIView



urlpatterns = [


    # ===============================
    # HTML Pages
    # ===============================

    path(
        "rules/",
        reward_rules,
        name="reward-rules",
    ),

    path(
        "wheel/",
        spin_page,
        name="reward-wheel",
    ),

        # My Rewards
    path(
        "my-rewards/",
        views.my_rewards,
        name="my-rewards"
    ),

    path(
    "activate/<int:reward_id>/",
    views.activate_reward,
    name="activate-reward",
    ),

    path(
        "remove/<int:reward_id>/",
        views.remove_booking_reward,
        name="remove-booking-reward",
    ),

    path(
    "rewards/",
    admin_views.admin_rewards_dashboard,
    name="admin_rewards_dashboard",
),

    # ===============================
    # API Endpoints
    # ===============================
    path(
        "spin/",
        SpinWheelAPIView.as_view(),
        name="spin-wheel"
    ),

    path(
        "validate-booking/",
        RewardValidationAPIView.as_view(),
        name="validate-booking",
    ),

    path(
        "campaign/",
        CurrentCampaignAPIView.as_view(),
        name="current-campaign"
    ),

    path(
        "history/",
        SpinHistoryAPIView.as_view(),
        name="spin-history"
    ),

    path(
        "notifications/",
        RewardNotificationAPIView.as_view(),
        name="reward-notifications"
    ),

        path(

        "api/rewards/validate-booking/",

        RewardValidationAPIView.as_view(),

        name="validate-booking"

    ),

     path(
        "validate-booking/",
        RewardLaundryValidationAPIView.as_view(),
        name="reward-validate-booking",
    ),
    path(
        "validate-transport/",
        RewardTransportValidationAPIView.as_view(),
        name="reward-validate-transport",
    ),
    path(
        "validate-subscription/",
        RewardSubscriptionValidationAPIView.as_view(),
        name="reward-validate-subscription",
    ),

]