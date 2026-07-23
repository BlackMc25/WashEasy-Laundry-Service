from django.urls import path
from . import views
from django.contrib.sitemaps.views import sitemap
from .sitemaps import StaticViewSitemap


sitemaps = {
    "static": StaticViewSitemap,
}


urlpatterns = [

    path(
        '',
        views.home,
        name='home'
    ),

    path(
        'book-laundry/',
        views.book_laundry,
        name='book_laundry'
    ),

    path(
    'my-orders/',
    views.my_orders,
    name='my_orders'
    ),

    path(
        'order/<int:order_id>/',
        views.order_detail,
        name='order_detail'
    ),

    path(
        'search-address/',
        views.search_address,
        name='search_address'
    ),

    path(
        'update-address/<int:order_id>/',
        views.update_delivery_address,
        name='update_delivery_address'
    ),

    path(
        'cancel-order/<int:order_id>/',
        views.cancel_order,
        name='cancel_order'
    ),

    path(
        'submit-complaint/<int:order_id>/',
        views.submit_complaint,
        name='submit_complaint'
    ),

    path(
        'notifications/',
        views.notifications,
        name='notifications'
    ),

    path(
        'clear-notifications/',
        views.clear_notifications,
        name='clear_notifications'
    ),

    path(
        'test-notification/',
        views.test_notification,
        name='test_notification'
    ),

    path(
        'admin-dashboard/',
        views.admin_dashboard,
        name='admin_dashboard'
    ),

    path(
        'admin-orders/',
        views.admin_orders,
        name='admin_orders'
    ),

    path(
        'admin-order/<int:order_id>/',
        views.admin_order_detail,
        name='admin_order_detail'
    ),

    path(
        'delete-order/<int:order_id>/',
        views.delete_order,
        name='delete_order'
    ),

    path(
        'admin-customers/',
        views.admin_customers,
        name='admin_customers'
    ),

    path(
        'admin-complaints/',
        views.admin_complaints,
        name='admin_complaints'
    ),

    path(
        'admin-refunds/',
        views.admin_refunds,
        name='admin_refunds'
    ),

    path(
        'customer-alert-count/',
        views.customer_alert_count,
        name='customer_alert_count'
    ),

    path(
        'admin-messages/',
        views.admin_messages,
        name='admin_messages'
    ),

    path(
        'admin-reports/',
        views.admin_reports,
        name='admin_reports'
    ),

    path(
        'admin-settings/',
        views.admin_settings,
        name='admin_settings'
    ),

    path(
        'admin-complaint/<int:complaint_id>/',
        views.admin_complaint_detail,
        name='admin_complaint_detail'
    ),

    path(
        'delete-complaint/<int:complaint_id>/',
        views.delete_complaint,
        name='delete_complaint'
    ),

    path(
        'admin-message/<int:message_id>/',
        views.admin_message_detail,
        name='admin_message_detail'
    ),

    path(
        'delete-message/<int:message_id>/',
        views.delete_message,
        name='delete_message'
    ),

    path(
        'request-refund/<int:order_id>/',
        views.request_refund,
        name='request_refund'
    ),

    path(
        'admin-refund/<int:order_id>/',
        views.refund_detail,
        name='refund_detail'
    ),

    path(
        'delivery-verification/',
        views.delivery_verification,
        name='delivery_verification'
    ),

    path(
        'send-delete-pin/<int:order_id>/',
        views.send_delete_pin,
        name='send_delete_pin'
    ),

    path(
        'verify-delete-order/<int:order_id>/',
        views.verify_delete_order,
        name='verify_delete_order'
    ),

    path(
        'admin-price-management/',
        views.admin_price_management,
        name='admin_price_management'
    ),

    path(
        'update-price/<int:price_id>/',
        views.update_price,
        name='update_price'
    ),

    path(
        'add-price-item/',
        views.add_price_item,
        name='add_price_item'
    ),

    path(
        'delete-price-item/<int:price_id>/',
        views.delete_price_item,
        name='delete_price_item'
    ),

    path(
        'admin-dashboard/logout/',
        views.admin_logout,
        name='admin_logout'
    ),

    path(
        'admin-login/',
        views.admin_login,
        name='admin_login'
    ),

    path(
        'delete-customer/<int:user_id>/',
        views.delete_customer,
        name='delete_customer'
        ),

        path(
        "sitemap.xml",
        sitemap,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
        ),

        path(
            "subscription/",
            views.subscription,
            name="subscription",
        ),

        path(
        "admin/subscription/add/",
        views.add_subscription_plan,
        name="add_subscription_plan",
        ),

        path(
        "admin/subscription/delete/<int:plan_id>/",
        views.delete_subscription_plan,
        name="delete_subscription_plan",
    ),

]




