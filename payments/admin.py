from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['paystack_reference', 'order', 'amount', 'status', 'paid_at']
    list_filter = ['status']
    search_fields = ['paystack_reference', 'order__id']
    ordering = ['-created_at']
    readonly_fields = ['paystack_reference', 'amount', 'paid_at', 'created_at']