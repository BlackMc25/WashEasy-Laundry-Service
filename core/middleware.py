from django.shortcuts import redirect


class SubdomainRedirectMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        host = request.get_host().split(":")[0]

        # Customer Website
        if host == "washeasy.peneirize.com":
            return self.get_response(request)

        # Admin Website
        if (
            host == "washeasyadmin.peneirize.com"
            and request.path == "/"
        ):
            return redirect("admin_login")

        # Delivery Verification Website
        if (
            host == "washeasydeliveryverify.peneirize.com"
            and request.path == "/"
        ):
            return redirect("delivery_verification")

        return self.get_response(request)