from rest_framework import serializers

from .models import (
    WeekendRewardCampaign,
    RewardPrize,
    SpinHistory,
    RewardNotification,
)


class RewardPrizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = RewardPrize
        fields = (
            "id",
            "name",
            "prize_type",
            "value",
            "probability",
            "is_active",
        )


class WeekendRewardCampaignSerializer(serializers.ModelSerializer):

    prizes = RewardPrizeSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = WeekendRewardCampaign
        fields = (
            "id",
            "title",
            "description",
            "start_time",
            "end_time",
            "max_winners",
            "winners_count",
            "status",
            "prizes",
        )


class SpinHistorySerializer(serializers.ModelSerializer):

    prize = RewardPrizeSerializer(
        read_only=True
    )

    campaign = serializers.StringRelatedField()

    class Meta:
        model = SpinHistory
        fields = (
            "id",
            "campaign",
            "prize",
            "spin_number",
            "has_won",
            "reward_claimed",
            "reward_applied",
            "spun_at",
        )


class RewardNotificationSerializer(serializers.ModelSerializer):

    campaign = serializers.StringRelatedField()

    class Meta:
        model = RewardNotification
        fields = (
            "id",
            "campaign",
            "email_sent",
            "bubble_seen",
            "notified_at",
        )


class SpinResultSerializer(serializers.Serializer):
    """
    Response returned after spinning the wheel.
    """

    has_won = serializers.BooleanField()

    spin_number = serializers.IntegerField()

    remaining_spins = serializers.IntegerField()

    prize = RewardPrizeSerializer()