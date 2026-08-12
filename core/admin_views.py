from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.utils import timezone


from django.contrib import messages
from django.shortcuts import render, redirect
from rewards.models import WeekendRewardCampaign
from django.utils.dateparse import parse_datetime



from rewards.models import (
    WeekendRewardCampaign,
    SpinHistory,
    CustomerReward,

    RewardPrize, 
    RewardPolicy

    
)

from django.db.models import Count

@staff_member_required
def admin_rewards_dashboard(request):

    live_campaign = (
        WeekendRewardCampaign.objects
        .filter(status="Live")
        .first()
    )

    total_spins = SpinHistory.objects.count()

    total_winners = SpinHistory.objects.filter(
        has_won=True
    ).count()

    active_rewards = CustomerReward.objects.filter(
        status="Active"
    ).count()

    latest_spins = (
        SpinHistory.objects
        .select_related(
            "customer",
            "campaign",
            "prize"
        )
        .order_by("-spun_at")[:5]
    )

    latest_winners = (
        SpinHistory.objects
        .filter(has_won=True)
        .select_related(
            "customer",
            "campaign",
            "prize"
        )
        .order_by("-spun_at")[:5]
    )

    context = {

        "live_campaign": live_campaign,

        "total_spins": total_spins,

        "total_winners": total_winners,

        "active_rewards": active_rewards,

        "latest_spins": latest_spins,

        "latest_winners": latest_winners,

    }

    return render(

        request,

        "admin/rewards/dashboard.html",

        context,

    )

from rewards.models import WeekendRewardCampaign

@staff_member_required
def admin_reward_campaigns(request):

    campaigns = WeekendRewardCampaign.objects.all().order_by("-created_at")

    return render(
        request,
        "admin/rewards/campaigns.html",
        {
            "campaigns": campaigns
        }
    )





@staff_member_required
def create_reward_campaign(request):

    if request.method == "POST":

        WeekendRewardCampaign.objects.create(

            title=request.POST.get("title"),

            description=request.POST.get("description"),

            start_time=parse_datetime(
                request.POST.get("start_time")
            ),

            end_time=parse_datetime(
                request.POST.get("end_time")
            ),

            max_winners=request.POST.get("max_winners"),

            max_spins_per_customer=request.POST.get(
                "max_spins_per_customer"
            ),

            status=request.POST.get("status")

        )

        messages.success(
            request,
            "Reward campaign created successfully."
        )

        return redirect("admin_reward_campaigns")

    return render(

        request,

        "admin/rewards/create_campaign.html"

    )

from django.shortcuts import get_object_or_404

@staff_member_required
def view_reward_campaign(request, campaign_id):

    campaign = get_object_or_404(
        WeekendRewardCampaign,
        id=campaign_id
    )

    prizes = campaign.prizes.all()

    remaining_winners = campaign.max_winners - campaign.winners_count

    return render(
        request,
        "admin/rewards/view_campaign.html",
        {
            "campaign": campaign,
            "remaining_winners": remaining_winners,
            "prizes": prizes,
        }
    )

from django.shortcuts import get_object_or_404


@staff_member_required
def edit_reward_campaign(request, campaign_id):

    campaign = get_object_or_404(
        WeekendRewardCampaign,
        id=campaign_id
    )

    if request.method == "POST":

        campaign.title = request.POST.get("title")

        campaign.description = request.POST.get("description")

        campaign.start_time = parse_datetime(
            request.POST.get("start_time")
        )

        campaign.end_time = parse_datetime(
            request.POST.get("end_time")
        )

        campaign.max_winners = request.POST.get(
            "max_winners"
        )

        campaign.max_spins_per_customer = request.POST.get(
            "max_spins_per_customer"
        )

        campaign.status = request.POST.get(
            "status"
        )

        campaign.save()

        messages.success(

            request,

            "Campaign updated successfully."

        )

        return redirect(
            "view_reward_campaign",
            campaign.id
        )

    return render(

        request,

        "admin/rewards/edit_campaign.html",

        {

            "campaign": campaign

        }

    )

from django.shortcuts import get_object_or_404

@staff_member_required
def delete_reward_campaign(request, campaign_id):

    campaign = get_object_or_404(
        WeekendRewardCampaign,
        id=campaign_id
    )

    if request.method == "POST":

        campaign.delete()

        messages.success(

            request,

            "Campaign deleted successfully."

        )

        return redirect(
            "admin_reward_campaigns"
        )

    return render(

        request,

        "admin/rewards/delete_campaign.html",

        {

            "campaign": campaign

        }

    )

@staff_member_required
def admin_reward_prizes(request):

    prizes = RewardPrize.objects.select_related(
        "campaign",
        "policy"
    ).all()

    return render(

        request,

        "admin/rewards/prizes.html",

        {

            "prizes": prizes

        }

    )

