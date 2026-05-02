from django.shortcuts import redirect
from functools import wraps


def buyer_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('accounts:login')
        if request.user.role != 'buyer':
            return redirect('accounts:role_redirect')
        return view_func(request, *args, **kwargs)
    return wrapper


def seller_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('accounts:login')
        if request.user.role != 'seller':
            return redirect('accounts:role_redirect')
        return view_func(request, *args, **kwargs)
    return wrapper


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('accounts:login')
        if request.user.role != 'admin' and not request.user.is_superuser:
            return redirect('accounts:role_redirect')
        return view_func(request, *args, **kwargs)
    return wrapper