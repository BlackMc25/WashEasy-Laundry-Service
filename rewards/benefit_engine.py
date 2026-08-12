from core.models import CustomerSubscription
from accounts.models import CustomUser
from rewards.services import RewardEngine

from decimal import Decimal
from rewards.subscription_items import is_subscription_item
from core.models import PriceList


class BenefitEngine:
    """
    Determines which customer benefit should be used
    during a booking.
    """

    @staticmethod
    def resolve(customer, benefit_type):

        subscription = None
        reward = None

        if benefit_type == "SUBSCRIPTION":

            subscription = CustomerSubscription.objects.filter(
                customer=customer,
                status="Active",
                payment_status="Paid",
                remaining_items__gt=0,
            ).select_related(
                "plan"
            ).first()

        elif benefit_type == "REWARD":

            reward = RewardEngine.get_active_reward(
                customer
            )

        return subscription, reward

    @staticmethod
    def build_pool(customer):

        reward_pool = RewardEngine.build_reward_pools(
            customer
        )

        subscription = CustomerSubscription.objects.filter(
            customer=customer,
            status="Active"
        ).order_by(
            "-created_at"
        ).first()

        subscription_pool = {

            "items": 0,

            "transport": 0,

            "express": 0,

            "subscription": subscription,

        }

        if subscription:

            subscription_pool["items"] = (
                subscription.remaining_items
            )

            subscription_pool["transport"] = (
                subscription.free_transport_trips_remaining
            )

        return {

            "reward": reward_pool,

            "subscription": subscription_pool,

        }
    @staticmethod
    def summary(customer):

        pool = BenefitEngine.build_pool(
            customer
        )

        return {

            "reward_items":

                pool["reward"]["items"]["total"],

            "reward_transport":

                pool["reward"]["transport"]["total"],

            "reward_express":

                pool["reward"]["express"]["total"],

            "subscription_items":

                pool["subscription"]["items"],

            "subscription_transport":

                pool["subscription"]["transport"],

        }


class SubscriptionEngine:

    @staticmethod
    def validate_booking(
        booking_items,
        plan,
        remaining_items,
    ):

        subscription_remaining = remaining_items

        covered_items = 0

        paid_items = 0

        payable_laundry = Decimal("0")

        item_breakdown = []

        for booking_item in booking_items:

            price_item = PriceList.objects.filter(
                id=booking_item["price_list_id"]
            ).first()

            if not price_item:
                continue

            quantity = booking_item["quantity"]

            if is_subscription_item(
                price_item,
                plan,
            ):

                covered = min(
                    quantity,
                    subscription_remaining
                )

                paid = quantity - covered

                subscription_remaining -= covered

            else:

                covered = 0

                paid = quantity

            covered_items += covered

            paid_items += paid

            payable_laundry += (

                Decimal(paid)

                * price_item.price

            )

            item_breakdown.append({

                "price_list_id": price_item.id,

                "covered_quantity": covered,

                "paid_quantity": paid,

                "item": price_item.item_name,

                "service": price_item.service_type,

            })

        return {

            "valid": True,

            "covered_items": covered_items,

            "paid_items": paid_items,

            "remaining_after_booking": subscription_remaining,

            "payable_laundry": float(payable_laundry),

            "items": item_breakdown,

        }