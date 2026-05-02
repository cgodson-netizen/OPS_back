from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    # Cart URLs
    path('cart/', views.cart_detail, name='cart_detail'),
    path('cart/add/<int:product_id>/', views.cart_add, name='cart_add'),
    path('cart/remove/<int:item_id>/', views.cart_remove, name='cart_remove'),
    path('cart/update/<int:item_id>/', views.cart_update, name='cart_update'),

    # Buyer Order URLs
    path('checkout/', views.checkout, name='checkout'),
    path('orders/', views.buyer_order_list, name='buyer_order_list'),
    path('orders/<int:pk>/', views.order_detail, name='order_detail'),
    path('orders/<int:pk>/cancel/', views.order_cancel, name='order_cancel'),

    # Seller Order URLs
    path('seller/orders/', views.seller_order_list, name='seller_order_list'),
    path('seller/orders/<int:pk>/', views.seller_order_detail, name='seller_order_detail'),
]