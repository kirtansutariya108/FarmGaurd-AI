from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class FarmGuardException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message, "details": details or {}}
        )


class EntityNotFoundException(FarmGuardException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOT_FOUND",
            message=f"{entity_name} with id '{entity_id}' was not found."
        )


class UnauthorizedException(FarmGuardException):
    def __init__(self, message: str = "Invalid credentials or unauthorized access."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message=message
        )


class ForbiddenException(FarmGuardException):
    def __init__(self, message: str = "You do not have permission to access this resource."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message=message
        )


class InvalidImageException(FarmGuardException):
    def __init__(self, message: str = "The uploaded file is not a valid or readable image."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="INVALID_IMAGE",
            message=message
        )


class ServiceUnavailableException(FarmGuardException):
    def __init__(self, service_name: str, message: str = "Service is temporarily unavailable."):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="SERVICE_UNAVAILABLE",
            message=f"{service_name}: {message}"
        )


class ValidationException(FarmGuardException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_ERROR",
            message=message,
            details=details
        )
