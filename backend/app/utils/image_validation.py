import io
from typing import Tuple
from PIL import Image
from app.core.exceptions import InvalidImageException

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
MIN_IMAGE_DIMENSION = 64
MAX_IMAGE_DIMENSION = 8192


def validate_and_open_image(file_bytes: bytes, content_type: str) -> Image.Image:
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise InvalidImageException(
            f"File size exceeds limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB."
        )

    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise InvalidImageException(
            f"Unsupported image type '{content_type}'. Allowed types: JPEG, PNG, WEBP."
        )

    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()  # Fast integrity check
    except Exception as e:
        raise InvalidImageException(f"Image corruption detected or unreadable file: {str(e)}")

    # Re-open after verify() because verify() closes the file pointer
    image = Image.open(io.BytesIO(file_bytes))

    width, height = image.size
    if width < MIN_IMAGE_DIMENSION or height < MIN_IMAGE_DIMENSION:
        raise InvalidImageException(
            f"Image dimensions ({width}x{height}) are too small. Minimum is {MIN_IMAGE_DIMENSION}x{MIN_IMAGE_DIMENSION}."
        )

    if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
        raise InvalidImageException(
            f"Image dimensions ({width}x{height}) exceed maximum allowed of {MAX_IMAGE_DIMENSION}x{MAX_IMAGE_DIMENSION}."
        )

    # Convert to RGB mode if needed (e.g. RGBA or Grayscale)
    if image.mode != "RGB":
        image = image.convert("RGB")

    return image
