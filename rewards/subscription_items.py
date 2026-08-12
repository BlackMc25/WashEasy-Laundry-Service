def is_subscription_item(price_obj, subscription_or_plan):
    
    if not subscription_or_plan:
        return False

    if hasattr(subscription_or_plan, "plan"):
        plan_name = subscription_or_plan.plan.name.lower()
    else:
        plan_name = subscription_or_plan.name.lower()

    if plan_name == "basic":
        return price_obj.basic_subscription

    elif plan_name == "standard":
        return price_obj.standard_subscription

    elif plan_name == "premium":
        return price_obj.premium_subscription

    return False
