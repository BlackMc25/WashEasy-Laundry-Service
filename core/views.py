from django.shortcuts import render
import requests
from django.utils import timezone
from django.contrib import messages
from django.core.mail import send_mail
from django.http import HttpResponse
from decimal import Decimal
from .models import Notification
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.conf import settings
import random
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from core.models import SiteSettings
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .forms import LaundryOrderForm
from .models import (
    PriceList,
    LaundryOrder,
    OrderItem,
    Complaint,

     SubscriptionPlan,
    
)
from core.models import ContactMessage
from django.shortcuts import (
    render,
    redirect
)


def home(request):
    return render(request, 'home.html')

@login_required
def book_laundry(request):

    items = PriceList.objects.all()
    site_settings = SiteSettings.objects.first()

    categories = {}

    for item in items:

        if item.category not in categories:
            categories[item.category] = {}

        if item.item_name not in categories[item.category]:
            categories[item.category][item.item_name] = []

        categories[item.category][item.item_name].append(item)

    previous_addresses = LaundryOrder.objects.filter(
        customer=request.user
    ).values_list(
        "pickup_address",
        flat=True
    ).distinct()

    previous_delivery_addresses = LaundryOrder.objects.filter(
        customer=request.user
    ).values_list(
        "delivery_address",
        flat=True
    ).distinct()

    if request.method == "POST":

        form = LaundryOrderForm(request.POST)

        if form.is_valid():

            selected_items = False

            # -----------------------------
            # Check if customer selected
            # at least one item
            # -----------------------------
            for item in items:

                quantity = int(
                    request.POST.get(
                        f"item_{item.id}",
                        0
                    )
                )

                express_quantity = int(
                    request.POST.get(
                        f"express_item_{item.id}",
                        0
                    )
                )

                if quantity > 0 or express_quantity > 0:
                    selected_items = True
                    break

            if not selected_items:

                messages.error(
                    request,
                    "Please select at least one laundry item."
                )

                return render(
                    request,
                    "book_laundry.html",
                    {
                        "categories": categories,
                        "form": form,
                        "previous_addresses": previous_addresses,
                        "previous_delivery_addresses": previous_delivery_addresses,
                        "site_settings": site_settings,
                    },
                )

            # -----------------------------
            # Save order
            # -----------------------------
            order = form.save(commit=False)

            order.customer = request.user

            order.pickup_distance_km = (
                request.POST.get("pickup_distance_km", 0) or 0
            )

            order.delivery_distance_km = (
                request.POST.get("delivery_distance_km", 0) or 0
            )

            order.total_distance_km = (
                request.POST.get("total_distance_km", 0) or 0
            )

            PRICE_PER_KM = Decimal("150")

            transport_fee = (
                Decimal(str(order.total_distance_km))
                * PRICE_PER_KM
            )

            order.transport_fee = transport_fee

            last_order = LaundryOrder.objects.filter(
                customer=request.user
            ).order_by(
                "-customer_order_number"
            ).first()

            if last_order:

                order.customer_order_number = (
                    last_order.customer_order_number + 1
                )

            else:

                order.customer_order_number = 1

            order.save()

            total_amount = Decimal("0")

            # -----------------------------
            # Save each laundry item
            # -----------------------------
            for item in items:

                quantity = int(
                    request.POST.get(
                        f"item_{item.id}",
                        0
                    )
                )

                express_quantity = int(
                    request.POST.get(
                        f"express_item_{item.id}",
                        0
                    )
                )

                if quantity == 0 and express_quantity == 0:
                    continue

                standard_subtotal = (
                    Decimal(quantity)
                    * item.price
                )

                express_subtotal = (
                    Decimal(express_quantity)
                    * item.price
                )

                subtotal = (
                    standard_subtotal
                    + express_subtotal
                )

                express_fee = (
                    Decimal(express_quantity)
                    * item.express_price
                )

                total_subtotal = (
                    subtotal
                    + express_fee
                )

                OrderItem.objects.create(
                    order=order,
                    item=item,
                    quantity=quantity,
                    subtotal=subtotal,
                    express_quantity=express_quantity,
                    express_fee=express_fee,
                    total_subtotal=total_subtotal,
                )

                total_amount += total_subtotal

            # -----------------------------
            # Add transport fee
            # -----------------------------
            total_amount += transport_fee

            order.total_amount = total_amount

            order.save()

            order.refresh_from_db()

            # -----------------------------
            # Notification
            # -----------------------------
            Notification.objects.create(
                user=request.user,
                title="Pickup Scheduled",
                message=(
                    "Your booking has been received successfully.\n\n"
                    "Please get your clothes ready. "
                    "Our rider will arrive shortly to pick up your laundry."
                ),
            )

            # -----------------------------
            # Payment
            # -----------------------------
            if order.payment_method == "Pay Online":

                return redirect(
                    "initialize_payment",
                    order_id=order.id,
                )

            return redirect("my_orders")

        else:

            print(form.errors)

    else:

        form = LaundryOrderForm()

    return render(
        request,
        "book_laundry.html",
        {
            "categories": categories,
            "form": form,
            "previous_addresses": previous_addresses,
            "previous_delivery_addresses": previous_delivery_addresses,
            "site_settings": site_settings,
        },
    )


