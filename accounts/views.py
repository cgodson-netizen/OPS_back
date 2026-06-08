# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import BuyerRegistrationForm, SellerRegistrationForm, LoginForm
from django.core.mail import send_mail
from django.conf import settings
from .models import PasswordResetOTP
from django.http import JsonResponse
from .models import CustomUser, PasswordResetOTP

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


@login_required
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

def password_reset_request(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        try:
            user = CustomUser.objects.get(email=email)
            # Generate OTP
            otp = PasswordResetOTP.generate_otp()
            PasswordResetOTP.objects.create(user=user, otp=otp)

            # Send email
            send_mail(
                subject='OPS Marketplace — Password Reset OTP',
                message=f'Your OTP for password reset is: {otp}\n\nThis code expires in 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            # Store email in session for OTP verification step
            request.session['reset_email'] = email
            return redirect('accounts:verify_otp')
        except CustomUser.DoesNotExist:
            # Don't reveal if email exists or not
            request.session['reset_email'] = email
            return redirect('accounts:verify_otp')

    return render(request, 'accounts/password_reset.html')


def verify_otp(request):
    email = request.session.get('reset_email')
    if not email:
        return redirect('accounts:password_reset_request')

    if request.method == 'POST':
        otp_digits = [
            request.POST.get('otp_1', ''),
            request.POST.get('otp_2', ''),
            request.POST.get('otp_3', ''),
            request.POST.get('otp_4', ''),
        ]
        otp = ''.join(otp_digits)

        try:
            user = CustomUser.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False
            ).last()

            if otp_record and otp_record.is_valid():
                otp_record.is_used = True
                otp_record.save()
                request.session['reset_verified'] = True
                return redirect('accounts:set_new_password')
            else:
                return render(request, 'accounts/verify_otp.html', {
                    'error': 'Invalid or expired OTP. Please try again.',
                    'email': email
                })
        except CustomUser.DoesNotExist:
            return render(request, 'accounts/verify_otp.html', {
                'error': 'Something went wrong. Please try again.',
                'email': email
            })

    return render(request, 'accounts/verify_otp.html', {'email': email})


def set_new_password(request):
    if not request.session.get('reset_verified'):
        return redirect('accounts:password_reset_request')

    email = request.session.get('reset_email')

    if request.method == 'POST':
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')

        if password1 != password2:
            return render(request, 'accounts/set_new_password.html', {
                'error': 'Passwords do not match.'
            })

        if len(password1) < 8:
            return render(request, 'accounts/set_new_password.html', {
                'error': 'Password must be at least 8 characters.'
            })

        try:
            user = CustomUser.objects.get(email=email)
            user.set_password(password1)
            user.save()

            # Clear session
            del request.session['reset_email']
            del request.session['reset_verified']

            return redirect('accounts:login')
        except CustomUser.DoesNotExist:
            return redirect('accounts:password_reset_request')

    return render(request, 'accounts/set_new_password.html')


def resend_otp(request):
    if request.method == 'POST':
        email = request.session.get('reset_email')
        if email:
            try:
                user = CustomUser.objects.get(email=email)
                otp = PasswordResetOTP.generate_otp()
                PasswordResetOTP.objects.create(user=user, otp=otp)
                send_mail(
                    subject='OPS Marketplace — New OTP',
                    message=f'Your new OTP is: {otp}\n\nThis code expires in 10 minutes.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                return JsonResponse({'status': 'sent'})
            except CustomUser.DoesNotExist:
                return JsonResponse({'status': 'sent'})
    return JsonResponse({'status': 'error'}, status=400)