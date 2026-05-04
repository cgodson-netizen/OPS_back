set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

echo "from accounts.models import CustomUser; u = CustomUser.objects.filter(email='godsonclement3456@gmail.com').first(); u and u.set_password('2vxiohq8') or None; u and u.save()" | python manage.py shell