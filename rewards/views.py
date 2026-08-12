from django.shortcuts import (
    get_object_or_404,
    render,
)

from django.contrib.auth.decorators import login_required
from rewards.utils import get_reward_context
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import LaundryOrder
from .models import CustomerReward
from .services import RewardEngine
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone

from .models import (
    WeekendRewardCampaign,
    SpinHistory,
    RewardNotification,
    CustomerReward,
)

from .serializers import (
    WeekendRewardCampaignSerializer,
    SpinHistorySerializer,
    RewardNotificationSerializer,
)

from rewards.services import RewardEngine

class SpinWheelAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        campaign = WeekendRewardCampaign.objects.filter(
            status="Live"
        ).first()

        if not campaign:

            return Response(
                {
                    "detail": "No active reward campaign."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        try:

            spin = RewardEngine.spin(
                customer=request.user,
                campaign=campaign
            )

        except ValueError as e:

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(

            {
                "message": "Wheel spun successfully.",

                "has_won": spin.has_won,

                "spin_number": spin.spin_number,

                "remaining_spins": RewardEngine.remaining_spins(
                    request.user,
                    campaign
                ),

                "prize": {
                    "id": spin.prize.id if spin.prize else None,
                    "name": spin.prize.name if spin.prize else None,
                    "type": spin.prize.prize_type if spin.prize else None,
                    "value": spin.prize.value if spin.prize else None,
                }

            },

            status=status.HTTP_200_OK

        )

class CurrentCampaignAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):

        campaign = WeekendRewardCampaign.objects.filter(
            status="Live"
        ).first()

        if not campaign:

            return Response(
                {
                    "detail": "No active campaign."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = WeekendRewardCampaignSerializer(
            campaign
        )

        return Response(serializer.data)

class SpinHistoryAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):

        history = SpinHistory.objects.filter(
            customer=request.user
        )

        serializer = SpinHistorySerializer(
            history,
            many=True
        )

        return Response(serializer.data)

class RewardNotificationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = RewardNotification.objects.filter(
            customer=request.user
        )

        serializer = RewardNotificationSerializer(
            notifications,
            many=True
        )

        return Response(serializer.data)

class RewardValidationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        items = request.data.get("items", [])

        result = RewardEngine.validate_booking(

            customer=request.user,

            booking_items=items

        )

        return Response(result)

@login_required
def reward_rules(request):
    """
    Displays the Weekend Rewards rules page.
    """

    campaign = WeekendRewardCampaign.objects.filter(
        status="Live"
    ).first()

    has_completed_order = LaundryOrder.objects.filter(
        customer=request.user,
        status="Delivered"
    ).exists()

    context = get_reward_context(request.user)

    context["has_completed_order"] = has_completed_order

    return render(
        request,
        "rewards/reward_rules.html",
        context,
    )


@login_required
def spin_page(request):
    """
    Displays the reward spinning wheel.
    """

    context = get_reward_context(
        request.user
    )

    campaign = context["campaign"]

    prizes = []

    if campaign:

        prizes = campaign.prizes.filter(
            is_active=True
        ).order_by("id")

    context["prizes"] = [
        {
            "id": prize.id,
            "name": prize.name,
            "type": prize.prize_type,
            "value": prize.value,
            "probability": prize.probability,
        }
        for prize in prizes
    ]

    return render(
        request,
        "rewards/spin_page.html",
        context,
    )

from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def my_rewards(request):

    active_rewards = CustomerReward.objects.filter(
        customer=request.user,
        status="Active"
    ).select_related(
        "prize",
        "spin"
    )

    used_rewards = CustomerReward.objects.filter(
        customer=request.user,
        status="Completed"
    ).select_related(
        "prize",
        "spin"
    )

    expired_rewards = CustomerReward.objects.filter(
        customer=request.user,
        status="Expired"
    ).select_related(
        "prize",
        "spin"
    )

    context = {

        "active_rewards": active_rewards,

        "used_rewards": used_rewards,

        "expired_rewards": expired_rewards,

    }

    return render(

        request,

        "rewards/my_rewards.html",

        context

    )

@login_required
def activate_reward(request, reward_id):

    reward = get_object_or_404(
        CustomerReward,
        id=reward_id,
        customer=request.user
    )

    booking_ready_count = CustomerReward.objects.filter(
        customer=request.user,
        is_booking_ready=True,
        status="Active"
    ).count()

    if reward.is_booking_ready:

        messages.info(
            request,
            "This reward is already ready for booking."
        )

        return redirect("my-rewards")

    if booking_ready_count >= 2:

        messages.warning(
            request,
            "You can only prepare two rewards for booking."
        )

        return redirect("my-rewards")

    reward.is_booking_ready = True
    reward.booking_ready_at = timezone.now()

    reward.save()

    messages.success(
        request,
        "Reward prepared for booking."
    )

    return redirect("my-rewards")

@login_required
def remove_booking_reward(request, reward_id):

    reward = get_object_or_404(
        CustomerReward,
        id=reward_id,
        customer=request.user
    )

    reward.is_booking_ready = False
    reward.booking_ready_at = None

    reward.save()

    messages.success(
        request,
        "Reward removed from booking."
    )

    return redirect("my-rewards")