@staff_member_required
def create_reward_prize(request):

    campaigns = WeekendRewardCampaign.objects.filter(
        status="Live"
    )

    policies = RewardPolicy.objects.all()

    if request.method == "POST":

        RewardPrize.objects.create(

            campaign_id=request.POST.get("campaign"),

            policy_id=request.POST.get("policy") or None,

            name=request.POST.get("name"),

            prize_type=request.POST.get("prize_type"),

            validity_days=request.POST.get("validity_days"),

            value=request.POST.get("value"),

            probability=request.POST.get("probability"),

            is_active=True if request.POST.get("is_active") else False

        )

        messages.success(

            request,

            "Reward prize created successfully."

        )

        return redirect("admin_reward_prizes")

    return render(

        request,

        "admin/rewards/create_prize.html",

        {

            "campaigns": campaigns,

            "policies": policies,

            "prize_types": RewardPrize.PRIZE_TYPES

        }

    )

@staff_member_required
def view_reward_prize(request, prize_id):

    prize = get_object_or_404(

        RewardPrize.objects.select_related(
            "campaign",
            "policy"
        ),

        id=prize_id

    )

    return render(

        request,

        "admin/rewards/view_prize.html",

        {

            "prize": prize

        }

    )

@staff_member_required
def edit_reward_prize(request, prize_id):

    prize = get_object_or_404(
        RewardPrize,
        id=prize_id
    )

    campaigns = WeekendRewardCampaign.objects.all()
    policies = RewardPolicy.objects.all()

    if request.method == "POST":

        prize.campaign_id = request.POST.get("campaign")

        policy = request.POST.get("policy")
        prize.policy_id = policy if policy else None

        prize.name = request.POST.get("name")

        prize.prize_type = request.POST.get("prize_type")

        prize.validity_days = request.POST.get(
            "validity_days"
        )

        prize.value = request.POST.get("value")

        prize.probability = request.POST.get(
            "probability"
        )

        prize.is_active = (
            True if request.POST.get("is_active")
            else False
        )

        prize.save()

        messages.success(
            request,
            "Reward Prize updated successfully."
        )

        return redirect(
            "view_reward_prize",
            prize.id
        )

    return render(

        request,

        "admin/rewards/edit_prize.html",

        {

            "prize": prize,

            "campaigns": campaigns,

            "policies": policies,

            "prize_types": RewardPrize.PRIZE_TYPES

        }

    )

@staff_member_required
def delete_reward_prize(request, prize_id):

    prize = get_object_or_404(
        RewardPrize,
        id=prize_id
    )

    if request.method == "POST":

        prize.delete()

        messages.success(

            request,

            "Reward Prize deleted successfully."

        )

        return redirect(
            "admin_reward_prizes"
        )

    return render(

        request,

        "admin/rewards/delete_prize.html",

        {

            "prize": prize

        }

    )

@staff_member_required
def admin_reward_policies(request):

    policies = RewardPolicy.objects.prefetch_related(
        "allowed_categories",
        "allowed_services"
    ).all()

    return render(

        request,

        "admin/rewards/policies.html",

        {

            "policies": policies

        }

    )

from django.contrib import messages
from django.shortcuts import render, redirect

from rewards.models import (
    RewardPolicy,
    RewardPolicyCategory,
    RewardPolicyService,
)


@staff_member_required
def create_reward_policy(request):

    if request.method == "POST":

        policy = RewardPolicy.objects.create(

            name=request.POST.get("name"),

            apply_to=request.POST.get("apply_to"),

            description=request.POST.get("description"),

            is_active=True if request.POST.get("is_active") else False

        )

        # Save Categories

        categories = request.POST.getlist("categories")

        for category in categories:

            RewardPolicyCategory.objects.create(

                policy=policy,

                category=category

            )

        # Save Services

        services = request.POST.getlist("services")

        for service in services:

            RewardPolicyService.objects.create(

                policy=policy,

                service_type=service

            )

        messages.success(
            request,
            "Reward policy created successfully."
        )

        return redirect("admin_reward_policies")

    return render(

        request,

        "admin/rewards/create_policy.html",

        {

            "categories": RewardPolicyCategory.CATEGORY_CHOICES,

            "services": RewardPolicyService.SERVICE_CHOICES,

            "apply_to_choices": RewardPolicy._meta.get_field("apply_to").choices,

        }

    )


@staff_member_required
def view_reward_policy(request, policy_id):

    policy = get_object_or_404(
        RewardPolicy.objects.prefetch_related(
            "allowed_categories",
            "allowed_services"
        ),
        id=policy_id
    )

    return render(
        request,
        "admin/rewards/view_policy.html",
        {
            "policy": policy
        }
    )

