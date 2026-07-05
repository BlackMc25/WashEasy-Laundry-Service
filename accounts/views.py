from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.cache import cache_control
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from .forms import SignUpForm
from django.core.mail import send_mail
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import redirect
from .forms import ProfileUpdateForm
from django.db.models import Sum, Q
from decimal import Decimal
from django.shortcuts import get_object_or_404
from accounts.models import CustomUser
from datetime import timedelta
from django.utils import timezone
from accounts.models import AdminDeletePIN
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
import random
from django.contrib.auth.decorators import login_required
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from core.models import (
    LaundryOrder,
    OrderItem,
    PriceList,
    ContactMessage
)

def signup_view(request):
    
    if request.method == "POST":

        form = SignUpForm(request.POST)

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Account created successfully."
            )

            return redirect("home")

        return render(
            request,
            "home.html",
            {
                "form": form,
                "show_signup_modal": True,
            }
        )

    form = SignUpForm()

    return render(
        request,
        "home.html",
        {
            "form": form
        }
    )

def login_view(request):
    if request.method == "POST":

        form = AuthenticationForm(
            request,
            data=request.POST
        )

        if form.is_valid():

            user = form.get_user()

            login(request, user)

            return redirect('dashboard')

        messages.error(
            request, 
            "Invailed Username or Password"
        )
        
    return redirect('home')


@login_required
def dashboard(request):

    customer_orders = LaundryOrder.objects.filter(
    customer=request.user
)

    total_orders = customer_orders.count()

    pending_orders = customer_orders.exclude(
    status__in=[
        'Delivered',
        'Cancelled'
    ]
        ).count()

    completed_orders = customer_orders.filter(
        status='Delivered'
    ).count()

    cancelled_orders = customer_orders.filter(
        status='Cancelled'
        ).count()

    amount_spent = LaundryOrder.objects.filter(
        customer=request.user,
        status='Delivered'
    ).exclude(
        refund_status='Approved'
    ).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
        
    recent_orders = customer_orders.order_by(
    '-created_at'
        )[:5]

    context = {

        'total_orders': total_orders,

        'pending_orders': pending_orders,

        'completed_orders': completed_orders,

        'cancelled_orders': cancelled_orders,

        'amount_spent': amount_spent,

        'recent_orders': recent_orders

    }

    return render(
        request,
        'dashboard.html',
        context
    )

def logout_view(request):
    
    logout(request)

    return redirect('home')

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def home(request):

    context = {
        'signup_form': SignUpForm(),
        'login_form': AuthenticationForm(),
    }  

    return render(
        request, 
        'home.html',
        context
    )

@login_required
def initialize_payment(
        request,
        order_id
        ):

        ONLINE_PAYMENT_ENABLED = False

        if not ONLINE_PAYMENT_ENABLED:
            messages.warning(
                request,
                "Online payment is temporarily unavailable."
            )
            return redirect("order_detail", order_id=order.id)

        order = get_object_or_404(
        LaundryOrder,
        id=order_id,
        customer=request.user
        )

        url = "https://api.paystack.co/transaction/initialize"

        headers = {
        "Authorization":
        f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type":
        "application/json"
        }

        data = {

        "email":
        request.user.email,

        "amount":
        int(order.total_amount * 100),

        "reference":
        f"WASHEASY-{order_id}",

        "callback_url":
        request.build_absolute_uri(
            f"/verify-payment/{order_id}/"
        )
        }

        response = requests.post(
        url,
        json=data,
        headers=headers
        )

        response_data = response.json()

        if response_data.get("status"):

            order.payment_reference = (
            response_data["data"]["reference"]
        )

            order.save()

            return redirect(
                response_data["data"]["authorization_url"]
            )

        return redirect(
            'my_orders'
        )

@login_required
def verify_payment(
            request,
            order_id
    ):

        order = get_object_or_404(
            LaundryOrder,
            id=order_id,
            customer=request.user
        )

        url = (
            "https://api.paystack.co/transaction/verify/"
            f"{order.payment_reference}"
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
            response_data["data"]["status"]
            == "success"
        ):

            order.payment_status = "Paid"

            order.save()

        return redirect(
            'my_orders'
        )
   

