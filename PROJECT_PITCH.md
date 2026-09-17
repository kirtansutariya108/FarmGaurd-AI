# FarmGuard AI — 60-Second Project Pitch

---

### WHAT IS THE PROBLEM?
Smallholder farmers lose up to 35% of their crop yields to plant diseases every year. Traditional crop disease apps only identify a disease name in isolation, leaving farmers with generic advice and no environmental context. As a result, farmers either miss the window for treatment or spray expensive chemicals right before it rains, wasting money and harming the environment.

---

### WHAT IS FARMGUARD AI?
**FarmGuard AI** is an intelligent, weather-aware crop disease diagnostic and decision-support platform designed specifically for Indian agriculture. It combines edge deep-learning computer vision with live micro-meteorological data to give farmers clear, practical, and timely action plans.

---

### HOW DOES THE AI WORK?
Using an optimized **MobileNetV2 neural network** running in under 200ms, FarmGuard AI accurately classifies **16 distinct conditions** across Tomato and Rice crops (including Late Blight, Bacterial Spot, and Leaf Blast). It enforces strict confidence thresholds (>60%) and image validation to prevent false or misleading classifications.

---

### HOW DOES WEATHER HELP?
Pathogen outbreaks depend directly on microclimatic factors. FarmGuard AI pulls live temperature, relative humidity, and precipitation forecasts from Open-Meteo. If relative humidity is high (>80%), the system flags elevated fungal spread risk and warns the farmer before an outbreak multiplies across the field.

---

### HOW DOES THE SYSTEM HELP THE FARMER?
Instead of intimidating academic jargon, FarmGuard AI delivers four clear, color-coded action cards:
1. **Immediate Actions** (what to do today)
2. **Monitoring Steps** (what to inspect over the next 48 hours)
3. **Preventive Practices** (how to safeguard the next crop cycle)
4. **Weather Advice** (exact guidance on avoiding rain-wasted chemical spraying)

---

### WHAT MAKES THE SYSTEM PRACTICAL?
- **Lightweight & Fast**: Sub-200ms CPU inference ready for rural edge devices.
- **Smart Irrigation Integration**: Prevents overwatering by factoring in forecasted rainfall.
- **Zero Fake Data**: Live API weather feeds, honest confidence scoring, and strict safety guardrails.
- **Farmer-First Interface**: High-contrast, responsive UI with non-technical terminology and persistent local scan history.
