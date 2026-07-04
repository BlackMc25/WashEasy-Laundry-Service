from .models import Notification

def notifications(request):

    if request.user.is_authenticated:

        all_notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        unread_count = all_notifications.filter(
            is_read=False
        ).count()

        return {

            'unread_notifications': unread_count,

            'latest_notifications': all_notifications[:5]

        }

    return {}

from .models import SiteSettings

def site_settings(request):

    settings = SiteSettings.objects.first()

    return {
        'site_settings': settings
    }

