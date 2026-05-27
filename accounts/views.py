# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import BuyerRegistrationForm, SellerRegistrationForm, LoginForm


def register_buyer(request):
    if request.user.is_authenticated:
        return redirect('accounts:role_redirect')
    if request.method == 'POST':
        form = BuyerRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('accounts:role_redirect')
    else:
        form = BuyerRegistrationForm()
    return render(request, 'accounts/register_buyer.html', {'form': form})


def register_seller(request):
    if request.user.is_authenticated:
        return redirect('accounts:role_redirect')
    if request.method == 'POST':
        form = SellerRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('accounts:role_redirect')
    else:
        form = SellerRegistrationForm()
    return render(request, 'accounts/register_seller.html', {'form': form})


def user_login(request):
    if request.user.is_authenticated:
        return redirect('accounts:role_redirect')
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('accounts:role_redirect')
            else:
                form.add_error(None, 'Invalid email or password')
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})


#@login_required
def user_logout(request):
    logout(request)
    return redirect('accounts:login')



@login_required
def role_redirect(request):
    if request.user.role == 'seller':
        return redirect('accounts:seller_dashboard')
    elif request.user.role == 'buyer':
        return redirect('accounts:buyer_dashboard')
    else:
        return redirect('/admin/')


@login_required
def seller_dashboard(request):
    from .decorators import seller_required
    if request.user.role != 'seller':
        return redirect('accounts:role_redirect')
    return render(request, 'accounts/seller_dashboard.html')


@login_required
def buyer_dashboard(request):
    if request.user.role != 'buyer':
        return redirect('accounts:role_redirect')
    return render(request, 'accounts/buyer_dashboard.html')


def homepage(request):
    if request.user.is_authenticated:
        return redirect('accounts:role_redirect')
    return render(request, 'homepage.html')