@login_required
def my_orders(request):

    orders = LaundryOrder.objects.filter(
        customer=request.user
    ).order_by('-created_at')

    context = {
        'orders': orders
    }

    return render(
        request,
        'my_orders.html',
        context
    )

@login_required
def order_detail(request, order_id):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id,
        customer=request.user
    )

    laundry_total = sum(
        item.subtotal
        for item in order.items.all()
    )

    express_total = sum(
    item.express_fee
    for item in order.items.all()
    )

    site_settings = SiteSettings.objects.first()

    context = {

        'order': order,

        'laundry_total': laundry_total,

        "express_total": express_total,
        
        'site_settings': site_settings,

    }

    return render(
        request,
        'order_detail.html',
        context
    )

@login_required
def cancel_order(request, order_id):

    order = LaundryOrder.objects.get(
        id=order_id,
        customer=request.user
    )

    if order.status not in [
        'Pending Pickup',
        'Picked Up'
    ]:

        return redirect(
            'order_detail',
            order_id=order.customer_order_number
        )

    if request.method == 'POST':
    
        order.status = 'Cancelled'

        order.cancellation_reason = request.POST.get(
            'cancellation_reason'
        )

        order.save()

        messages.success(
            request,
            "Your cancellation request has been received. Refunds for online payments are processed within 48 hours after approval."
         )

        return redirect(
            'my_orders'
        )

    return render(
        request,
        'cancel_order.html',
        {
            'order': order
        }
    )

@login_required
def submit_complaint(
    request,
    order_id
):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id,
        customer=request.user
    )

    if request.method == 'POST':

        Complaint.objects.create(

            customer=request.user,

            order=order,

            subject=request.POST.get(
                'subject'
            ),

            message=request.POST.get(
                'message'
            )

        )

        messages.success(
            request,
            'Complaint submitted successfully.'
        )

        return redirect(
            'order_detail',
            order_id=order.id
        )

    return render(
        request,
        'submit_complaint.html',
        {
            'order': order
        }
    )

@login_required
def update_delivery_address(
    request,
    order_id
):

    order = LaundryOrder.objects.get(
        id=order_id,
        customer=request.user
    )

    if order.status in [
        'Out For Delivery',
        'Delivered'
    ]:

        return redirect(
            'order_detail',
            order_id=order.id
        )

    if request.method == 'POST':
        print(request.POST)

        new_address = request.POST.get(
            'delivery_address'
        )

        if new_address:

            order.delivery_address = (
                new_address
            )

        order.delivery_latitude = request.POST.get(
            'delivery_latitude'
            )

        order.delivery_longitude = request.POST.get(
            'delivery_longitude'
        )

        # Recalculate distance
        order.delivery_distance_km = Decimal(
            request.POST.get(
                'delivery_distance_km',
                0
            ) or 0
        )

        order.total_distance_km = (
            Decimal(str(order.pickup_distance_km))
            + Decimal(str(order.delivery_distance_km))
        )

        PRICE_PER_KM = Decimal("150")

        order.transport_fee = (
            order.total_distance_km *
            PRICE_PER_KM
        )

        # Recalculate total amount
        items_total = sum(
            item.subtotal
            for item in order.items.all()
        )

        order.total_amount = (
            items_total +
            order.transport_fee
        )
        print("Delivery Distance:", order.delivery_distance_km)
        print("Total Distance:", order.total_distance_km)
        print("Transport Fee:", order.transport_fee)
        order.save()

        return redirect(
            'order_detail',
            order_id=order.id
        )
    
    previous_addresses = LaundryOrder.objects.filter(
            customer=request.user
        ).values_list(
            'delivery_address',
            flat=True
        ).distinct()

    context = {
        'order': order,
        'previous_addresses': previous_addresses
            }

    return render(
        request,
        'update_address.html',
        context
    )