@login_required
def profile(request):

    total_orders = LaundryOrder.objects.filter(
    customer=request.user
    ).count()

    pending_orders = LaundryOrder.objects.filter(
        customer=request.user
    ).exclude(
        status__in=[
            'Delivered',
            'Cancelled',
            'cancelled'
        ]
    ).count()

    completed_orders = LaundryOrder.objects.filter(
        customer=request.user,
        status='Delivered'
    ).count()

    cancelled_orders = LaundryOrder.objects.filter(
        customer=request.user,
        status__in=[
            'Cancelled',
            'cancelled'
        ]
    ).count()

    context = {

        'total_orders': total_orders,

        'pending_orders': pending_orders,

        'completed_orders': completed_orders,

        'cancelled_orders': cancelled_orders

    }

    return render(
        request,
        'profile.html',
        context
    )

@login_required
def settings_view(request):

    if request.method == 'POST':

        form = ProfileUpdateForm(
            request.POST,
            instance=request.user
        )

        if form.is_valid():

            form.save()

            messages.success(
                request,
                'Settings updated successfully.'
            )

            return redirect(
                'settings'
            )

    else:

        form = ProfileUpdateForm(
            instance=request.user
        )

    return render(
        request,
        'settings.html',
        {
            'form': form
        }
    )

from django.contrib.auth import logout
from django.shortcuts import redirect

@login_required
def customer_logout(request):
    logout(request)
    return redirect("home")

from django.core.mail import send_mail

def contact_us(request):

    if request.method == 'POST':

        name = request.POST.get(
            'name'
        )

        email = request.POST.get(
            'email'
        )

        subject = request.POST.get(
            'subject'
        )

        message = request.POST.get(
            'message'
        )

        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        try:

            send_mail(
                subject,
                message,
                email,
                ['washeasy21@gmail.com'],
                fail_silently=False
            )

        except Exception as e:

            print("Email Error:", e)

        messages.success(
            request,
            "Message sent successfully."
        )

        return redirect('contact_us')
    return render(
        request,
        'home.html'
    )



@staff_member_required
def send_customer_delete_pin(
    request,
    user_id
):

    customer = get_object_or_404(
    CustomUser,
    id=user_id
    )

    AdminDeletePIN.objects.filter(
        admin=request.user,
        purpose="customer_delete"
    ).delete()

    pin = str(
        random.randint(
            1000,
            9999
        )
    )

    AdminDeletePIN.objects.create(

        admin=request.user,

        pin=pin,

        purpose="customer_delete",

        customer_id=customer.id

    )

    send_mail(

        subject="WashEasy Customer Delete PIN",

        message=f"""
Customer Deletion Verification

Customer:
{customer.username}

PIN:

{pin}

This PIN expires in 10 minutes.
""",

        from_email=settings.EMAIL_HOST_USER,

        recipient_list=[
            request.user.email
        ],

        fail_silently=False

    )

    return JsonResponse(
        {
            "success":True
        }
    )

@staff_member_required
def verify_customer_delete(
    request,
    user_id
):

    if request.method != "POST":

        return redirect(
            "admin_customers"
        )

    pin = request.POST.get(
        "pin"
    )

    try:

        record = AdminDeletePIN.objects.get(

            admin=request.user,

            pin=pin,

            purpose="customer_delete",

            customer_id=user_id

        )

    except AdminDeletePIN.DoesNotExist:

        messages.error(
            request,
            "Invalid PIN."
        )

        return redirect(
            "admin_customers"
        )

    if timezone.now() > record.created_at + timedelta(minutes=10):

        record.delete()

        messages.error(
            request,
            "PIN has expired."
        )

        return redirect(
            "admin_customers"
        )

    customer = get_object_or_404(
    CustomUser,
    id=user_id
    )

    customer.delete()

    record.delete()

    messages.success(

        request,

        "Customer deleted successfully."

    )

    return redirect(
        "admin_customers"
    )
