from django.db import migrations
from django.utils.text import slugify


CATEGORIES = [
    "Electronics",
    "Cosmetics",
    "Fashion & Clothing",
    "Footwear",
    "Accessories",
    "Bags & Luggage",
    "Beauty & Skincare",
    "Hair & Extensions",
    "Health & Wellness",
    "Phones & Tablets",
    "Computers & Laptops",
    "Appliances",
    "Home & Living",
    "Furniture",
    "Kitchen & Dining",
    "Baby & Kids",
    "Toys & Games",
    "Sports & Fitness",
    "Automotive",
    "Books & Stationery",
    "Art & Crafts",
    "Food & Groceries",
    "Drinks & Beverages",
    "Jewelry",
    "Watches",
    "Musical Instruments",
    "Office Supplies",
    "Pet Supplies",
    "Garden & Outdoor",
    "Perfumes & Fragrances",
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model('products', 'Category')
    for name in CATEGORIES:
        Category.objects.get_or_create(
            name=name,
            defaults={'slug': slugify(name)}
        )


def unseed_categories(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed_categories),
    ]