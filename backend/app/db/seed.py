import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.models import (
    Base,
    User,
    Farm,
    FarmCrop,
    CropCondition,
    CropScan,
    DiseasePrediction,
    IrrigationRecommendation,
    WeatherSnapshot,
    Recommendation,
    Notification
)
from app.core.security import get_password_hash
from app.core.logging import logger


def seed_database(db: Session) -> None:
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Check if demo user already exists
    existing_user = db.query(User).filter(User.email == "kirtan.farmer@farmguard.ai").first()
    if existing_user:
        logger.info("Demo data already seeded. Skipping...")
        return

    logger.info("Seeding demo agricultural database...")

    # 1. Demo User
    demo_user = User(
        id="user-001",
        full_name="Kirtan Sutariya",
        email="kirtan.farmer@farmguard.ai",
        phone="+91 98765 43210",
        password_hash=get_password_hash("FarmGuard@2026"),
        location="Vadodara, Gujarat",
        preferred_language="en",
        theme="light",
        units="metric",
        notifications_enabled=True,
        created_at=datetime.now(timezone.utc) - timedelta(days=60)
    )
    db.add(demo_user)
    db.flush()

    # 2. Demo Farms
    farms_data = [
        {
            "id": "farm-1",
            "name": "Green Valley Farm",
            "location": "Vadodara, Gujarat",
            "latitude": 22.3072,
            "longitude": 73.1812,
            "area_acres": 2.5,
            "soil_type": "Loamy",
            "crop": "Tomato",
            "crop_variety": "Abhinav F1",
            "growth_stage": "Flowering",
            "soil_moisture": 32.0,
            "last_irrigation_days_ago": 2,
        },
        {
            "id": "farm-2",
            "name": "Surya Agro Plot B",
            "location": "Anand, Gujarat",
            "latitude": 22.5645,
            "longitude": 72.9289,
            "area_acres": 4.0,
            "soil_type": "Clay",
            "crop": "Potato",
            "crop_variety": "Kufri Pukhraj",
            "growth_stage": "Vegetative",
            "soil_moisture": 48.0,
            "last_irrigation_days_ago": 1,
        },
        {
            "id": "farm-3",
            "name": "Narmada Riverside Parcel",
            "location": "Bharuch, Gujarat",
            "latitude": 21.7051,
            "longitude": 72.9959,
            "area_acres": 1.8,
            "soil_type": "Sandy",
            "crop": "Pepper",
            "crop_variety": "Indam 5",
            "growth_stage": "Fruiting",
            "soil_moisture": 25.0,
            "last_irrigation_days_ago": 4,
        }
    ]

    for f_data in farms_data:
        farm = Farm(
            id=f_data["id"],
            user_id=demo_user.id,
            name=f_data["name"],
            location=f_data["location"],
            latitude=f_data["latitude"],
            longitude=f_data["longitude"],
            area_acres=f_data["area_acres"],
            area_unit="Acres",
            soil_type=f_data["soil_type"],
            created_at=datetime.now(timezone.utc) - timedelta(days=30)
        )
        db.add(farm)
        db.flush()

        crop = FarmCrop(
            farm_id=farm.id,
            crop_name=f_data["crop"],
            crop_variety=f_data["crop_variety"],
            growth_stage=f_data["growth_stage"],
            planting_date=datetime.now(timezone.utc) - timedelta(days=45)
        )
        db.add(crop)

        condition = CropCondition(
            farm_id=farm.id,
            soil_moisture=f_data["soil_moisture"],
            temperature=28.0,
            humidity=72.0,
            rain_probability=30.0,
            wind_speed=14.0,
            last_irrigation_days_ago=f_data["last_irrigation_days_ago"],
            last_irrigation_at=datetime.now(timezone.utc) - timedelta(days=f_data["last_irrigation_days_ago"])
        )
        db.add(condition)

    # 3. Weather Snapshot
    forecast_days = [
        {"date": "2026-09-15", "dayName": "Today", "tempMax": 31, "tempMin": 22, "condition": "Partly Cloudy", "rainProbability": 30, "humidity": 72, "icon": "cloud-sun"},
        {"date": "2026-09-16", "dayName": "Wed", "tempMax": 29, "tempMin": 21, "condition": "Scattered Showers", "rainProbability": 55, "humidity": 80, "icon": "cloud-rain"},
        {"date": "2026-09-17", "dayName": "Thu", "tempMax": 32, "tempMin": 23, "condition": "Sunny Intervals", "rainProbability": 20, "humidity": 65, "icon": "sun"},
        {"date": "2026-09-18", "dayName": "Fri", "tempMax": 33, "tempMin": 24, "condition": "Clear Sky", "rainProbability": 10, "humidity": 60, "icon": "sun"},
        {"date": "2026-09-19", "dayName": "Sat", "tempMax": 30, "tempMin": 22, "condition": "Overcast", "rainProbability": 40, "humidity": 75, "icon": "cloud"}
    ]

    weather = WeatherSnapshot(
        farm_id="farm-1",
        location="Vadodara, Gujarat",
        current_temp=28.0,
        condition="Partly Cloudy",
        humidity=72.0,
        rain_probability=30.0,
        wind_speed_kmh=14.0,
        uv_index=6.0,
        soil_temp=24.0,
        forecast_json=json.dumps(forecast_days),
        farm_insight="Rain is possible tomorrow (30%); inspect field conditions before scheduling the next irrigation cycle."
    )
    db.add(weather)

    # 4. Scans & Disease Predictions
    scan_1 = CropScan(
        id="scan-101",
        user_id=demo_user.id,
        farm_id="farm-1",
        crop="Tomato",
        primary_condition="Early Blight",
        confidence=91.0,
        status="Needs Attention",
        is_low_confidence=False,
        is_healthy=False,
        visual_findings="Concentric ring lesions and brownish necrotic spots visible on lower leaf margin.",
        next_steps_json=json.dumps([
            "Prune infected lower foliage with disinfected shears.",
            "Avoid overhead irrigation to minimize leaf moisture retention.",
            "Apply copper-based protective fungicide if lesions spread."
        ]),
        image_url="https://images.unsplash.com/photo-1592417817098-8f3d69103c80?auto=format&fit=crop&w=800&q=80",
        model_version="mobilenetv2-v1.0.0",
        health_score_contribution=-8,
        created_at=datetime.now(timezone.utc) - timedelta(hours=2)
    )
    db.add(scan_1)
    db.flush()

    preds_1 = [
        DiseasePrediction(scan_id=scan_1.id, disease_name="Early Blight", confidence=91.0, rank=1, description="Alternaria solani fungal infection with concentric bullseye spots."),
        DiseasePrediction(scan_id=scan_1.id, disease_name="Late Blight", confidence=6.0, rank=2, description="Phytophthora infestans water-mold causing rapid foliar collapse."),
        DiseasePrediction(scan_id=scan_1.id, disease_name="Healthy", confidence=3.0, rank=3, description="Normal chlorophyll distribution and leaf architecture.")
    ]
    for p in preds_1:
        db.add(p)

    scan_2 = CropScan(
        id="scan-102",
        user_id=demo_user.id,
        farm_id="farm-2",
        crop="Potato",
        primary_condition="Healthy Foliage",
        confidence=95.0,
        status="Healthy-looking",
        is_low_confidence=False,
        is_healthy=True,
        visual_findings="Clean leaf lamina with uniform green pigmentation. No necrotic halos or lesions.",
        next_steps_json=json.dumps([
            "Maintain current drip irrigation and balanced nitrogen-potassium fertigation.",
            "Conduct routine scout scans every 5-7 days."
        ]),
        image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
        model_version="mobilenetv2-v1.0.0",
        health_score_contribution=10,
        created_at=datetime.now(timezone.utc) - timedelta(days=1)
    )
    db.add(scan_2)
    db.flush()

    preds_2 = [
        DiseasePrediction(scan_id=scan_2.id, disease_name="Healthy", confidence=95.0, rank=1, description="Normal leaf pigmentation and vigor."),
        DiseasePrediction(scan_id=scan_2.id, disease_name="Early Blight", confidence=3.0, rank=2, description="Minor surface discoloration."),
        DiseasePrediction(scan_id=scan_2.id, disease_name="Septoria Leaf Spot", confidence=2.0, rank=3, description="Small dark circular spots.")
    ]
    for p in preds_2:
        db.add(p)

    # 5. Recommendations
    recs = [
        Recommendation(
            id="rec-1",
            user_id=demo_user.id,
            farm_id="farm-1",
            category="Disease",
            status="Urgent",
            priority="High",
            title="Inspect Tomato Lower Leaves",
            description="Early Blight symptoms detected with 91% confidence. Prune affected foliage and isolate infected plants.",
            action_text="View Scan Diagnostics",
            action_link="/app/history/scan-101",
            created_at=datetime.now(timezone.utc) - timedelta(hours=3)
        ),
        Recommendation(
            id="rec-2",
            user_id=demo_user.id,
            farm_id="farm-1",
            category="Irrigation",
            status="Today",
            priority="Medium",
            title="Schedule Morning Drip Cycle",
            description="Soil moisture is at 32% (below 35% optimal flowering threshold). 30% rain chance forecast tomorrow.",
            action_text="Open Irrigation Advisor",
            action_link="/app/irrigation",
            created_at=datetime.now(timezone.utc) - timedelta(hours=5)
        ),
        Recommendation(
            id="rec-3",
            user_id=demo_user.id,
            farm_id="farm-2",
            category="Field Care",
            status="Monitor",
            priority="Low",
            title="Routine Scouting for Potato Plot",
            description="Parcel health is high (94/100). Maintain regular scouting before high-humidity evening cycles.",
            action_text="View Farm Status",
            action_link="/app/farms/farm-2",
            created_at=datetime.now(timezone.utc) - timedelta(days=1)
        )
    ]
    for r in recs:
        db.add(r)

    # 6. Notifications
    notifs = [
        Notification(
            id="notif-1",
            user_id=demo_user.id,
            title="Early Blight Alert on Green Valley Farm",
            message="Leaf analysis for Tomato parcel revealed Early Blight symptoms (91% confidence). Prompt action advised.",
            category="scanner",
            is_read=False,
            link_url="/app/history/scan-101",
            created_at=datetime.now(timezone.utc) - timedelta(hours=2)
        ),
        Notification(
            id="notif-2",
            user_id=demo_user.id,
            title="Moisture Approaching Threshold",
            message="Soil moisture on Plot 1 has decreased to 32%. Review irrigation recommendations before noon.",
            category="irrigation",
            is_read=False,
            link_url="/app/irrigation",
            created_at=datetime.now(timezone.utc) - timedelta(hours=4)
        ),
        Notification(
            id="notif-3",
            user_id=demo_user.id,
            title="Scattered Showers Forecasted",
            message="A 55% chance of light showers is expected in Anand district tomorrow afternoon.",
            category="weather",
            is_read=True,
            link_url="/app/weather",
            created_at=datetime.now(timezone.utc) - timedelta(days=1)
        )
    ]
    for n in notifs:
        db.add(n)

    db.commit()
    logger.info("Demo database seeded successfully!")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
