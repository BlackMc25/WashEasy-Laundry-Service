from django.conf import settings
from django.db import models
from django.utils import timezone


class WeekendRewardCampaign(models.Model):

    STATUS_CHOICES = (
        ("Draft", "Draft"),
        ("Live", "Live"),
        ("Closed", "Closed"),
    )

    title = models.CharField(
        max_length=100
    )

    description = models.TextField(
        blank=True
    )

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    max_winners = models.PositiveIntegerField(
        default=5
    )

    max_spins_per_customer = models.PositiveIntegerField(
    default=2,
    help_text="Maximum number of spins each customer can use."
    )

    winners_count = models.PositiveIntegerField(
        default=0
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Draft"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def is_live(self):

        now = timezone.now()

        return (
            self.status == "Live"
            and self.start_time <= now <= self.end_time
            and self.winners_count < self.max_winners
        )

    def __str__(self):

        return self.title


class RewardPrize(models.Model):
    
    PRIZE_TYPES = (

        # Laundry Rewards
        ("items_5", "5 Free Laundry Items"),

        ("items_10", "10 Free Laundry Items"),

        ("items_15", "15 Free Laundry Items"),

        ("items_30", "30 Free Laundry Items"),

        # Transport Rewards
        ("transport_1", "Free Transport (1 Trip)"),

        ("transport_3", "Free Transport (3 Trips)"),

        # Subscription Rewards
        ("subscription_standard", "Standard Subscription"),

        ("subscription_premium", "Premium Subscription"),

        # Service Upgrade
        ("express", "Express Service Upgrade"),

        # No Prize
        ("try_again", "Try Again"),

    )



    campaign = models.ForeignKey(
        WeekendRewardCampaign,
        on_delete=models.CASCADE,
        related_name="prizes"
    )

    policy = models.ForeignKey(
        "RewardPolicy",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reward_prizes"
    )

    name = models.CharField(
        max_length=100
    )

    prize_type = models.CharField(
        max_length=30,
        choices=PRIZE_TYPES
    )

    validity_days = models.PositiveIntegerField(
    default=14,
    help_text="Number of days the reward remains valid."
    )

    value = models.PositiveIntegerField(
        default=0,
        help_text="Number of items, trips or subscription duration."
    )

    probability = models.PositiveIntegerField(
        default=1,
        help_text="Higher value means a greater chance of winning."
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):

        return self.name
    
class SpinHistory(models.Model):
    
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reward_spins"
    )

    campaign = models.ForeignKey(
        WeekendRewardCampaign,
        on_delete=models.CASCADE,
        related_name="spins"
    )

    prize = models.ForeignKey(
        RewardPrize,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="winners"
    )

    spin_number = models.PositiveSmallIntegerField(
        default=1,
        help_text="Customer spin number for this campaign."
    )

    has_won = models.BooleanField(
        default=False
    )

    reward_claimed = models.BooleanField(
        default=False
    )

    reward_applied = models.BooleanField(
        default=False,
        help_text="Reward has been applied to customer's account."
    )

    spun_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ["-spun_at"]

        verbose_name = "Spin History"

        verbose_name_plural = "Spin Histories"

    def __str__(self):

        if self.prize:

            return (
                f"{self.customer.username} "
                f"won {self.prize.name}"
            )

        return (
            f"{self.customer.username} "
            f"spun the wheel"
        )


class RewardNotification(models.Model):

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    campaign = models.ForeignKey(
        WeekendRewardCampaign,
        on_delete=models.CASCADE
    )

    email_sent = models.BooleanField(
        default=False
    )

    bubble_seen = models.BooleanField(
        default=False
    )

    notified_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        unique_together = (
            "customer",
            "campaign",
        )

    def __str__(self):

        return f"{self.customer}"

from django.db import models
from django.conf import settings


from django.db import models
from django.conf import settings


class CustomerReward(models.Model):

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Expired", "Expired"),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_rewards"
    )

    spin = models.OneToOneField(
        SpinHistory,
        on_delete=models.CASCADE,
        related_name="customer_reward"
    )

    prize = models.ForeignKey(
        RewardPrize,
        on_delete=models.CASCADE,
        related_name="customer_rewards"
    )

    is_booking_ready = models.BooleanField(
    default=False,
    help_text="Customer has prepared this reward for booking."
    )

    booking_ready_at = models.DateTimeField(
    null=True,
    blank=True
    )

    total_items = models.PositiveIntegerField(
        default=0
    )

    remaining_items = models.PositiveIntegerField(
        default=0
    )

    free_transport_trips = models.PositiveIntegerField(
        default=0
    )

    free_express_services = models.PositiveIntegerField(
        default=0
    )

    subscription_days = models.PositiveIntegerField(
        default=0
    )

    activated_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    class Meta:
        ordering = ["-activated_at"]

    def __str__(self):
        return (
            f"{self.customer.username} - "
            f"{self.prize.name}"
        )

class RewardPolicyCategory(models.Model):
    
    CATEGORY_CHOICES = [

        ("Everyday Wear", "Everyday Wear"),

        ("Corporate Wear", "Corporate Wear"),

        ("Traditional Wear", "Traditional Wear"),

        ("Underwear", "Underwear"),

        ("Children's Wear", "Children's Wear"),

        ("Bedding", "Bedding"),

        ("Shoes&Accessories", "Shoes&Accessories"),

        ("Special Care", "Special Care"),

    ]

    policy = models.ForeignKey(
        "RewardPolicy",
        on_delete=models.CASCADE,
        related_name="allowed_categories"
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    class Meta:

        unique_together = (
            "policy",
            "category"
        )

    def __str__(self):

        return f"{self.policy.name} - {self.category}"

class RewardPolicy(models.Model):
    
    name = models.CharField(
        max_length=100,
        unique=True
    )

    apply_to = models.CharField(
    max_length=20,
    choices=[
        ("ITEMS", "Laundry Items"),
        ("TRANSPORT", "Transport"),
        ("EXPRESS", "Express Service"),
        ("SUBSCRIPTION", "Subscription"),
    ],
    default="ITEMS"
    )

    description = models.TextField(
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return self.name

class RewardPolicyService(models.Model):
    
    SERVICE_CHOICES = [

        ("Wash & Fold", "Wash & Fold"),

        ("Wash & Iron", "Wash & Iron"),

        ("Dry Cleaning", "Dry Cleaning"),

    ]

    policy = models.ForeignKey(
        RewardPolicy,
        on_delete=models.CASCADE,
        related_name="allowed_services"
    )

    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES
    )

    class Meta:

        unique_together = (
            "policy",
            "service_type"
        )

    def __str__(self):

        return f"{self.policy.name} - {self.service_type}"