def search_address(request):

    query = request.GET.get(
        'q'
    )

    if not query:

        return JsonResponse(
            [],
            safe=False
        )

    url = (
        "https://nominatim.openstreetmap.org/search"
    )

    response = requests.get(

        url,

        params={
            "q": query,
            "format": "jsonv2",
            "countrycodes": "ng",
            "limit": 5
        },

        headers={
            "User-Agent":
            "WashEasy/1.0 (contact@example.com)"
        }

    )

    print(response.text)

    return JsonResponse(
        [],
        safe=False
)

@login_required
def cancel_order(
    request,
    order_id
):

    order = LaundryOrder.objects.get(
        id=order_id,
        customer=request.user
    )

    if order.status not in [
        'Pending Pickup',
        'Picked Up'
    ]:

        return redirect(
            'order_detail',
            order_id=order.id
        )

    if request.method == 'POST':

        order.status = 'Cancelled'

        order.cancellation_reason = (
            request.POST.get(
                'cancellation_reason'
            )
        )

        order.save()

        return redirect(
            'my_orders'
        )

    return render(
        request,
        'cancel_order.html',
        {
            'order': order
        }
    )

@login_required
def test_notification(request):

    Notification.objects.create(

        user=request.user,

        title='Welcome to WashEasy',

        message='Your notification system is working correctly.'

    )

    return redirect('notifications')




@login_required
def notifications(request):

    notifications = Notification.objects.filter(
        user=request.user
    ).order_by(
        '-created_at'
    )

    Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(
        is_read=True
    )

    return render(
        request,
        'notifications.html',
        {
            'notifications': notifications
        }
    )

@login_required
def clear_notifications(request):

    Notification.objects.filter(
        user=request.user
    ).delete()

    messages.success(
        request,
        'All notifications cleared successfully.'
    )

    return redirect(
        'notifications'
    )

@login_required
def request_refund(request, order_id):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id,
        customer=request.user
    )

    if request.method == 'POST':

        refund_reason = request.POST.get(
            'refund_reason'
        )

        order.refund_requested = True

        order.refund_reason = refund_reason

        order.refund_status = 'Pending'

        order.save()

        Notification.objects.create(
            user=request.user,
            title='Refund Request Submitted',
            message=f'''
Your refund request
for Order #{order.customer_order_number}
has been submitted.
'''
        )

        messages.success(
            request,
            'Refund request submitted.'
        )

        return redirect(
            'order_detail',
            order.id
        )

    return render(
        request,
        'request_refund.html',
        {
            'order': order
        }
    )


# ==========================================================
#               SUBSCRIPTION PAGE
# ==========================================================

from .models import SubscriptionPlan
from .forms import CustomerSubscriptionForm
from datetime import timedelta
from django.utils import timezone
from .models import (
    CustomerSubscription,
    SubscriptionPlan
)



@login_required
def subscription(request):

    plans = SubscriptionPlan.objects.filter(

        is_active=True

    ).order_by("price")

    form = CustomerSubscriptionForm()

    context = {

        "plans": plans,

        "form": form,

    }

    return render(

        request,

        "subscription.html",

        context,

    )



