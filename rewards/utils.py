from .models import (
    WeekendRewardCampaign,
    RewardPolicy,
)

from .subscription_items import is_subscription_item

from .services import RewardEngine


def get_reward_context(customer):
    """
    Returns everything the frontend needs
    for the Weekend Rewards feature.
    """

    campaign = WeekendRewardCampaign.objects.filter(
        status="Live"
    ).first()

    context = {

        "campaign": None,

        "show_reward_bubble": False,

        "remaining_spins": 0,

        "reward_title": "",

        "reward_end_time": None,

        "reward_rewards_left": 0,

        "active_reward": None,

        "reward_policy": None,

        "allowed_categories": [],

        "allowed_services": [],

    }

    if not campaign:
        return context

    context["campaign"] = campaign

    context["reward_title"] = campaign.title

    context["reward_end_time"] = campaign.end_time

    context["reward_rewards_left"] = max(
        0,
        campaign.max_winners -
        campaign.winners_count
    )

    if campaign.is_live():

        context["show_reward_bubble"] = RewardEngine.can_spin(
            customer,
            campaign
        )

        context["remaining_spins"] = RewardEngine.remaining_spins(
            customer,
            campaign
        )

    reward = RewardEngine.get_active_reward(
        customer
    )

    context["active_reward"] = reward

    # ------------------------------------
    # Reward Policy
    # ------------------------------------

    policy = None

    if reward:

        policy = reward.prize.policy

    else:

        prize = campaign.prizes.filter(
            is_active=True,
            policy__isnull=False
        ).select_related(
            "policy"
        ).first()

        if prize:

            policy = prize.policy

    if policy:

        context["reward_policy"] = policy

        context["allowed_categories"] = list(

            policy.allowed_categories.values_list(
                "category",
                flat=True
            )

        )

        context["allowed_services"] = list(

            policy.allowed_services.values_list(
                "service_type",
                flat=True
            )

        )

    return context

