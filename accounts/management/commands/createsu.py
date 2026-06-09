from django.core.management.base import BaseCommand
from accounts.models import CustomUser

class Command(BaseCommand):
    def handle(self, *args, **options):
        if not CustomUser.objects.filter(is_superuser=True).exists():
            CustomUser.objects.create_superuser(
                email='godsonclement3456@gmail.com',
                password='2vxiohq8',
                first_name='Admin',
                last_name='OPS',
            )
            self.stdout.write('Superuser created')
        else:
            self.stdout.write('Superuser already exists - skipping')