@login_required
def initialize_subscription_payment(
    request,
    plan_id
):

    plan = get_object_or_404(
        SubscriptionPlan,
        id=plan_id,
        is_active=True
    )

    subscription = CustomerSubscription.objects.create(

        customer=request.user,

        plan=plan,

        total_items=plan.total_items,

        remaining_items=plan.total_items,

        amount_paid=plan.price,

        start_date=timezone.now().date(),

        expiry_date=timezone.now().date() + timedelta(
            days=plan.validity_days
        ),

        payment_status="Pending",

        status="Cancelled"

    )

    url = "https://api.paystack.co/transaction/initialize"

    headers = {

        "Authorization":
        f"Bearer {settings.PAYSTACK_SECRET_KEY}",

        "Content-Type":
        "application/json"

    }

    reference = f"SUB-{subscription.id}"

    data = {

        "email":
        request.user.email,

        "amount":
        int(plan.price * 100),

        "reference":
        reference,

        "callback_url":
        request.build_absolute_uri(

            f"/subscription/verify/{subscription.id}/"

        )

    }

    response = requests.post(

        url,

        json=data,

        headers=headers

    )

    response_data = response.json()

    if response_data.get("status"):

        subscription.payment_reference = reference

        subscription.save()

        return redirect(

            response_data["data"]["authorization_url"]

        )

    subscription.delete()

    messages.error(

        request,

        "Unable to initialize payment."

    )

    return redirect(
        "subscription"
    )

@login_required
def verify_subscription_payment(

    request,

    subscription_id

):

    subscription = get_object_or_404(

        CustomerSubscription,

        id=subscription_id,

        customer=request.user

    )

    url = (

        "https://api.paystack.co/transaction/verify/"

        f"{subscription.payment_reference}"

    )

    headers = {

        "Authorization":

        f"Bearer {settings.PAYSTACK_SECRET_KEY}"

    }

    response = requests.get(

        url,

        headers=headers

    )

    response_data = response.json()

    if (

        response_data.get("status")

        and

        response_data["data"]["status"] == "success"

    ):

        subscription.payment_status = "Paid"

        subscription.payment_date = timezone.now()

        subscription.status = "Active"

        subscription.save()

        messages.success(

            request,

            "Subscription activated successfully."

        )

        return redirect(

            "subscription_success",

            subscription.id

        )

    subscription.delete()

    messages.error(

        request,

        "Payment failed."

    )

    return redirect(
        "subscription"
    )

@login_required
def subscription_success(request, subscription_id):

    subscription = get_object_or_404(
        CustomerSubscription,
        id=subscription_id,
        customer=request.user
    )

    return render(
        request,
        "subscription_success.html",
        {
            "subscription": subscription
        }
    )


from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from .forms import SiteSettingsForm
from django.db.models import Sum

User = get_user_model()

@staff_member_required
def admin_dashboard(request):

    total_orders = LaundryOrder.objects.count()

    pending_orders = LaundryOrder.objects.exclude(
    status__in=[
        'Delivered',
        'Cancelled'
    ]
    ).count()

    delivered_orders = LaundryOrder.objects.filter(
        status='Delivered'
    ).count()

    cancelled_orders = LaundryOrder.objects.filter(
    status__in=[
        'Cancelled',
        'cancelled'
    ]
    ).count()

    total_customers = User.objects.count()

    total_revenue = LaundryOrder.objects.filter(
            status='Delivered'
        ).exclude(
            refund_status='Approved'
        ).aggregate(
            total=Sum('total_amount')
        )['total'] or 0
    
    recent_orders = LaundryOrder.objects.order_by(
        '-created_at'
    )[:10]

    context = {

        'total_orders': total_orders,

        'pending_orders': pending_orders,

        'delivered_orders': delivered_orders,

        'cancelled_orders': cancelled_orders,

        'total_customers': total_customers,

        'total_revenue': total_revenue,

        'recent_orders': recent_orders,

    }

    return render(
        request,
        'admin/admin_dashboard.html',
        context
    )

@staff_member_required
def admin_orders(request):

    orders = LaundryOrder.objects.select_related(
        'customer'
    ).order_by(
        '-created_at'
    )

    return render(

        request,

        'admin/admin_orders.html',

        {

            'orders': orders

        }

    )

@staff_member_required
def admin_order_detail(
    request,
    order_id
):

    order = get_object_or_404(

        LaundryOrder,

        id=order_id

    )

    items = order.orderitem_set.all()

    return render(

        request,

        'admin/admin_order_detail.html',

        {

            'order': order,

            'items': items

        }

    )

