from django.core.management.base import BaseCommand
from accounts.models import CustomUser

class Command(BaseCommand):
    def handle(self, *args, **options):
        if not CustomUser.objects.filter(email='admin@ops.com').exists():
            CustomUser.objects.create_superuser(
                email='admin@ops.com',
                password='OpsAdmin2026!',
                first_name='Admin',
                last_name='OPS',
            )
            self.stdout.write('Superuser created')
        else:
            self.stdout.write('Superuser already exists')