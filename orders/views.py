from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from accounts.decorators import buyer_required, seller_required
from products.models import Product
from .models import Cart, CartItem, Order, OrderItem
from .forms import CheckoutForm, OrderStatusForm


# ─── Cart Views ───────────────────────────────────────────────

@buyer_required
def cart_detail(request):
    cart, created = Cart.objects.get_or_create(buyer=request.user)
    return render(request, 'orders/cart.html', {'cart': cart})


@buyer_required
def cart_add(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)

    if product.stock <= 0:
        messages.error(request, 'This product is out of stock.')
        return redirect('products:product_detail', slug=product.slug)

    cart, created = Cart.objects.get_or_create(buyer=request.user)
    cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not item_created:
        if cart_item.quantity < product.stock:
            cart_item.quantity += 1
            cart_item.save()
        else:
            messages.error(request, 'Not enough stock available.')
    
    return redirect('orders:cart_detail')


@buyer_required
def cart_remove(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, cart__buyer=request.user)
    cart_item.delete()
    return redirect('orders:cart_detail')


@buyer_required
def cart_update(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, cart__buyer=request.user)
    quantity = int(request.POST.get('quantity', 1))

    if quantity < 1:
        cart_item.delete()
    elif quantity <= cart_item.product.stock:
        cart_item.quantity = quantity
        cart_item.save()
    else:
        messages.error(request, 'Not enough stock available.')

    return redirect('orders:cart_detail')


# ─── Order Views (Buyer) ──────────────────────────────────────

@buyer_required
def checkout(request):
    cart = get_object_or_404(Cart, buyer=request.user)

    if not cart.items.exists():
        messages.error(request, 'Your cart is empty.')
        return redirect('orders:cart_detail')

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            # Create the order
            order = Order.objects.create(
                buyer=request.user,
                delivery_address=form.cleaned_data['delivery_address'],
                status='pending'
            )

            # Move cart items to order items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price
                )
                # Deduct stock
                cart_item.product.stock -= cart_item.quantity
                cart_item.product.save()

            # Calculate and save total
            order.calculate_total()

            # Clear the cart
            cart.items.all().delete()

            return redirect('orders:order_detail', pk=order.pk)
    else:
        form = CheckoutForm()

    return render(request, 'orders/checkout.html', {
        'form': form,
        'cart': cart
    })


@buyer_required
def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk, buyer=request.user)
    return render(request, 'orders/order_detail.html', {'order': order})


@buyer_required
def buyer_order_list(request):
    orders = Order.objects.filter(buyer=request.user).order_by('-created_at')
    return render(request, 'orders/buyer_order_list.html', {'orders': orders})


@buyer_required
def order_cancel(request, pk):
    order = get_object_or_404(Order, pk=pk, buyer=request.user)

    if order.status != 'pending':
        messages.error(request, 'Only pending orders can be cancelled.')
        return redirect('orders:order_detail', pk=order.pk)

    if request.method == 'POST':
        # Restore stock
        for item in order.items.all():
            item.product.stock += item.quantity
            item.product.save()

        order.status = 'cancelled'
        order.save()
        return redirect('orders:buyer_order_list')

    return render(request, 'orders/order_confirm_cancel.html', {'order': order})


# ─── Order Views (Seller) ─────────────────────────────────────

@seller_required
def seller_order_list(request):
    # Get all orders that contain this seller's products
    orders = Order.objects.filter(
        items__product__seller=request.user
    ).distinct().order_by('-created_at')

    return render(request, 'orders/seller_order_list.html', {'orders': orders})


@seller_required
def seller_order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk)
    # Only show items belonging to this seller
    seller_items = order.items.filter(product__seller=request.user)

    if request.method == 'POST':
        form = OrderStatusForm(request.POST, instance=order)
        if form.is_valid():
            form.save()
            return redirect('orders:seller_order_list')
    else:
        form = OrderStatusForm(instance=order)

    return render(request, 'orders/seller_order_detail.html', {
        'order': order,
        'seller_items': seller_items,
        'form': form
    })