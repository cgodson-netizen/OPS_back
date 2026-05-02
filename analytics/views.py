# Create your views here.
from django.shortcuts import render
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDay, TruncMonth
from django.utils import timezone
from datetime import timedelta
from accounts.decorators import seller_required
from orders.models import Order, OrderItem
from products.models import Product


@seller_required
def seller_analytics(request):
    seller = request.user

    # ── Total Revenue ──────────────────────────────────────────
    total_revenue = OrderItem.objects.filter(
        product__seller=seller,
        order__status__in=['confirmed', 'shipped', 'delivered']
    ).aggregate(
        revenue=Sum(F('unit_price') * F('quantity'))
    )['revenue'] or 0

    # ── Total Orders ───────────────────────────────────────────
    total_orders = Order.objects.filter(
        items__product__seller=seller
    ).distinct().count()

    # ── Total Products ─────────────────────────────────────────
    total_products = Product.objects.filter(seller=seller).count()
    active_products = Product.objects.filter(seller=seller, is_active=True).count()

    # ── Best Selling Products (top 5) ──────────────────────────
    best_sellers = OrderItem.objects.filter(
        product__seller=seller
    ).values(
        'product__name'
    ).annotate(
        total_sold=Sum('quantity'),
        total_revenue=Sum(F('unit_price') * F('quantity'))
    ).order_by('-total_sold')[:5]

    # ── Orders by Status ───────────────────────────────────────
    orders_by_status = Order.objects.filter(
        items__product__seller=seller
    ).distinct().values('status').annotate(
        count=Count('id')
    ).order_by('status')

    # ── Sales Last 7 Days ──────────────────────────────────────
    seven_days_ago = timezone.now() - timedelta(days=7)
    daily_sales = OrderItem.objects.filter(
        product__seller=seller,
        order__created_at__gte=seven_days_ago,
        order__status__in=['confirmed', 'shipped', 'delivered']
    ).annotate(
        day=TruncDay('order__created_at')
    ).values('day').annotate(
        revenue=Sum(F('unit_price') * F('quantity')),
        orders=Count('order', distinct=True)
    ).order_by('day')

    # ── Sales Last 6 Months ────────────────────────────────────
    six_months_ago = timezone.now() - timedelta(days=180)
    monthly_sales = OrderItem.objects.filter(
        product__seller=seller,
        order__created_at__gte=six_months_ago,
        order__status__in=['confirmed', 'shipped', 'delivered']
    ).annotate(
        month=TruncMonth('order__created_at')
    ).values('month').annotate(
        revenue=Sum(F('unit_price') * F('quantity')),
        orders=Count('order', distinct=True)
    ).order_by('month')

    # ── Low Stock Products ─────────────────────────────────────
    low_stock = Product.objects.filter(
        seller=seller,
        stock__lte=5,
        is_active=True
    ).order_by('stock')

    context = {
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'total_products': total_products,
        'active_products': active_products,
        'best_sellers': best_sellers,
        'orders_by_status': orders_by_status,
        'daily_sales': daily_sales,
        'monthly_sales': monthly_sales,
        'low_stock': low_stock,
    }

    return render(request, 'analytics/seller_analytics.html', context)