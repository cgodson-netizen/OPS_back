from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('payments/pay/<int:order_id>/', views.initiate_payment, name='initiate_payment'),
    path('payments/verify/<str:reference>/', views.verify_payment, name='verify_payment'),
    path('payments/success/<int:order_id>/', views.payment_success, name='payment_success'),
    path('payments/failed/<int:order_id>/', views.payment_failed, name='payment_failed'),
]