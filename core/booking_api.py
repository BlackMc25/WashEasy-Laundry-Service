from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from core.models import PriceList
from rewards.benefit_engine import BenefitEngine
from rewards.models import CustomerReward
from rewards.subscription_items import is_subscription_item
from rewards.benefit_engine import SubscriptionEngine
from core.models import SubscriptionPlan

from rewards.services import RewardEngine


class SubscriptionValidationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        items = request.data.get("items", [])

        subscription, _ = BenefitEngine.resolve(

            request.user,

            "SUBSCRIPTION"

        )

        if subscription is None:

            return Response(

                {

                    "valid": False,

                    "message": "No active subscription."

                },

                status=status.HTTP_400_BAD_REQUEST

            )

        result = SubscriptionEngine.validate_booking(

            booking_items=items,

            plan=subscription,

            remaining_items=subscription.remaining_items,

        )

        return Response(result)

class RewardLaundryValidationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_items = request.data.get(
            "items",
            []
        )

        result = RewardEngine.validate_booking(

            request.user,

            booking_items

        )

        return Response(result)


class RewardTransportValidationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        reward_id = request.data.get("reward_id")

        reward = CustomerReward.objects.filter(
            id=reward_id,
            customer=request.user,
            status="Active",
            is_booking_ready=True,
        ).select_related("prize").first()

        if not reward:

            return Response({

                "valid": False,

                "message": "No active reward."

            })

        if reward.prize.prize_type not in [

            "transport_1",

            "transport_3",

        ]:

            return Response({

                "valid": False,

                "message": "This reward is not a transport reward."

            })

        if reward.free_transport_trips <= 0:

            return Response({

                "valid": False,

                "message": "No transport trips remaining."

            })

        return Response({

            "valid": True,

            "transport_fee": 0,

            "remaining_trips": reward.free_transport_trips,

            "reward_id": reward.id,

        })
    
class RewardSubscriptionValidationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):

        items = request.data.get("items", [])

        reward_id = request.data.get("reward_id")

        reward = CustomerReward.objects.filter(

            id=reward_id,

            customer=request.user,

            status="Active",

            is_booking_ready=True,

        ).select_related("prize").first()

        if not reward:

            return Response({

                "valid": False,

                "message": "No active reward."

            })

        if reward.prize.prize_type not in [

            "subscription_standard",

            "subscription_premium",

        ]:

            return Response({

                "valid": False,

                "message": "This reward is not a subscription reward."

            })

        if reward.prize.prize_type == "subscription_standard":

            plan = SubscriptionPlan.objects.get(

                name__iexact="Standard"

            )

        else:

            plan = SubscriptionPlan.objects.get(

                name__iexact="Premium"

            )

        result = SubscriptionEngine.validate_booking(

            booking_items=items,

            plan=plan,

            remaining_items=reward.remaining_items,

        )

        result["reward_id"] = reward.id

        result["days"] = reward.subscription_days

        result["plan"] = reward.prize.prize_type

        return Response(result)