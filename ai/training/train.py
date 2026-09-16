import os
import json
import random
import datetime
from pathlib import Path
from PIL import Image
import numpy as np

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

from evaluate import generate_evaluation_artifacts
from dataset_audit import audit_dataset

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset" / "rice_leaf_diseases"
BACKEND_MODELS_DIR = Path(__file__).resolve().parent.parent.parent / "backend" / "models"
MODEL_SAVE_PATH = BACKEND_MODELS_DIR / "rice_leaf_disease_model.keras"
CLASS_NAMES_PATH = BACKEND_MODELS_DIR / "class_names.json"
MODEL_CONFIG_PATH = BACKEND_MODELS_DIR / "model_config.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16


def load_dataset_file_paths(dataset_dir: Path, train_ratio=0.80, val_ratio=0.10):
    """Scan dataset directory, sort classes, and return stratified image paths."""
    class_names = sorted([d.name for d in dataset_dir.iterdir() if d.is_dir()])
    print(f"\nDiscovered {len(class_names)} classes: {class_names}")

    train_files, train_labels = [], []
    val_files, val_labels = [], []
    test_files, test_labels = [], []

    for class_idx, class_name in enumerate(class_names):
        class_folder = dataset_dir / class_name
        images = [f for f in class_folder.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]]
        random.shuffle(images)

        n_total = len(images)
        # Stratified 80/10/10 split: 32 train, 4 val, 4 test for 40 images/class
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)

        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]

        print(f"Class '{class_name}': {len(train_imgs)} train, {len(val_imgs)} val, {len(test_imgs)} test (Total: {n_total})")

        train_files.extend(train_imgs)
        train_labels.extend([class_idx] * len(train_imgs))

        val_files.extend(val_imgs)
        val_labels.extend([class_idx] * len(val_imgs))

        test_files.extend(test_imgs)
        test_labels.extend([class_idx] * len(test_imgs))

    return class_names, (train_files, train_labels), (val_files, val_labels), (test_files, test_labels)


def load_and_preprocess_image(path: Path, target_size=IMG_SIZE) -> np.ndarray:
    """Load image, convert to RGB, resize to 224x224, and normalize by 255.0."""
    img = Image.open(path).convert("RGB").resize(target_size)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr


def create_numpy_dataset(file_paths, labels):
    """Load image paths into a normalized NumPy dataset array."""
    images = np.array([load_and_preprocess_image(f) for f in file_paths], dtype=np.float32)
    labels = np.array(labels, dtype=np.int32)
    return images, labels


def build_data_augmentation():
    """Realistic foliar data augmentation applied only during training."""
    return tf.keras.Sequential([
        layers.RandomFlip("horizontal", seed=SEED),
        layers.RandomRotation(0.08, seed=SEED, fill_mode="nearest"),
        layers.RandomZoom(0.08, seed=SEED, fill_mode="nearest"),
        layers.RandomTranslation(0.05, 0.05, seed=SEED, fill_mode="nearest"),
        layers.RandomContrast(0.1, seed=SEED)
    ], name="data_augmentation")


def build_model(num_classes: int, with_augmentation: bool = True):
    """Build MobileNetV2 Transfer Learning model."""
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False  # Freeze base during initial phase

    inputs = layers.Input(shape=(224, 224, 3), name="input_image")
    if with_augmentation:
        aug = build_data_augmentation()
        x = aug(inputs)
    else:
        x = inputs

    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(0.3, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="rice_leaf_mobilenetv2")
    return model, base_model


