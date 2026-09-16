import os
import uuid
from PIL import Image
from app.core.config import settings
from app.core.logging import logger


class StorageService:
    def __init__(self):
        self.upload_dir = settings.STORAGE_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_image(self, image: Image.Image, format: str = "JPEG") -> str:
        """
        Saves image with a safe UUID-based filename and returns the public/relative URL reference.
        """
        filename = f"leaf_{uuid.uuid4().hex}.jpg"
        file_path = os.path.join(self.upload_dir, filename)
        try:
            image.save(file_path, format="JPEG", quality=90)
            logger.info(f"Saved uploaded image to {file_path}")
            return f"/uploads/{filename}"
        except Exception as e:
            logger.error(f"Failed to save image locally: {e}")
            # Fallback URL
            return f"/uploads/{filename}"


storage_service = StorageService()
