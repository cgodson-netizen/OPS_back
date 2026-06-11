
import cloudinary
import cloudinary.uploader
from django.core.files.storage import Storage
import os


class CloudinaryMediaStorage(Storage):
    def __init__(self):
        cloudinary.config(
            cloud_name='dtvjhpt8s',
            api_key='117682186664425',
            api_secret='EbznnIOWBQVoCvN-W98Ic8PBvDM',
            secure=True
        )

    def _save(self, name, content):
        try:
            public_id = os.path.splitext(name)[0]
            response = cloudinary.uploader.upload(
                content,
                public_id=public_id,
                overwrite=True,
                resource_type='auto',
                timeout=25,
            )
            return response['secure_url']
        except Exception:
            return name

    def url(self, name):
        if name and name.startswith('http'):
            return name
        return cloudinary.CloudinaryImage(name).build_url()

    def exists(self, name):
        return False

    def delete(self, name):
        try:
            public_id = os.path.splitext(name)[0]
            cloudinary.uploader.destroy(public_id)
        except Exception:
            pass

      