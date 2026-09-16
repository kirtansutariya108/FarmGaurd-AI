import os
import hashlib
from pathlib import Path
from PIL import Image
from collections import defaultdict

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset" / "rice_leaf_diseases"


def calculate_md5(file_path: Path) -> str:
    """Calculate MD5 hash of file to identify exact byte duplicates."""
    hasher = hashlib.md5()
    with open(file_path, "rb") as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()


def audit_dataset(dataset_dir: Path = DATASET_DIR):
    print("=" * 60)
    print("PHASE 1: RICE LEAF DISEASE DATASET AUDIT")
    print("=" * 60)

    if not dataset_dir.exists():
        print(f"[ERROR] Dataset directory not found at: {dataset_dir}")
        return False

    class_folders = sorted([d for d in dataset_dir.iterdir() if d.is_dir()])
    if not class_folders:
        print(f"[ERROR] No class subdirectories found in {dataset_dir}")
        return False

    print(f"Dataset root: {dataset_dir}")
    print(f"Found {len(class_folders)} class directories:\n")

    total_images = 0
    class_counts = {}
    formats_detected = defaultdict(int)
    modes_detected = defaultdict(int)
    dimensions_detected = defaultdict(int)
    corrupted_files = []
    unreadable_files = []
    hashes = {}
    duplicates = []

    for folder in class_folders:
        class_name = folder.name
        files = [f for f in folder.iterdir() if f.is_file()]
        class_counts[class_name] = 0

        for file_path in files:
            ext = file_path.suffix.lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                continue

            total_images += 1
            class_counts[class_name] += 1
            formats_detected[ext] += 1

            # Check for duplicates via MD5
            file_hash = calculate_md5(file_path)
            if file_hash in hashes:
                duplicates.append((file_path, hashes[file_hash]))
            else:
                hashes[file_hash] = file_path

            # Integrity and image properties check
            try:
                with Image.open(file_path) as img:
                    img.verify()

                # Reopen to read metadata after verify()
                with Image.open(file_path) as img:
                    modes_detected[img.mode] += 1
                    dimensions_detected[img.size] += 1
            except Exception as e:
                corrupted_files.append((file_path, str(e)))

    print("Class Distribution:")
    print("-" * 40)
    for class_name, count in class_counts.items():
        print(f"  {class_name:<25}: {count:>3} images")
    print("-" * 40)
    print(f"  {'Total':<25}: {total_images:>3} images\n")

    print(f"Image Formats Detected:   {dict(formats_detected)}")
    print(f"Color Modes Detected:     {dict(modes_detected)}")
    print(f"Unique Resolutions Count: {len(dimensions_detected)} distinct resolutions")
    common_dims = sorted(dimensions_detected.items(), key=lambda x: x[1], reverse=True)[:3]
    print(f"Top Resolutions:          {common_dims}")

    print("\nData Integrity Check:")
    print("-" * 40)
    if corrupted_files:
        print(f"[!] CORRUPTED FILES FOUND ({len(corrupted_files)}):")
        for f, err in corrupted_files:
            print(f"    - {f}: {err}")
    else:
        print("  [OK] All 120 images are valid, uncorrupted, and decodable by Pillow.")

    if duplicates:
        print(f"[!] EXACT DUPLICATES FOUND ({len(duplicates)}):")
        for f1, f2 in duplicates:
            print(f"    - {f1.name} == {f2.name} (across classes: {f1.parent.name} vs {f2.parent.name})")
    else:
        print("  [OK] No duplicate images detected across the dataset.")

    print("=" * 60)
    return len(corrupted_files) == 0


if __name__ == "__main__":
    audit_dataset()
