# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from accounts.decorators import seller_required, buyer_required
from .models import Product, Category
from .forms import ProductForm
from django.utils.text import slugify
import uuid


# ─── Seller Views ────────────────────────────────────────────

@seller_required
def seller_product_list(request):
    products = Product.objects.filter(seller=request.user).order_by('-created_at')
    return render(request, 'products/seller_product_list.html', {'products': products})


@seller_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.seller = request.user
            # generate a unique slug from product name
            base_slug = slugify(product.name)
            product.slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            product.save()
            return redirect('products:seller_product_list')
    else:
        form = ProductForm()
    return render(request, 'products/product_form.html', {'form': form, 'action': 'Create'})


@seller_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('products:seller_product_list')
    else:
        form = ProductForm(instance=product)
    return render(request, 'products/product_form.html', {'form': form, 'action': 'Edit'})


@seller_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    if request.method == 'POST':
        product.delete()
        return redirect('products:seller_product_list')
    return render(request, 'products/product_confirm_delete.html', {'product': product})


@seller_required
def product_toggle_active(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    product.is_active = not product.is_active
    product.save()
    return redirect('products:seller_product_list')


# ─── Buyer Views ─────────────────────────────────────────────

@buyer_required
def product_list(request):
    category_slug = request.GET.get('category')
    categories = Category.objects.all()
    products = Product.objects.filter(is_active=True, stock__gt=0)

    if category_slug:
        products = products.filter(category__slug=category_slug)

    return render(request, 'products/product_list.html', {
        'products': products,
        'categories': categories,
        'selected_category': category_slug
    })


@buyer_required
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    return render(request, 'products/product_detail.html', {'product': product})