@staff_member_required
def admin_order_detail(request, order_id):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id
    )

    if request.method == "POST":

        new_status = request.POST.get(
            "status"
        )

        order.status = new_status

        if new_status == 'Out For Delivery':

            if not order.delivery_code:

                import random

                order.delivery_code = str(
                    random.randint(1000, 9999)
                )

                Notification.objects.create(
                    user=order.customer,
                    title='Delivery Verification Code',
                    message=f'''
Your WashEasy delivery verification code is:

{order.delivery_code}

Please provide this code to the rider when your order arrives.
'''
                )

        order.save()

        Notification.objects.create(
            user=order.customer,
            title="Order Update",
            message=f"""
Your Order #{order.customer_order_number}
is now {new_status}.
"""
        )

        messages.success(
            request,
            "Order status updated successfully."
        )

        return redirect(
            'admin_order_detail',
            order_id=order.id
        )

    items = order.items.all()

    laundry_total = sum(
        item.subtotal
        for item in items
    )

    express_total = sum(
        item.express_fee
        for item in items
    )

    return render(
        request,
        'admin/admin_order_detail.html',
        {
            'order': order,
            'items': items,
            'laundry_total': laundry_total,
            'express_total': express_total,

        }
    )


def delivery_verification(request):
    
    if request.method == 'POST':

        username = request.POST.get(
            'username'
        ).strip()

        code = request.POST.get(
            'delivery_code'
        ).strip()

        try:

            order = LaundryOrder.objects.filter(
                customer__username=username,
                delivery_code=code,
                delivery_verified=False
            ).latest('id')

            order.status = 'Delivered'

            order.delivery_verified = True

            order.save()

            Notification.objects.create(
                user=order.customer,
                title='Order Delivered',
                message=f'''
            Order #{order.customer_order_number}
            has been delivered successfully.
            '''
            )

            messages.success(
                request,
                'Delivery verified successfully.'
            )

        except LaundryOrder.DoesNotExist:

            messages.error(
                request,
                'Invalid username or verification code.'
            )

    return render(
        request,
        'delivery_verification.html'
    )

@staff_member_required
def delete_order(request, order_id):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id
    )

    order.delete()

    messages.success(
        request,
        f"Order #{order.customer_order_number} deleted successfully."
    )

    return redirect('admin_orders')

from django.contrib.auth import get_user_model

User = get_user_model()

@staff_member_required
def admin_customers(request):

    search = request.GET.get('search', '')

    customers = User.objects.filter(
        is_staff=False
    )

    if search:

        customers = customers.filter(
            username__icontains=search
        )

    return render(
        request,
        'admin/admin_customers.html',
        {
            'customers': customers,
            'search': search
        }
    )


from .models import Complaint

@staff_member_required
def admin_complaints(request):

    Complaint.objects.filter(
        is_admin_seen=False
    ).update(
        is_admin_seen=True
    )

    complaints = Complaint.objects.select_related(
        'customer',
        'order'
    ).order_by(
        '-created_at'
    )

    return render(
        request,
        'admin/admin_complaints.html',
        {
            'complaints': complaints
        }
    )

from .models import Complaint

@staff_member_required
def admin_complaint_detail(
    request,
    complaint_id
):

    complaint = get_object_or_404(
        Complaint,
        id=complaint_id
    )

    if request.method == 'POST':

        complaint.status = request.POST.get(
            'status'
        )

        complaint.admin_response = request.POST.get(
            'admin_response'
        )

        complaint.save()

        Notification.objects.create(
            user=complaint.customer,
            title='Complaint Update',
            message=f'''
Your complaint regarding
Order #{complaint.order.customer_order_number}
has been updated.

Status:
{complaint.status}
'''
        )

        messages.success(
            request,
            'Complaint updated successfully.'
        )

        return redirect(
            'admin_complaints'
        )

    return render(
        request,
        'admin/admin_complaint_detail.html',
        {
            'complaint': complaint
        }
    )

from .models import Complaint

@staff_member_required
def delete_complaint(
    request,
    complaint_id
):

    complaint = get_object_or_404(
        Complaint,
        id=complaint_id
    )

    complaint.delete()

    messages.success(
        request,
        'Complaint deleted successfully.'
    )

    return redirect(
        'admin_complaints'
    )

