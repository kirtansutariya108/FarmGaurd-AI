# FarmGuard AI — Smart India Hackathon (SIH) 5–7 Minute Demo Script

**Role:** Student Presenter / Team Lead  
**Audience:** SIH Evaluation Panel / Jury  
**Target Duration:** 5 to 7 minutes  

---

## Slide / Screen 1: The Core Problem (0:00 – 1:00)

> **Speaker:**  
> "Respected judges, crop diseases cause devastating losses of up to 35% of annual yields in India, directly hurting small and marginal farmers.
> 
> Currently, farmers either identify diseases too late or spray costly chemicals blindly. But here is the critical gap: **a disease diagnosis by itself is useless without environmental context.** 
> For example, if a farmer detects Early Blight when relative humidity is above 85% and rain is expected, fungal spores will spread exponentially within 48 hours—and spraying fungicide right before rainfall washes the medicine away, wasting money and polluting groundwater.
> 
> To solve this, we built **FarmGuard AI**—an intelligent, weather-aware crop disease diagnostic and farm intelligence platform tailored specifically for Indian farmers."

---

## Screen 2: Farm Dashboard & Real-Time Context (1:00 – 2:00)

*(Action: Log into the application and display `/app/dashboard`)*

> **Speaker:**  
> "Let’s look at the farmer’s dashboard. 
> Right upon logging in, the farmer gets an immediate overview of their farm located in Gujarat. 
> 
> Notice that we **do not fabricate sensor data**. The dashboard fetches live, high-resolution micro-meteorological data directly from Open-Meteo—giving current temperature, relative humidity, wind speed, and precipitation likelihood. 
> The dashboard also provides immediate one-click quick actions to scan crops, check upcoming weather, calculate irrigation, or review historical field logs."

---

## Screen 3: Live Disease Scanning & Farm Intelligence (2:00 – 4:00)

*(Action: Navigate to `/app/scanner`, drag-and-drop a sample tomato leaf with Late Blight)*

> **Speaker:**  
> "Now let's perform a live diagnostic scan. The farmer simply takes or uploads a photo of an affected leaf.
> 
> Let's upload this tomato leaf sample and click **'Analyze Crop'**.
> 
> *(Pause 1 second as inference completes)*
> 
> Look at how fast and clear the result is:
> 1. **Model Classification:** In less than 200 milliseconds, our MobileNetV2 deep learning classifier identifies **Tomato Late Blight** with high AI confidence.
> 2. **Safety & Guardrails:** Our model covers **16 specific classes** across Tomato and Rice. If the image is unclear or below 60% confidence, the system refuses to guess and guides the farmer to retake the photo.
> 3. **Farm Intelligence Engine:** This is where FarmGuard AI creates massive value. The backend fuses the pathogen profile of *Phytophthora infestans* with the live local weather. 
> 
> Look at the 4 distinct action cards:
> - **Immediate Action:** Isolate infected foliage to stop spore propagation.
> - **Monitoring Action:** Inspect lower canopy leaves every 48 hours.
> - **Prevention Action:** Increase row spacing and avoid overhead sprinkler watering.
> - **Weather-Aware Advice:** Because current humidity is high, it gives specific timing guidance so the farmer doesn't spray chemical treatments right before rainfall."

---

## Screen 4: Healthy Foliage & Safe Handling (4:00 – 4:45)

*(Action: Upload a healthy leaf photo)*

> **Speaker:**  
> "Now let's test a healthy crop. 
> 
> When healthy foliage is scanned, our system displays **'Healthy Foliage Detected'**. 
> Crucially, it does **not** prescribe chemical sprays or create false alarms. Instead, it provides routine nutrient care and proactive monitoring tips so the crop stays disease-free."

---

## Screen 5: Smart Irrigation Advisor (4:45 – 5:30)

*(Action: Navigate to `/app/irrigation`)*

> **Speaker:**  
> "Next, let’s look at our **Irrigation Advisor**. 
> Over-irrigation not only wastes precious water but also creates waterlogged soil where root pathogens thrive.
> 
> By taking key inputs—crop type, days since last watering, soil moisture state, and combining it with the live rainfall forecast—our advisor tells the farmer whether to irrigate now, monitor, or delay watering to capture upcoming natural precipitation."

---

## Screen 6: Device History & Audit Log (5:30 – 6:15)

*(Action: Navigate to `/app/history`)*

> **Speaker:**  
> "Every scan performed is automatically logged in the farmer's **Scan History**. 
> A farmer or agricultural extension officer can click any previous scan to review the historical diagnosis, confidence score, and recommended treatment plan over time."

---

## Screen 7: Tech Stack, Scalability & Conclusion (6:15 – 7:00)

> **Speaker:**  
> "To summarize our technical architecture:
> - **Backend:** High-performance Python FastAPI with cached singleton TensorFlow model inference.
> - **Frontend:** Modern, responsive React 18, TypeScript, and Tailwind CSS designed with high-contrast, farmer-friendly terminology.
> - **Edge AI Model:** Lightweight MobileNetV2 architecture running in ~174ms, making it ready for edge deployment on low-cost devices.
> - **Zero Fabricated Data:** Every weather metric and inference confidence is 100% genuine and verified through automated test suites.
> 
> Thank you, judges. We are now open for questions!"
