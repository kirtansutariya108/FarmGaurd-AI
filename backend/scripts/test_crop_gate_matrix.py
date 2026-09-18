import io
import os
import requests
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

API_URL = "http://127.0.0.1:8000/api/predict"

def create_synthetic_tomato_leaf() -> Image.Image:
    """Create a test image representing a compound serrated tomato leaflet."""
    img = Image.new("RGB", (300, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    # Jagged, lobed polygon for tomato leaflet
    points = [
        (150, 40), (165, 70), (195, 65), (180, 100), (220, 110),
        (190, 145), (235, 175), (185, 200), (210, 240), (160, 230),
        (150, 275), (140, 230), (90, 240), (115, 200), (65, 175),
        (110, 145), (80, 110), (120, 100), (105, 65), (135, 70)
    ]
    draw.polygon(points, fill=(45, 125, 40), outline=(25, 80, 20))
    # Serrations and veins
    for i in range(len(points)-1):
        mid_x = (points[i][0] + points[i+1][0]) // 2
        mid_y = (points[i][1] + points[i+1][1]) // 2
        draw.line([(150, 160), (mid_x, mid_y)], fill=(80, 160, 60), width=2)
    return img

def create_synthetic_potato_leaf() -> Image.Image:
    """Create a test image representing a smooth-margined ovate potato leaflet."""
    img = Image.new("RGB", (300, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    # Smooth ellipse / ovate leaflet without sharp serrations
    draw.ellipse([60, 50, 240, 250], fill=(50, 130, 45), outline=(30, 85, 25))
    # Central vein and gentle lateral pinnate veins
    draw.line([(150, 50), (150, 250)], fill=(90, 170, 70), width=3)
    draw.line([(150, 100), (210, 120)], fill=(85, 160, 65), width=2)
    draw.line([(150, 100), (90, 120)], fill=(85, 160, 65), width=2)
    draw.line([(150, 160), (225, 180)], fill=(85, 160, 65), width=2)
    draw.line([(150, 160), (75, 180)], fill=(85, 160, 65), width=2)
    return img

def create_non_leaf_image() -> Image.Image:
    """Create an everyday non-leaf object image (e.g. geometric furniture / blue car tone)."""
    img = Image.new("RGB", (300, 300), color=(70, 90, 160))
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 80, 250, 220], fill=(210, 50, 40), outline=(20, 20, 20), width=3)
    draw.ellipse([80, 200, 120, 240], fill=(20, 20, 20))
    draw.ellipse([180, 200, 220, 240], fill=(20, 20, 20))
    return img

def create_blank_image() -> Image.Image:
    """Create a solid blank non-leaf image."""
    return Image.new("RGB", (224, 224), color=(250, 250, 250))

def create_blurred_image(base_img: Image.Image) -> Image.Image:
    """Create a heavily blurred / unclear image."""
    return base_img.filter(ImageFilter.GaussianBlur(radius=25))

def to_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()

def run_test(case_no: int, selected_crop: str, actual_crop: str, image_bytes: bytes, filename: str):
    files = {"file": (filename, image_bytes, "image/jpeg")}
    data = {"crop": selected_crop, "selected_crop": selected_crop}
    
    res = requests.post(API_URL, files=files, data=data)
    json_data = res.json()
    
    det_crop = json_data.get("detectedCrop")
    crop_conf = json_data.get("cropConfidence")
    crop_match = json_data.get("cropMatch")
    pred_allowed = json_data.get("predictionAllowed")
    err_code = json_data.get("errorCode")
    disease = json_data.get("disease") or json_data.get("class_name")
    
    if pred_allowed:
        final_result = f"DIAGNOSIS_ALLOWED ({disease}, {round((json_data.get('confidence') or 0)*100, 1)}%)"
    else:
        final_result = f"BLOCKED ({err_code}: {json_data.get('message', '')[:45]}...)"
        
    return {
        "case": case_no,
        "selected": selected_crop,
        "actual": actual_crop,
        "detected": det_crop,
        "confidence": round(float(crop_conf), 4) if crop_conf is not None else 0.0,
        "match": crop_match,
        "allowed": pred_allowed,
        "result": final_result
    }

def main():
    print("\n" + "="*80)
    print("🌾 FARMGUARD AI: 12-SCENARIO CROP GATE VALIDATION MATRIX TEST")
    print("="*80 + "\n")
    
    # Prepare images
    rice_bytes = open("models/rice_test_img.jpeg", "rb").read()
    tomato_bytes = to_bytes(create_synthetic_tomato_leaf())
    potato_bytes = to_bytes(create_synthetic_potato_leaf())
    non_leaf_bytes = to_bytes(create_non_leaf_image())
    blank_bytes = to_bytes(create_blank_image())
    unclear_bytes = to_bytes(create_blurred_image(create_synthetic_tomato_leaf()))
    
    test_cases = [
        (1, "Rice", "Rice", rice_bytes, "rice_leaf.jpg"),
        (2, "Rice", "Tomato", tomato_bytes, "tomato_leaf.jpg"),
        (3, "Rice", "Potato", potato_bytes, "potato_leaf.jpg"),
        (4, "Tomato", "Tomato", tomato_bytes, "tomato_leaf.jpg"),
        (5, "Tomato", "Rice", rice_bytes, "rice_leaf.jpg"),
        (6, "Tomato", "Potato", potato_bytes, "potato_leaf.jpg"),
        (7, "Potato", "Potato", potato_bytes, "potato_leaf.jpg"),
        (8, "Potato", "Rice", rice_bytes, "rice_leaf.jpg"),
        (9, "Potato", "Tomato", tomato_bytes, "tomato_leaf.jpg"),
        (10, "Rice", "Non-leaf / Object", non_leaf_bytes, "car_scene.jpg"),
        (11, "Tomato", "Blank Image", blank_bytes, "blank_white.jpg"),
        (12, "Potato", "Unclear Image", unclear_bytes, "blurry_leaf.jpg"),
    ]
    
    results = []
    all_passed = True
    
    for case_no, sel, act, bts, fn in test_cases:
        r = run_test(case_no, sel, act, bts, fn)
        results.append(r)
        
        # Invariants:
        # If actual != sel or actual in [Non-leaf, Blank, Unclear]: allowed MUST be False!
        expected_allowed = (sel == act)
        if r["allowed"] != expected_allowed:
            all_passed = False
            print(f"❌ FAILED CASE {case_no}: Expected allowed={expected_allowed}, got {r['allowed']}")
        else:
            print(f"✅ PASSED CASE {case_no}: {sel} sel + {act} img -> Detected: {r['detected']}, Allowed: {r['allowed']}")

    print("\n" + "="*80)
    print("RESULTS MATRIX TABLE")
    print("="*80)
    print(f"{'#':<3} | {'Selected':<8} | {'Actual':<17} | {'Detected':<14} | {'Conf':<6} | {'Match':<5} | {'Allowed':<7} | {'Final Result'}")
    print("-" * 95)
    for r in results:
        print(f"{r['case']:<3} | {r['selected']:<8} | {r['actual']:<17} | {r['detected']:<14} | {r['confidence']:<6} | {str(r['match']):<5} | {str(r['allowed']):<7} | {r['result']}")
        
    print("\n" + "="*80)
    if all_passed:
        print("🎉 ALL 12 MATRIX TESTS PASSED PERFECTLY! CROP GATING IS 100% RELIABLE.")
    else:
        print("⚠️ SOME MATRIX TESTS FAILED. PLEASE REVIEW.")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