@staff_member_required
def admin_refunds(request):

    refunds = LaundryOrder.objects.filter(
        refund_requested=True
    ).order_by('-created_at')

    return render(
        request,
        'admin/admin_refunds.html',
        {
            'refunds': refunds
        }
    )

@staff_member_required
def admin_notifications(request):

    notifications = Notification.objects.order_by(
        '-created_at'
    )

    return render(
        request,
        'admin/admin_notifications.html',
        {
            'notifications': notifications
        }
    )

@staff_member_required
def admin_messages(request):

    return render(
        request,
        'admin/admin_messages.html'
    )


@staff_member_required
def admin_messages(request):

    messages_list = ContactMessage.objects.order_by(
        '-created_at'
    )

    print(messages_list)

    return render(
        request,
        'admin/admin_messages.html',
        {
            'messages_list': messages_list
        }
    )


@staff_member_required
def delete_message(request, message_id):

    message_obj = get_object_or_404(
        ContactMessage,
        id=message_id
    )

    message_obj.delete()

    messages.success(
        request,
        'Message deleted successfully.'
    )

    return redirect(
        'admin_messages'
    )

@staff_member_required
def admin_messages(request):

    ContactMessage.objects.filter(
        is_admin_seen=False
    ).update(
        is_admin_seen=True
    )

    messages_list = ContactMessage.objects.order_by(
        '-created_at'
    )

    return render(
        request,
        'admin/admin_messages.html',
        {
            'messages_list': messages_list
        }
    )

@staff_member_required
def admin_message_detail(
    request,
    message_id
):

    message = get_object_or_404(
        ContactMessage,
        id=message_id
    )

    message.is_admin_seen = True

    message.save()

    return render(
        request,
        'admin/admin_message_detail.html',
        {
            'message': message
        }
    )

@staff_member_required
def refund_detail(request, order_id):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id
    )

    if request.method == 'POST':

        action = request.POST.get('action')

        if action == 'approve':

            order.refund_status = 'Approved'
            order.save()

            Notification.objects.create(
                user=order.customer,
                title='Refund Approved',
                message=f'Your refund request for Order #{order.customer_order_number}has been approved.'
            )

        elif action == 'reject':

            order.refund_status = 'Rejected'
            order.save()

            Notification.objects.create(
                user=order.customer,
                title='Refund Rejected',
                message=f'Your refund request for Order #{order.customer_order_number} has been rejected.'
            )

        return redirect('admin_refunds')

    return render(
        request,
        'admin/refund_detail.html',
        {
            'order': order
        }
    )

@staff_member_required
def send_delete_pin(request, order_id):

    print("===== SEND DELETE PIN CALLED =====")

    order = get_object_or_404(
        LaundryOrder,
        id=order_id
    )

    pin = str(
        random.randint(1000, 9999)
    )

    print("Generated PIN:", pin)

    order.delete_pin = pin
    order.delete_pin_created = timezone.now()
    order.save()

    send_mail(
        subject='WashEasy Order Delete PIN',
        message=f'''
Your WashEasy deletion verification PIN is:

{pin}

Use this PIN to confirm order deletion.
''',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[
            'miraclenwodika@gmail.com'
        ],
        fail_silently=False
    )

    print("EMAIL SENT SUCCESSFULLY")

    return JsonResponse({
        'success': True
    })

@staff_member_required
def verify_delete_order(
    request,
    order_id
):

    order = get_object_or_404(
        LaundryOrder,
        id=order_id
    )

    if request.method == 'POST':

        pin = request.POST.get(
            'pin'
        )

        if pin == order.delete_pin:

            order.delete()

            messages.success(
                request,
                'Order deleted successfully.'
            )

            return redirect(
                'admin_orders'
)

        messages.error(
            request,
            'Invalid PIN.'
        )

    return redirect(
        'admin_order_detail',
        order_id=order.id
    )

@staff_member_required
def admin_price_management(request):

    prices = PriceList.objects.all().order_by(
        'category',
        'item_name'
    )

    return render(
        request,
        'admin/admin_price_management.html',
        {
            'prices': prices
        }
    )

