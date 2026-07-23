from django.db import models
from django.conf import settings


class LaundryOrder(models.Model):
    
    STATUS_CHOICES = [
        ('Pending Pickup', 'Pending Pickup'),
        ('Picked Up', 'Picked Up'),
        ('Cleaning', 'Cleaning'),
        ('Ready', 'Ready'),
        ('Out For Delivery', 'Out For Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_CHOICES = [
        ('Pay On Delivery', 'Pay On Delivery'),
    ]

    SERVICE_CHOICES = [
        ('Wash & Fold', 'Wash & Fold'),
        ('Wash & Iron', 'Wash & Iron'),
        ('Dry Cleaning', 'Dry Cleaning'),
    ]

    refund_requested = models.BooleanField(
        default=False
    )

    refund_reason = models.TextField(
        blank=True,
        null=True
    )

    refund_status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected')
        ],
        default='Pending'
    )

    customer_order_number = models.PositiveIntegerField(
    blank=True,
    null=True
    )
        
    
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    subscription = models.ForeignKey(
    "CustomerSubscription",
    on_delete=models.SET_NULL,
    blank=True,
    null=True,
    related_name="orders"
    )

    phone_number = models.CharField(
    max_length=15
   )

    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES
    )

    pickup_address = models.TextField(
        blank=True,
        null=True
    )

    delivery_address = models.TextField(
        blank=True,
        null=True
    )

    # MAP COORDINATES
    pickup_latitude = models.FloatField(
        blank=True,
        null=True
    )

    pickup_longitude = models.FloatField(
        blank=True,
        null=True
    )

    delivery_latitude = models.FloatField(
        blank=True,
        null=True
    )

    delivery_longitude = models.FloatField(
        blank=True,
        null=True
    )

    distance_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    pickup_distance_km = models.DecimalField(
            max_digits=10,
            decimal_places=2,
            default=0
        )

    delivery_distance_km = models.DecimalField(
            max_digits=10,
            decimal_places=2,
            default=0
        )

    total_distance_km = models.DecimalField(
            max_digits=10,
            decimal_places=2,
            default=0
        )
    
    transport_fee = models.DecimalField(
            max_digits=10,
            decimal_places=2,
            default=0
        )
    
    express_service = models.BooleanField(
    default=False
)

    express_fee = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0
    )

    pickup_date = models.DateField()

    special_instructions = models.TextField(
        blank=True,
        null=True
    )

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_CHOICES,
        default='Pay On Delivery'
    )

    pickup_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=500
    )

    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=500
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    payment_reference = models.CharField(
        max_length=200,
        blank=True,
        null=True

    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='Pending Pickup'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    cancellation_reason = models.TextField(
    blank=True,
    null=True
)
    
    complaint = models.TextField(
        blank=True,
        null=True
    )

    complaint_subject = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    complaint_status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('In Progress', 'In Progress'),
            ('Resolved', 'Resolved'),
            ('Rejected', 'Rejected')
        ],
        default='Pending'
    )

    complaint_response = models.TextField(
        blank=True,
        null=True
    )

    complaint_created_at = models.DateTimeField(
        blank=True,
        null=True
    )

    complaint_admin_seen = models.BooleanField(
        default=False
    )
    
    delivery_code = models.CharField(
    max_length=4,
    blank=True,
    null=True
    )

    delivery_verified = models.BooleanField(
    default=False
    )

    delete_pin = models.CharField(
    max_length=4,
    blank=True,
    null=True
    )

    delete_pin_created = models.DateTimeField(
    blank=True,
    null=True
    )

    is_admin_seen = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"Order #{self.id}"

class PriceList(models.Model):
    
    CATEGORY_CHOICES = [
        ('Everyday Wear', 'Everyday Wear'),
        ('Corporate Wear', 'Corporate Wear'),
        ('Traditional Wear', 'Traditional Wear'),
        ('Underwear', 'Underwear'),
        ("Children's Wear", "Children's Wear"),
        ('Bedding', 'Bedding'),
        ('Shoes&Accessories', 'Shoes&Accessories'),
        ('Special Care', 'Special Care'),
    ]

    SERVICE_CHOICES = [
        ('Wash & Fold', 'Wash & Fold'),
        ('Wash & Iron', 'Wash & Iron'),
        ('Dry Cleaning', 'Dry Cleaning'),
    ]

    item_name = models.CharField(max_length=100)

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    express_price = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0,
    help_text="Extra charge per item for Express Service"
)

    express_available = models.BooleanField(
    default=True
)

    def __str__(self):
        return f"{self.item_name} - {self.service_type}"
    
class OrderItem(models.Model):
    
    order = models.ForeignKey(
        LaundryOrder,
        on_delete=models.CASCADE,
        related_name='items'
    )

    item = models.ForeignKey(
        PriceList,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    express_quantity = models.PositiveIntegerField(
    default=0
    )

    express_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_subtotal = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0
    )

    def __str__(self):
        return f"{self.item.item_name}"


class Notification(models.Model):
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.title

