from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.farm import Farm, FarmCrop, CropCondition
from app.repositories.user_repository import UserRepository
from app.repositories.farm_repository import FarmRepository
from app.schemas.auth import LoginRequest, SignUpRequest, TokenResponse, UserProfileResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import UnauthorizedException, FarmGuardException


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.farm_repo = FarmRepository(db)

    def login(self, data: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_identifier(data.identifier)
        if not user:
            raise UnauthorizedException("Invalid email/phone or password.")

        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid email/phone or password.")

        access_token = create_access_token(subject=user.id)
        user_profile = UserProfileResponse.model_validate(user)
        user_profile.createdAt = user.created_at.strftime("%Y-%m-%d")

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_profile
        )

    def register(self, data: SignUpRequest) -> TokenResponse:
        existing_email = self.user_repo.get_by_email(data.email)
        if existing_email:
            raise FarmGuardException(
                status_code=400,
                code="EMAIL_EXISTS",
                message="An account with this email address already exists."
            )

        new_user = User(
            full_name=data.fullName,
            email=data.email.lower().strip(),
            phone=data.phone.strip(),
            password_hash=get_password_hash(data.password),
            location=data.location,
            preferred_language="en",
            theme="light",
            units="metric",
            notifications_enabled=True
        )
        created_user = self.user_repo.create(new_user)

        # Create initial farm parcel if provided or default
        farm_name = data.farmName or f"{data.fullName.split()[0]}'s Farm"
        initial_farm = Farm(
            user_id=created_user.id,
            name=farm_name,
            location=data.location,
            area_acres=2.5,
            area_unit="Acres",
            soil_type="Loamy"
        )
        self.farm_repo.create(initial_farm)

        crop = FarmCrop(
            farm_id=initial_farm.id,
            crop_name="Tomato",
            crop_variety="Standard Hybrid",
            growth_stage="Flowering"
        )
        self.db.add(crop)

        condition = CropCondition(
            farm_id=initial_farm.id,
            soil_moisture=35.0,
            last_irrigation_days_ago=2
        )
        self.farm_repo.save_condition(condition)

        access_token = create_access_token(subject=created_user.id)
        user_profile = UserProfileResponse.model_validate(created_user)
        user_profile.createdAt = created_user.created_at.strftime("%Y-%m-%d")

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_profile
        )