@staff_member_required
def update_price(request, price_id):

    item = get_object_or_404(
        PriceList,
        id=price_id
    )

    if request.method == "POST":

        item.price = request.POST.get("price")

        item.express_price = request.POST.get(
            "express_price",
            0
        )

        item.express_available = (
            "express_available"
            in request.POST
        )

        item.save()

        messages.success(
            request,
            "Price updated successfully."
        )

        return redirect(
            "admin_price_management"
        )

    return render(
        request,
        "admin/update_price.html",
        {
            "item": item
        }
    )

@staff_member_required
def add_price_item(request):

    if request.method == 'POST':

        PriceList.objects.create(

        item_name=request.POST.get(
            "item_name"
        ),

        category=request.POST.get(
            "category"
        ),

        service_type=request.POST.get(
            "service_type"
        ),

        price=request.POST.get(
            "price"
        ),

        express_price=request.POST.get(
            "express_price",
            0
        ),

        express_available=(
            "express_available"
            in request.POST
        )

        )

        messages.success(
            request,
            'Price item added successfully.'
        )

        return redirect(
            'admin_price_management'
        )

    return render(
        request,
        'admin/add_price_item.html',
        {
            'categories': PriceList.CATEGORY_CHOICES,
            'services': PriceList.SERVICE_CHOICES
        }
    )

# ==========================================================
#           ADD SUBSCRIPTION PLAN
# ==========================================================

@staff_member_required
def add_subscription_plan(request):

    if request.method == "POST":

        SubscriptionPlan.objects.create(

            name=request.POST.get("name"),

            price=request.POST.get("price"),

            total_items=request.POST.get("total_items"),

            validity_days=request.POST.get("validity_days"),

            description=request.POST.get("description"),

            is_active=(
                "is_active" in request.POST
            )

        )

        messages.success(
            request,
            "Subscription plan added successfully."
        )

        return redirect(
            "subscription_price_management"
        )

    return render(

        request,

        "admin/add_subscription_plan.html"

    )

@staff_member_required
def delete_price_item(
    request,
    price_id
):

    item = get_object_or_404(
        PriceList,
        id=price_id
    )

    item.delete()

    messages.success(
        request,
        'Price item deleted successfully.'
    )

    return redirect(
        'admin_price_management'
    )

from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta


from django.db.models import Sum, Count
from django.utils import timezone

@staff_member_required
def admin_reports(request):

    today = timezone.now().date()

    total_orders = LaundryOrder.objects.count()

    delivered_orders = LaundryOrder.objects.filter(
        status='Delivered'
    ).count()

    pending_orders = LaundryOrder.objects.filter(
        status='Pending'
    ).count()

    cancelled_orders = LaundryOrder.objects.filter(
        status='Cancelled'
    ).count()

    refund_requests = LaundryOrder.objects.filter(
        refund_requested=True
    ).count()

    total_customers = User.objects.count()

    total_revenue = LaundryOrder.objects.filter(
        status='Delivered'
    ).aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    transport_revenue = LaundryOrder.objects.filter(
        status='Delivered'
    ).aggregate(
        total=Sum('transport_fee')
    )['total'] or 0

    laundry_revenue = (
        total_revenue -
        transport_revenue
    )

    today_revenue = LaundryOrder.objects.filter(
        status='Delivered',
        created_at__date=today
    ).aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    recent_orders = LaundryOrder.objects.order_by(
        '-created_at'
    )[:10]

    service_analytics = PriceList.objects.values(
        'service_type'
    ).annotate(
        total=Count('id')
    ).order_by(
        '-total'
    )

    context = {

        'total_orders': total_orders,

        'delivered_orders': delivered_orders,

        'pending_orders': pending_orders,

        'cancelled_orders': cancelled_orders,

        'refund_requests': refund_requests,

        'total_customers': total_customers,

        'total_revenue': total_revenue,

        'transport_revenue': transport_revenue,

        'laundry_revenue': laundry_revenue,

        'today_revenue': today_revenue,

        'recent_orders': recent_orders,

        'service_analytics': service_analytics,

    }

    return render(
        request,
        'admin/admin_reports.html',
        context
    )