@staff_member_required
def edit_reward_policy(request, policy_id):

    policy = get_object_or_404(
        RewardPolicy,
        id=policy_id
    )

    if request.method == "POST":

        policy.name = request.POST.get("name")

        policy.apply_to = request.POST.get("apply_to")

        policy.description = request.POST.get("description")

        policy.is_active = bool(
            request.POST.get("is_active")
        )

        policy.save()

        policy.allowed_categories.all().delete()
        policy.allowed_services.all().delete()

        for category in request.POST.getlist("categories"):

            RewardPolicyCategory.objects.create(
                policy=policy,
                category=category
            )

        for service in request.POST.getlist("services"):

            RewardPolicyService.objects.create(
                policy=policy,
                service_type=service
            )

        messages.success(
            request,
            "Policy updated successfully."
        )

        return redirect(
            "view_reward_policy",
            policy.id
        )

    return render(
        request,
        "admin/rewards/edit_policy.html",
        {
            "policy": policy,
            "categories": RewardPolicyCategory.CATEGORY_CHOICES,
            "services": RewardPolicyService.SERVICE_CHOICES,
            "apply_to_choices": RewardPolicy._meta.get_field("apply_to").choices,
        }
    )

@staff_member_required
def delete_reward_policy(request, policy_id):

    policy = get_object_or_404(
        RewardPolicy,
        id=policy_id
    )

    if request.method == "POST":

        policy.delete()

        messages.success(
            request,
            "Reward policy deleted successfully."
        )

        return redirect(
            "admin_reward_policies"
        )

    return render(
        request,
        "admin/rewards/delete_policy.html",
        {
            "policy": policy
        }
    )

from rewards.models import CustomerReward

@staff_member_required
def admin_customer_rewards(request):

    rewards = CustomerReward.objects.select_related(
        "customer",
        "prize",
        "spin",
    ).all()

    context = {

        "rewards": rewards,

        "active_count": rewards.filter(status="Active").count(),

        "completed_count": rewards.filter(status="Completed").count(),

        "expired_count": rewards.filter(status="Expired").count(),

        "booking_ready_count": rewards.filter(
            is_booking_ready=True
        ).count(),

    }

    return render(

        request,

        "admin/rewards/customer_rewards.html",

        context

    )

from django.shortcuts import get_object_or_404

@staff_member_required
def view_customer_reward(request, reward_id):

    reward = get_object_or_404(

        CustomerReward.objects.select_related(

            "customer",
            "prize",
            "spin"

        ),

        id=reward_id

    )

    return render(

        request,

        "admin/rewards/view_customer_reward.html",

        {

            "reward": reward

        }

    )

@staff_member_required
def edit_customer_reward(request, reward_id):

    reward = get_object_or_404(
        CustomerReward,
        id=reward_id
    )

    if request.method == "POST":

        reward.is_booking_ready = (
            True if request.POST.get("is_booking_ready")
            else False
        )

        reward.remaining_items = request.POST.get(
            "remaining_items"
        )

        reward.free_transport_trips = request.POST.get(
            "free_transport_trips"
        )

        reward.free_express_services = request.POST.get(
            "free_express_services"
        )

        reward.subscription_days = request.POST.get(
            "subscription_days"
        )

        reward.status = request.POST.get(
            "status"
        )

        reward.expires_at = request.POST.get(
            "expires_at"
        )

        if reward.is_booking_ready:

            reward.booking_ready_at = timezone.now()

        reward.save()

        messages.success(

            request,

            "Customer reward updated successfully."

        )

        return redirect(
            "view_customer_reward",
            reward.id
        )

    return render(

        request,

        "admin/rewards/edit_customer_reward.html",

        {

            "reward": reward,

            "status_choices": CustomerReward.STATUS_CHOICES

        }

    )

from rewards.models import SpinHistory

@staff_member_required
def admin_spin_history(request):

    spins = SpinHistory.objects.select_related(
        "customer",
        "campaign",
        "prize"
    ).all()

    context = {

        "spins": spins,

        "total_spins": spins.count(),

        "winning_spins": spins.filter(
            has_won=True
        ).count(),

        "losing_spins": spins.filter(
            has_won=False
        ).count(),

        "claimed_rewards": spins.filter(
            reward_claimed=True
        ).count(),

    }

    return render(

        request,

        "admin/rewards/spin_history.html",

        context

    )

@staff_member_required
def view_spin_history(request, spin_id):

    spin = get_object_or_404(

        SpinHistory.objects.select_related(

            "customer",
            "campaign",
            "prize"

        ),

        id=spin_id

    )

    customer_reward = CustomerReward.objects.filter(
        spin=spin
    ).first()

    return render(

        request,

        "admin/rewards/view_spin_history.html",

        {

            "spin": spin,

            "customer_reward": customer_reward

        }

    )