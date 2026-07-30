from django.urls import path
from . import views

urlpatterns = [
    path('login/',
         views.login_view,
         name='login'),
    
    path('signup/',
         views.signup_view,
         name='signup'),

    path('dashboard/',
         views.dashboard,
         name='dashboard'),
    
    path('logout/',
         views.logout_view,
         name='logout'),

    path(
    "customer/logout/",
    views.customer_logout,
    name="customer_logout",
        ),

      path(
          'initialize-payment/<int:order_id>/',
          views.initialize_payment,
          name='initialize_payment'
          ),
     
      path(
          'verify-payment/<int:order_id>/',
          views.verify_payment,
          name='verify_payment'
          ),

     path(
          'profile/',
          views.profile,
          name='profile'
          ),

     path(
     'settings/',
     views.settings_view,
     name='settings'
     ),

path(
    'contact-us/',
    views.contact_us,
    name='contact_us'
),

path(
    "send-customer-delete-pin/<int:user_id>/",
    views.send_customer_delete_pin,
    name="send_customer_delete_pin"
),

path(
    "verify-customer-delete/<int:user_id>/",
    views.verify_customer_delete,
    name="verify_customer_delete"
),

path(
    "send-customer-delete-pin/<int:user_id>/",
    views.send_customer_delete_pin,
    name="send_customer_delete_pin"
),

path(
    "verify-customer-delete/<int:user_id>/",
    views.verify_customer_delete,
    name="verify_customer_delete"
),

path(
    "verify-email/<str:token>/",
    views.verify_email,
    name="verify_email",
),

path(

    "verify/<str:token>/",

    views.verify_email_link,

    name="verify_email_link",

),

path(
    "verify-otp/<int:user_id>/",
    views.verify_otp,
    name="verify_otp",
),

path(
    "resend-verification/<int:user_id>/",
    views.resend_verification_code,
    name="resend_verification_code",
),

]