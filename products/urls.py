from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Seller URLs
    path('seller/products/', views.seller_product_list, name='seller_product_list'),
    path('seller/products/create/', views.product_create, name='product_create'),
    path('seller/products/<int:pk>/edit/', views.product_edit, name='product_edit'),
    path('seller/products/<int:pk>/delete/', views.product_delete, name='product_delete'),
    path('seller/products/<int:pk>/toggle/', views.product_toggle_active, name='product_toggle_active'),

    # Buyer URLs
    path('products/', views.product_list, name='product_list'),
    path('products/<slug:slug>/', views.product_detail, name='product_detail'),
]