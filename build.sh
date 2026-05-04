set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

python manage.py shell << 'EOF'
from accounts.models import CustomUser
email = 'godsonclement3456@gmail.com'
password = '2vxiohq8'
if CustomUser.objects.filter(email=email).exists():
    u = CustomUser.objects.get(email=email)
    u.set_password(password)
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print(f"Password updated for {email}")
else:
    CustomUser.objects.create_superuser(email=email, password=password, first_name='Godson', last_name='Clement')
    print(f"Superuser created for {email}")
EOF