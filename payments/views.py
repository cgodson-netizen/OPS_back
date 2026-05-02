# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.utils import timezone
from django.contrib import messages
from accounts.decorators import buyer_required
from orders.models import Order
from .models import Transaction
from .paystack import Paystack
import uuid


def generate_reference():
    return f'OPS-{uuid.uuid4().hex[:12].upper()}'


@buyer_required
def initiate_payment(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)

    # Block if already paid
    if hasattr(order, 'transaction') and order.transaction.status == 'success':
        messages.info(request, 'This order has already been paid for.')
        return redirect('orders:order_detail', pk=order.pk)

    # Generate unique reference
    reference = generate_reference()

    # Create or update transaction record
    transaction, created = Transaction.objects.get_or_create(
        order=order,
        defaults={
            'paystack_reference': reference,
            'amount': order.total_amount,
            'status': 'pending'
        }
    )

    if not created:
        # Update reference if retrying payment
        transaction.paystack_reference = reference
        transaction.status = 'pending'
        transaction.save()

    # Build callback URL
    callback_url = request.build_absolute_uri(f'/payments/verify/{reference}/')

    # Initialize payment with Paystack
    paystack = Paystack()
    response = paystack.initialize_payment(
        email=request.user.email,
        amount=order.total_amount,
        reference=reference,
        callback_url=callback_url
    )

    if response.get('status'):
        # Redirect buyer to Paystack payment page
        authorization_url = response['data']['authorization_url']
        return redirect(authorization_url)
    else:
        messages.error(request, 'Payment initialization failed. Please try again.')
        return redirect('orders:order_detail', pk=order.pk)


def verify_payment(request, reference):
    transaction = get_object_or_404(Transaction, paystack_reference=reference)

    paystack = Paystack()
    response = paystack.verify_payment(reference)

    if response.get('status') and response['data']['status'] == 'success':
        # Update transaction
        transaction.status = 'success'
        transaction.paid_at = timezone.now()
        transaction.save()

        # Update order status
        order = transaction.order
        order.status = 'confirmed'
        order.save()

        messages.success(request, 'Payment successful! Your order has been confirmed.')
        return redirect('payments:payment_success', order_id=order.id)
    else:
        transaction.status = 'failed'
        transaction.save()
        messages.error(request, 'Payment verification failed. Please try again.')
        return redirect('payments:payment_failed', order_id=transaction.order.id)


@buyer_required
def payment_success(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    return render(request, 'payments/payment_success.html', {'order': order})


@buyer_required
def payment_failed(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    return render(request, 'payments/payment_failed.html', {'order': order})