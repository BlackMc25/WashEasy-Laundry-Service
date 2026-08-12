import random

from django.utils import timezone

from datetime import timedelta

from django.db import transaction

from decimal import Decimal
from .subscription_items import is_subscription_item

from core.models import SubscriptionPlan

from core.models import PriceList

from .models import (
    RewardPrize,
    SpinHistory,
    WeekendRewardCampaign,
    CustomerReward,
)


class RewardEngine:
    """
    Handles all Weekend Reward business logic.
    """

    @staticmethod
    def spin(customer, campaign):
        """
        Spins the reward wheel for a customer.

        Args:
            customer: Logged-in customer
            campaign: WeekendRewardCampaign instance

        Returns:
            SpinHistory instance

        Raises:
            ValueError: If the customer cannot spin.
        """

        # ------------------------------------
        # Campaign must be active
        # ------------------------------------
        if not campaign.is_live():
            raise ValueError(
                "Weekend Rewards campaign is not currently live."
            )

        # ------------------------------------
        # Maximum 2 spins
        # ------------------------------------
        previous_spins = SpinHistory.objects.filter(
            customer=customer,
            campaign=campaign
        ).count()

        if previous_spins >= campaign.max_spins_per_customer:
            raise ValueError(
                "You have already used your two spins."
            )

        # ------------------------------------
        # Available prizes
        # ------------------------------------
        prizes = RewardPrize.objects.filter(
            campaign=campaign,
            is_active=True
        )

        if not prizes.exists():
            raise ValueError(
                "No rewards have been configured."
            )

        # ------------------------------------
        # Weighted random selection
        # ------------------------------------
        weighted_prizes = []

        for prize in prizes:
            weighted_prizes.extend(
                [prize] * prize.probability
            )

        selected_prize = random.choice(weighted_prizes)

        # ------------------------------------
        # Determine if customer won
        # ------------------------------------
        has_won = (
            selected_prize.prize_type != "try_again"
        )

        # ------------------------------------
        # Save spin
        # ------------------------------------
        with transaction.atomic():

            spin = SpinHistory.objects.create(

                customer=customer,
                campaign=campaign,
                prize=selected_prize,
                spin_number=previous_spins + 1,
                has_won=has_won,
            )

            if has_won:

                campaign.winners_count += 1
                campaign.save(update_fields=["winners_count"])

                # NEW LINE
                RewardEngine.apply_reward(spin)

        return spin

    @staticmethod
    def get_active_reward(customer):
        """
        Returns the customer's active laundry reward.
        """

        return CustomerReward.objects.filter(
            customer=customer,
            status="Active",
            remaining_items__gt=0,
            expires_at__gt=timezone.now(),
            prize__prize_type__startswith="items",
        ).select_related(
            "prize",
            "prize__policy",
        ).order_by(
            "-activated_at"
        ).first()
    
    @staticmethod
    def is_reward_item(price_item, reward):
        """
        Returns True if this laundry item can use the reward.
        """

        if reward is None:
            return False

        policy = reward.prize.policy

        if policy is None:
            return False
        
        if not policy.is_active:
            return False

        category_allowed = policy.allowed_categories.filter(
            category=price_item.category
        ).exists()

        if not category_allowed:
            return False

        service_allowed = policy.allowed_services.filter(
            service_type=price_item.service_type
        ).exists()

        if not service_allowed:
            return False

        return True

    @staticmethod
    def consume_reward(reward, free_quantity):
        """
        Deducts redeemed items after the booking
        has been successfully created.
        """

        if reward is None:
            return

        reward.remaining_items -= free_quantity

        if reward.remaining_items <= 0:

            reward.remaining_items = 0

            reward.status = "Completed"

        reward.save(
            update_fields=[
                "remaining_items",
                "status",
            ]
        )

    @staticmethod
    def calculate_reward_discount(reward, quantity):
        """
        Calculates how many items can be redeemed.

        Returns:
            (free_quantity, paid_quantity)
        """

        if reward is None:
            return (0, quantity)

        if reward.remaining_items <= 0:
            return (0, quantity)

        free_quantity = min(
            reward.remaining_items,
            quantity
        )

        paid_quantity = quantity - free_quantity

        return (
            free_quantity,
            paid_quantity,
        )

    @staticmethod
    def apply_reward(spin):
        """
        Creates and activates a reward for a winning spin.
        """

        prize = spin.prize

        expires_at = timezone.now() + timedelta(
            days=prize.validity_days
        )

        reward = None

        if prize.prize_type == "try_again":

            spin.reward_applied = True
            spin.save(update_fields=["reward_applied"])

            return None

        elif prize.prize_type.startswith("items"):

            reward = CustomerReward.objects.create(

                customer=spin.customer,
                spin=spin,
                prize=prize,

                total_items=prize.value,
                remaining_items=prize.value,

                expires_at=expires_at,

                status="Active",
            )

        elif prize.prize_type.startswith("transport"):

            reward = CustomerReward.objects.create(

                customer=spin.customer,
                spin=spin,
                prize=prize,

                free_transport_trips=prize.value,

                expires_at=expires_at,

                status="Active",
            )

        elif prize.prize_type == "express":

            reward = CustomerReward.objects.create(

                customer=spin.customer,
                spin=spin,
                prize=prize,

                free_express_services=1,

                expires_at=expires_at,

                status="Active",
            )

        elif prize.prize_type in [
        
                    "subscription_standard",
        
                    "subscription_premium",
        
                ]:
        
                    plan_name = (
        
                        "Standard"
        
                        if prize.prize_type == "subscription_standard"
        
                        else "Premium"
        
                    )
        
                    plan = SubscriptionPlan.objects.filter(
        
                        name__iexact=plan_name,
        
                        is_active=True,
        
                    ).first()
        
                    if plan is None:
        
                        raise ValueError(
        
                            f"{plan_name} subscription plan does not exist."
        
                        )
        
                    reward = CustomerReward.objects.create(
        
                        customer=spin.customer,
        
                        spin=spin,
        
                        prize=prize,
        
                        subscription_days=plan.validity_days,
        
                        total_items=plan.total_items,
        
                        remaining_items=plan.total_items,
        
                        free_transport_trips=plan.free_transport_trips,
        
                        expires_at=expires_at,
        
                        status="Active",
        
                    )
        
        
        # Runs for every winning reward
        spin.reward_applied = True
        spin.save(update_fields=["reward_applied"])

        return reward

    @staticmethod
    def get_booking_rewards(customer):
        """
        Returns all active rewards prepared for booking.
        """
        return CustomerReward.objects.filter(
            customer=customer,
            status="Active",
            is_booking_ready=True
        ).select_related(
            "prize",
            "prize__policy"
        )

    @staticmethod
    def group_rewards(rewards):

        grouped = {

            "ITEMS": [],
            "TRANSPORT": [],
            "EXPRESS": [],
            "SUBSCRIPTION": []

        }

        for reward in rewards:

            apply_to = reward.prize.policy.apply_to

            grouped[apply_to].append(reward)

        return grouped

    @staticmethod
    def total_item_reward(rewards):

        total = 0

        for reward in rewards:

            total += reward.remaining_items

        return total

    @staticmethod
    def get_booking_rewards(customer):
        """
        Returns all rewards that are ready to be used
        during booking.
        """

        return CustomerReward.objects.filter(
            customer=customer,
            status="Active",
            is_booking_ready=True
        ).select_related(
            "prize",
            "prize__policy"
        ).order_by(
            "booking_ready_at",
           "activated_at"
        )

    @staticmethod
    def group_rewards(rewards):
        """
        Groups rewards according to
        the RewardPolicy.apply_to value.
        """

        grouped = {}

        for reward in rewards:

            reward_type = reward.prize.policy.apply_to

            grouped.setdefault(
                reward_type,
                []
            ).append(reward)

        return grouped

    @staticmethod
    def build_reward_pools(customer):
        """
        Groups all booking-ready rewards into
        pools that can be used during booking.
        """

        rewards = RewardEngine.get_booking_rewards(
            customer
        )

        pools = {

            "items": {
                "total": 0,
                "rewards": []
            },

            "transport": {
                "total": 0,
                "rewards": []
            },

            "express": {
                "total": 0,
                "rewards": []
            },

            "subscription": {
                "total": 0,
                "rewards": []
            }

        }

        for reward in rewards:
    
            if reward.prize.policy is None:

                continue

            reward_type = reward.prize.policy.apply_to

            if reward_type == "ITEMS":

                pools["items"]["total"] += reward.remaining_items

                pools["items"]["rewards"].append(
                    reward
                )

            elif reward_type == "TRANSPORT":

                pools["transport"]["total"] += (
                    reward.free_transport_trips
                )

                pools["transport"]["rewards"].append(
                    reward
                )

            elif reward_type == "EXPRESS":

                pools["express"]["total"] += (
                    reward.free_express_services
                )

                pools["express"]["rewards"].append(
                    reward
                )

            elif reward_type == "SUBSCRIPTION":

                pools["subscription"]["total"] += (
                    reward.subscription_days
                )

                pools["subscription"]["rewards"].append(
                    reward
                )

        return pools
    
    from django.utils import timezone

    @staticmethod
    def validate_booking(customer, booking_items):

        pools = RewardEngine.build_reward_pools(customer)

        booking_rewards = RewardEngine.get_booking_rewards(customer)

        for reward in booking_rewards:

            if reward.expires_at and reward.expires_at <= timezone.now():

                return {

                    "valid": False,

                    "message": f"{reward.prize.name} has expired."

                }

        price_items = {}

        eligible_items = []

        for booking_item in booking_items:

            price_item = PriceList.objects.filter(
                id=booking_item["price_list_id"]
            ).first()

            if not price_item:

                return {

                    "valid": False,

                    "message": "Invalid laundry item."

                }

            price_items[
                booking_item["price_list_id"]
            ] = price_item

            eligible_items.append(price_item)
            
        valid_item_ids = set()

        for price_item in eligible_items:

            for reward in booking_rewards:

                if RewardEngine.is_reward_item(

                    price_item,

                    reward

                ):

                    valid_item_ids.add(
                        price_item.id
                    )

                    break

        eligible_quantity = 0
        payable_laundry = 0
        eligible_reward_items = []

        for booking_item in booking_items:
            
            quantity = booking_item["quantity"]

            price_item = price_items[
                booking_item["price_list_id"]
            ]

            if price_item.id in valid_item_ids:
    
                eligible_quantity += quantity

                eligible_reward_items.append({

                    "price_item": price_item,

                    "quantity": quantity

                })

            else:

                payable_laundry += (

                    quantity *

                    price_item.price

                )

        available = pools.get(
                    "items",
                    {}
                ).get(
                    "total",
                    0
                )

        if available == 0:
    
            return {

                "valid": False,

                "message": (
                    "You don't have any laundry rewards "
                    "ready for booking."
                )

            }

        reward_consumption = []

        remaining_to_allocate = min(
            eligible_quantity,
            available
        )
        for reward in pools["items"]["rewards"]:
    
            if remaining_to_allocate <= 0:

                break

            used = min(

                reward.remaining_items,

                remaining_to_allocate

            )

            reward_consumption.append({

                "reward_id": reward.id,

                "used": used

            })

            remaining_to_allocate -= used

        free_items = min(

            eligible_quantity,

            available

        )

        paid_items = max(

            0,

            eligible_quantity - available

        )

        remaining_to_allocate = free_items

        reward_item_breakdown = []

        for item in eligible_reward_items:

            covered = min(

                item["quantity"],

                remaining_to_allocate

            )

            paid = (

                item["quantity"]

                - covered

            )

            reward_item_breakdown.append({

                "price_list_id": item["price_item"].id,

                "reward_quantity": covered,

                "paid_quantity": paid,

            })

            payable_laundry += (

                paid *

                item["price_item"].price

            )

            remaining_to_allocate -= covered

        return {

            "valid": True,

            "message": "Reward applied.",

            "eligible_quantity": eligible_quantity,

            "reward_pool": available,

            "free_items": free_items,

            "paid_items": paid_items,

            "items": reward_item_breakdown,

            "payable_laundry": payable_laundry,

            "reward_consumption": reward_consumption,

            "remaining_after_booking": max(
                0,
                available - eligible_quantity
            ),

        }

    @staticmethod
    def validate_transport(customer, reward_id):

        reward = CustomerReward.objects.filter(

            id=reward_id,

            customer=customer,

            status="Active",

            is_booking_ready=True,

        ).select_related("prize").first()

        if reward is None:

            return {

                "valid": False,

                "message": "Transport reward not found."

            }

        if reward.prize.prize_type not in [

            "transport_1",

            "transport_3",

        ]:

            return {

                "valid": False,

                "message": "Selected reward is not a transport reward."

            }

        if reward.free_transport_trips <= 0:

            return {

                "valid": False,

                "message": "No free transport trips remaining."

            }

        return {

            "valid": True,

            "reward": reward,

            "remaining_trips": reward.free_transport_trips,

        }

    @staticmethod
    def validate_subscription(

        customer,

        booking_items,

        reward_id,

    ):

        reward = CustomerReward.objects.filter(

            id=reward_id,

            customer=customer,

            status="Active",

            is_booking_ready=True,

        ).select_related("prize").first()

        if reward is None:

            return {

                "valid": False,

                "message": "Subscription reward not found."

            }

        if reward.prize.prize_type not in [

            "subscription_standard",

            "subscription_premium",

        ]:

            return {

                "valid": False,

                "message": "Selected reward is not a subscription reward."

            }

        plan_name = (

            "Standard"

            if reward.prize.prize_type == "subscription_standard"

            else "Premium"

        )

        plan = SubscriptionPlan.objects.filter(

            name=plan_name,

            is_active=True,

        ).first()

        if plan is None:

            return {

                "valid": False,

                "message": f"{plan_name} plan was not found."

            }

        subscription_remaining = reward.remaining_items

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

                    subscription_remaining,

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

            })

        return {

            "valid": True,

            "reward": reward,

            "covered_items": covered_items,

            "paid_items": paid_items,

            "remaining_after_booking": subscription_remaining,

            "payable_laundry": payable_laundry,

            "items": item_breakdown,

        }


    @staticmethod
    def consume_rewards(consumption):

        for item in consumption:

            reward = CustomerReward.objects.get(

                id=item["reward_id"]

            )

            reward.remaining_items -= item["used"]

            if reward.remaining_items <= 0:

                reward.remaining_items = 0

                reward.status = "Completed"

            reward.save()

    @staticmethod
    def consume_subscription_reward(reward, covered_items):
        """
        Consume items from a subscription reward.
        """

        reward.remaining_items -= covered_items

        if reward.remaining_items < 0:

            reward.remaining_items = 0

        if reward.remaining_items == 0:

            reward.status = "Completed"

        reward.save()

    @staticmethod
    def consume_transport_reward(reward):
        """
        Consume one free transport trip.
        """

        if reward.free_transport_trips > 0:

            reward.free_transport_trips -= 1

            if reward.free_transport_trips == 0:

                reward.status = "Completed"

            reward.save()

    @staticmethod
    def summarize_reward_pools(customer):

        rewards = RewardEngine.get_booking_rewards(
            customer
        )

        grouped = RewardEngine.group_rewards(
            rewards
        )

        summary = {}

        for reward_type, reward_list in grouped.items():

            summary[reward_type] = RewardEngine.get_reward_pool(
                reward_list
            )

        return summary
        

    @staticmethod
    def remaining_spins(customer, campaign):
        """
        Returns the number of spins remaining.
        """

        used = SpinHistory.objects.filter(
            customer=customer,
            campaign=campaign
        ).count()

        return max(
            0,
            campaign.max_spins_per_customer - used
        )

    @staticmethod
    def can_spin(customer, campaign):
        """
        Returns True if the customer can still spin.
        """

        if not campaign.is_live():
            return False

        return RewardEngine.remaining_spins(
            customer,
            campaign
        ) > 0





