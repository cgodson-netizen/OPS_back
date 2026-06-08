from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('register/buyer/', views.register_buyer, name='register_buyer'),
    path('register/seller/', views.register_seller, name='register_seller'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('redirect/', views.role_redirect, name='role_redirect'),
    path('dashboard/seller/', views.seller_dashboard, name='seller_dashboard'),
    path('dashboard/buyer/', views.buyer_dashboard, name='buyer_dashboard'),
    path('password-reset/', views.password_reset_request, name='password_reset_request'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('set-new-password/', views.set_new_password, name='set_new_password'),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
]