class ContactMessage(models.Model):
    
    name = models.CharField(
        max_length=100
    )

    email = models.EmailField()

    subject = models.CharField(
        max_length=255
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_admin_seen = models.BooleanField(
    default=False
)

    def __str__(self):

        return self.subject
    
class SiteSettings(models.Model):
    
    business_name = models.CharField(
        max_length=100,
        default='WashEasy'
    )

    business_email = models.EmailField()

    business_phone = models.CharField(
        max_length=20
    )

    business_address = models.CharField(
        max_length=255,
        default='119, Odunsi Street, Bariga, Lagos'
    )

    business_latitude = models.FloatField(
        default=6.53699
    )

    business_longitude = models.FloatField(
        default=3.39630
    )

    transport_price_per_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=150
    )

    support_email = models.EmailField(
        blank=True,
        null=True
    )

    notification_sound = models.BooleanField(
        default=True
    )

    def __str__(self):

        return self.business_name
    
class Complaint(models.Model):
    
    STATUS_CHOICES = [

        ('Pending', 'Pending'),

        ('In Progress', 'In Progress'),

        ('Resolved', 'Resolved'),

        ('Rejected', 'Rejected'),

    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    order = models.ForeignKey(
        LaundryOrder,
        on_delete=models.CASCADE,
        related_name='complaints'
    )

    subject = models.CharField(
        max_length=255
    )

    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    admin_response = models.TextField(
        blank=True,
        null=True
    )

    is_admin_seen = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f"Complaint #{self.id}"
    

# ==========================================================
#                   SUBSCRIPTION PLANS
# ==========================================================

class SubscriptionPlan(models.Model):

    PLAN_CHOICES = [

        ('Basic', 'Basic'),
        ('Standard', 'Standard'),
        ('Premium', 'Premium'),
        ('Executive', 'Executive'),

    ]

    name = models.CharField(
        max_length=30,
        choices=PLAN_CHOICES,
        unique=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_items = models.PositiveIntegerField()

    validity_days = models.PositiveIntegerField(
        default=30
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name
    
# ==========================================================
#              SUBSCRIPTION SERVICES
# ==========================================================

class SubscriptionService(models.Model):

    plan = models.ForeignKey(

        SubscriptionPlan,

        on_delete=models.CASCADE,

        related_name="services"

    )

    service_name = models.CharField(

        max_length=100

    )

    def __str__(self):

        return f"{self.plan.name} - {self.service_name}"
    

# ==========================================================
#           SUBSCRIPTION CATEGORIES
# ==========================================================

class SubscriptionCategory(models.Model):

    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.CASCADE,
        related_name="categories"
    )

    category_name = models.CharField(
        max_length=100
    )

    def __str__(self):

        return f"{self.plan.name} - {self.category_name}"

# ==========================================================
#              CUSTOMER SUBSCRIPTION
# ==========================================================

class CustomerSubscription(models.Model):

    STATUS_CHOICES = [

        ('Active', 'Active'),

        ('Expired', 'Expired'),

        ('Cancelled', 'Cancelled'),

    ]

    customer = models.ForeignKey(

        settings.AUTH_USER_MODEL,

        on_delete=models.CASCADE,

        related_name="subscriptions"

    )

    plan = models.ForeignKey(

        SubscriptionPlan,

        on_delete=models.CASCADE

    )

    subscription_number = models.PositiveIntegerField(

        blank=True,

        null=True

    )

    total_items = models.PositiveIntegerField()

    remaining_items = models.PositiveIntegerField()

    used_items = models.PositiveIntegerField(

        default=0

    )

    start_date = models.DateField()

    expiry_date = models.DateField()

    amount_paid = models.DecimalField(

        max_digits=10,

        decimal_places=2

    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="Active"

    )

    created_at = models.DateTimeField(

        auto_now_add=True

    )

    def save(self, *args, **kwargs):
    
        if not self.pk:

            self.remaining_items = self.total_items

            last_subscription = CustomerSubscription.objects.filter(

                customer=self.customer

            ).count()

            self.subscription_number = last_subscription + 1

        super().save(*args, **kwargs)

    @property
    def progress_percentage(self):

        if self.total_items == 0:

            return 0

        return int(

            (self.remaining_items / self.total_items) * 100

        )
    @property
    def days_remaining(self):

        from django.utils import timezone

        today = timezone.now().date()

        remaining = (self.expiry_date - today).days

        return max(remaining, 0)

    @property
    def items_used(self):

        return self.total_items - self.remaining_items

    def __str__(self):

        return f"{self.customer} - {self.plan.name}"
    
# ====================================================  ======
#            SUBSCRIPTION ITEM USAGE HISTORY
# ==========================================================

class SubscriptionUsage(models.Model):

    subscription = models.ForeignKey(

        CustomerSubscription,

        on_delete=models.CASCADE,

        related_name="usage"

    )

    order = models.ForeignKey(

        LaundryOrder,

        on_delete=models.CASCADE

    )

    items_used = models.PositiveIntegerField()

    created_at = models.DateTimeField(

        auto_now_add=True

    )

    def __str__(self):

        return f"{self.subscription.plan.name} - {self.items_used} Items"
    
  