def run_pipeline():
    # 1. Dataset Audit
    audit_passed = audit_dataset(DATASET_DIR)
    if not audit_passed:
        raise RuntimeError("Dataset audit failed due to corrupted images.")

    # 2. Stratified Data Split (80/10/10)
    class_names, (train_files, train_labels), (val_files, val_labels), (test_files, test_labels) = load_dataset_file_paths(DATASET_DIR, 0.80, 0.10)

    X_train, y_train = create_numpy_dataset(train_files, train_labels)
    X_val, y_val = create_numpy_dataset(val_files, val_labels)
    X_test, y_test = create_numpy_dataset(test_files, test_labels)

    split_counts = {
        "total": len(X_train) + len(X_val) + len(X_test),
        "train": len(X_train),
        "val": len(X_val),
        "test": len(X_test),
        "per_class": {
            "train_per_class": len(X_train) // len(class_names),
            "val_per_class": len(X_val) // len(class_names),
            "test_per_class": len(X_test) // len(class_names)
        }
    }

    print("\n" + "=" * 60)
    print("EXPERIMENTAL EVALUATION PHASE (80/10/10 SPLIT)")
    print("=" * 60)
    print(f"Train set: {len(X_train)} images | Val set: {len(X_val)} images | Test set: {len(X_test)} images")

    num_classes = len(class_names)
    exp_model, exp_base = build_model(num_classes, with_augmentation=True)

    # Phase 1: Train Head (Base frozen)
    print("\n--- Training Classifier Head (Base Frozen) ---")
    exp_model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    cb_phase1 = [
        EarlyStopping(monitor="val_loss", patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=4, min_lr=1e-6, verbose=1)
    ]

    h1 = exp_model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=35,
        batch_size=BATCH_SIZE,
        callbacks=cb_phase1,
        verbose=1
    )

    # Phase 2: Fine-tune upper layers
    print("\n--- Fine-Tuning Top Layers ---")
    exp_base.trainable = True
    for layer in exp_base.layers[:100]:
        layer.trainable = False

    exp_model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    cb_phase2 = [
        EarlyStopping(monitor="val_loss", patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=4, min_lr=1e-7, verbose=1)
    ]

    h2 = exp_model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=BATCH_SIZE,
        callbacks=cb_phase2,
        verbose=1
    )

    # Evaluate on independent Test set
    train_loss, train_acc = exp_model.evaluate(X_train, y_train, verbose=0)
    val_loss, val_acc = exp_model.evaluate(X_val, y_val, verbose=0)
    test_loss, test_acc = exp_model.evaluate(X_test, y_test, verbose=0)

    y_test_probs = exp_model.predict(X_test, verbose=0)
    y_test_preds = np.argmax(y_test_probs, axis=1)

    print("\n" + "=" * 60)
    print("EXPERIMENTAL EVALUATION RESULTS (12 UNSEEN TEST IMAGES)")
    print("=" * 60)
    print(f"Training Accuracy:   {train_acc * 100:.2f}% (on {len(X_train)} train images)")
    print(f"Validation Accuracy: {val_acc * 100:.2f}% (on {len(X_val)} validation images)")
    print(f"Test Accuracy:       {test_acc * 100:.2f}% (on {len(X_test)} test images)")

    # Save artifacts in ai/evaluation/
    metrics_summary = generate_evaluation_artifacts(
        y_true=y_test,
        y_pred=y_test_preds,
        class_names=class_names,
        split_counts=split_counts,
        train_acc=train_acc,
        val_acc=val_acc,
        test_acc=test_acc
    )

    # 3. Production Model Training (Full 120 Images)
    print("\n" + "=" * 60)
    print("PHASE 13: TRAINING FINAL PRODUCTION MODEL (ALL 120 IMAGES)")
    print("=" * 60)

    all_files = train_files + val_files + test_files
    all_labels = train_labels + val_labels + test_labels
    X_all, y_all = create_numpy_dataset(all_files, all_labels)

    prod_model, prod_base = build_model(num_classes, with_augmentation=True)

    # Phase 1 on all 120 images
    prod_model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    prod_model.fit(
        X_all, y_all,
        epochs=len(h1.history['loss']),
        batch_size=BATCH_SIZE,
        verbose=1
    )

    # Phase 2 Fine-tuning on all 120 images
    prod_base.trainable = True
    for layer in prod_base.layers[:100]:
        layer.trainable = False

    prod_model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    prod_model.fit(
        X_all, y_all,
        epochs=len(h2.history['loss']),
        batch_size=BATCH_SIZE,
        verbose=1
    )

    # 4. Save Final Production Model & Metadata
    BACKEND_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\nSaving production model to {MODEL_SAVE_PATH}...")
    prod_model.save(str(MODEL_SAVE_PATH))
    print("Production model saved successfully.")

    # Save class names JSON
    with open(CLASS_NAMES_PATH, "w", encoding="utf-8") as f:
        json.dump(class_names, f, indent=2)
    print(f"Class names saved to {CLASS_NAMES_PATH}")

    # Save model config JSON
    model_config = {
        "model_name": "rice_leaf_disease_model",
        "model_architecture": "MobileNetV2 (ImageNet) + GlobalAveragePooling2D + Dropout(0.3) + Dense(3, softmax)",
        "input_size": [224, 224, 3],
        "number_of_classes": len(class_names),
        "classes": class_names,
        "preprocessing": "RGB, resize(224, 224), float32, normalized [/ 255.0], batch dimension",
        "data_augmentation": [
            "RandomFlip('horizontal')",
            "RandomRotation(0.08)",
            "RandomZoom(0.08)",
            "RandomTranslation(0.05, 0.05)",
            "RandomContrast(0.1)"
        ],
        "confidence_threshold_pct": 70.0,
        "training_dataset": {
            "total_images": len(all_files),
            "classes": class_names,
            "images_per_class": 40
        },
        "experimental_metrics": metrics_summary["overall_metrics"],
        "confusion_matrix": metrics_summary["confusion_matrix"],
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    with open(MODEL_CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(model_config, f, indent=2)
    print(f"Model config saved to {MODEL_CONFIG_PATH}")

    print("\n" + "=" * 60)
    print("PIPELINE TRAINING & EVALUATION COMPLETED SUCCESSFULLY")
    print("=" * 60)


if __name__ == "__main__":
    run_pipeline()