@staff_member_required
def admin_settings(request):

    site_settings = SiteSettings.objects.first()

    if not site_settings:

            site_settings = SiteSettings.objects.create(
            business_name='WashEasy',
            business_email='washeasy21@gmail.com',
            business_phone='08000000000',
            business_address='119, Odunsi Street, Bariga, Lagos',
            business_latitude=6.53699,
            business_longitude=3.39630,
            transport_price_per_km=150,
            notification_sound=True,
    )
    
    if request.method == "POST":
        
        site_settings.business_name = request.POST.get('business_name')

        site_settings.business_email = request.POST.get('business_email')

        site_settings.business_phone = request.POST.get('business_phone')

        site_settings.business_address = request.POST.get('business_address')

        site_settings.business_latitude = request.POST.get('business_latitude')

        site_settings.business_longitude = request.POST.get('business_longitude')

        site_settings.transport_price_per_km = request.POST.get('transport_price_per_km')

        site_settings.notification_sound = (
            request.POST.get('notification_sound') == 'on'
        )
        print("Address from form:", request.POST.get("business_address"))

        site_settings.save()
        
        site_settings.refresh_from_db()

        print("Address after save:", site_settings.business_address)

        messages.success(
            request,
            "Settings updated successfully."
        )

        return redirect('admin_settings')

    return render(
        request,
        'admin/admin_settings.html',
        {
            'site_settings': site_settings
        }
    )


from django.http import JsonResponse

def admin_notification_count(request):

    return JsonResponse({
        "count": 10
    })

from django.http import JsonResponse

@login_required
def customer_alert_count(request):

    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()

    return JsonResponse(
        {
            'count': count
        }
    )




def admin_logout(request):
    
    request.session.flush()

    logout(request)

    return redirect(
        'admin_login'
    )

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib import messages


def admin_login(request):

    if request.method == 'POST':

        username = request.POST.get(
            'username'
        )

        password = request.POST.get(
            'password'
        )

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None and user.is_staff:

            login(
                request,
                user
            )

            return redirect(
                'admin_dashboard'
            )

        messages.error(
            request,
            'Invalid admin credentials.'
        )

    return render(
        request,
        'admin/admin_login.html'
    )

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def delete_customer(request, user_id):

    print("=" * 50)
    print("DELETE CUSTOMER CALLED")
    print("User ID:", user_id)

    customer = get_object_or_404(
        User,
        id=user_id
    )

    print("Deleting:", customer.username)

    if request.method == "POST":

        customer.delete()

        print("Deleted successfully!")

        messages.success(
            request,
            "Customer account deleted successfully."
        )

    return redirect("admin_customers")

# ==========================================================
#       SUBSCRIPTION PRICE MANAGEMENT
# ==========================================================

@staff_member_required
def subscription_price_management(request):

    plans = SubscriptionPlan.objects.prefetch_related(
        "categories",
        "services"
    ).order_by("price")

    return render(
        request,
        "admin/subscription_price_management.html",
        {
            "plans": plans
        }
    )

# ==========================================================
#         UPDATE SUBSCRIPTION PLAN
# ==========================================================

@staff_member_required
def update_subscription_plan(request, plan_id):

    plan = get_object_or_404(
        SubscriptionPlan,
        id=plan_id
    )

    if request.method == "POST":

        plan.price = request.POST.get("price")

        plan.total_items = request.POST.get("total_items")

        plan.validity_days = request.POST.get("validity_days")

        plan.description = request.POST.get("description")

        plan.is_active = (
            "is_active" in request.POST
        )

        plan.save()

        messages.success(
            request,
            "Subscription updated successfully."
        )

        return redirect(
            "subscription_price_management"
        )

    return render(
        request,
        "admin/update_subscription_plan.html",
        {
            "plan": plan
        }
    )

# ==========================================================
#          DELETE SUBSCRIPTION PLAN
# ==========================================================

@staff_member_required
def delete_subscription_plan(request, plan_id):

    plan = get_object_or_404(

        SubscriptionPlan,

        id=plan_id

    )

    plan.delete()

    messages.success(

        request,

        "Subscription plan deleted successfully."

    )

    return redirect(

        "subscription_price_management"

    )

