import requests
from django.conf import settings


class Paystack:
    BASE_URL = 'https://api.paystack.co'

    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY

    def initialize_payment(self, email, amount, reference, callback_url):
        """
        Initialize a payment with Paystack.
        Amount must be in kobo/pesewas (multiply cedis by 100).
        """
        url = f'{self.BASE_URL}/transaction/initialize'
        headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }
        data = {
            'email': email,
            'amount': int(amount * 100),  # convert to pesewas
            'reference': reference,
            'callback_url': callback_url,
            'currency': 'GHS'
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()

    def verify_payment(self, reference):
        """
        Verify a payment using its reference.
        """
        url = f'{self.BASE_URL}/transaction/verify/{reference}'
        headers = {
            'Authorization': f'Bearer {self.secret_key}',
        }
        response = requests.get(url, headers=headers)
        return response.json()