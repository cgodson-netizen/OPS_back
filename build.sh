set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

echo "from accounts.models import CustomUser; CustomUser.objects.filter(email='godsonclement@3456').exists() or CustomUser.objects.create_superuser('godsonclement@3456', '2vxiohq8', first_name='Admin', last_name='OPS')" | python manage.py shell