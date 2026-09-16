import os
import json
import random
import numpy as np
from pathlib import Path
from PIL import Image

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

DATASET_DIR = Path(__file__).resolve().parent / "dataset" / "rice_leaf_diseases"
MODEL_SAVE_PATH = Path(__file__).resolve().parent.parent / "backend" / "models" / "rice_leaf_disease_model.keras"
METADATA_SAVE_PATH = Path(__file__).resolve().parent.parent / "backend" / "models" / "model_metadata.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16


def load_dataset_file_paths(dataset_dir: Path):
    """Scan dataset directory, sort classes, and return stratified image paths."""
    class_names = sorted([d.name for d in dataset_dir.iterdir() if d.is_dir()])
    print(f"Discovered {len(class_names)} classes: {class_names}")

    train_files, train_labels = [], []
    val_files, val_labels = [], []
    test_files, test_labels = [], []

    for class_idx, class_name in enumerate(class_names):
        class_folder = dataset_dir / class_name
        images = [f for f in class_folder.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        random.shuffle(images)

        n_total = len(images)
        # Stratified Split: 70% train (28), 15% val (6), 15% test (6) for 40 images/class
        n_train = int(n_total * 0.70)
        n_val = int(n_total * 0.15)

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
    """Load image from path, convert to RGB, resize, and convert to float32 [0, 1]."""
    img = Image.open(path).convert("RGB").resize(target_size)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr


def create_numpy_dataset(file_paths, labels):
    """Load all images into NumPy arrays."""
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


def build_model(num_classes: int):
    """Build Transfer Learning model using MobileNetV2."""
    data_augmentation = build_data_augmentation()

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False  # Freeze base during initial phase

    inputs = layers.Input(shape=(224, 224, 3), name="input_layer")
    x = data_augmentation(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(0.3, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="rice_leaf_mobilenetv2")
    return model, base_model


def train():
    class_names, (train_files, train_labels), (val_files, val_labels), (test_files, test_labels) = load_dataset_file_paths(DATASET_DIR)

    X_train, y_train = create_numpy_dataset(train_files, train_labels)
    X_val, y_val = create_numpy_dataset(val_files, val_labels)
    X_test, y_test = create_numpy_dataset(test_files, test_labels)

    print(f"\nDataset Arrays Created:")
    print(f"Train: {X_train.shape[0]} images | Val: {X_val.shape[0]} images | Test: {X_test.shape[0]} images")

    num_classes = len(class_names)
    model, base_model = build_model(num_classes)

    MODEL_SAVE_PATH.parent.mkdir(parents=True, exist_ok=True)

    # ----------------------------------------------------
    # Phase 1: Feature Extraction (Base model frozen)
    # ----------------------------------------------------
    print("\n" + "="*50)
    print("PHASE 1: Training Classification Head (Base Model Frozen)")
    print("="*50)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    callbacks_phase1 = [
        EarlyStopping(monitor="val_loss", patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=4, min_lr=1e-6, verbose=1)
    ]

    history1 = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=35,
        batch_size=BATCH_SIZE,
        callbacks=callbacks_phase1,
        verbose=1
    )

    # ----------------------------------------------------
    # Phase 2: Fine-Tuning (Unfreeze top layers of base)
    # ----------------------------------------------------
    print("\n" + "="*50)
    print("PHASE 2: Fine-Tuning Upper Layers")
    print("="*50)

    base_model.trainable = True
    # Freeze the first 100 layers and unfreeze the remaining top layers
    for layer in base_model.layers[:100]:
        layer.trainable = False

    fine_tune_layers = len([l for l in base_model.layers if l.trainable])
    print(f"Unfrozen {fine_tune_layers} upper layers for fine-tuning.")

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    callbacks_phase2 = [
        EarlyStopping(monitor="val_loss", patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=4, min_lr=1e-7, verbose=1)
    ]

    history2 = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=BATCH_SIZE,
        callbacks=callbacks_phase2,
        verbose=1
    )

    # ----------------------------------------------------
    # Model Evaluation on Unseen Test Dataset
    # ----------------------------------------------------
    print("\n" + "="*50)
    print("FINAL EVALUATION ON UNSEEN TEST DATASET (18 IMAGES)")
    print("="*50)

    train_loss, train_acc = model.evaluate(X_train, y_train, verbose=0)
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
    test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)

    # Get predictions on test set
    y_test_probs = model.predict(X_test, verbose=0)
    y_test_preds = np.argmax(y_test_probs, axis=1)

    precision_macro = precision_score(y_test, y_test_preds, average="macro", zero_division=0)
    recall_macro = recall_score(y_test, y_test_preds, average="macro", zero_division=0)
    f1_macro = f1_score(y_test, y_test_preds, average="macro", zero_division=0)

    cm = confusion_matrix(y_test, y_test_preds)
    clf_report = classification_report(y_test, y_test_preds, target_names=class_names, output_dict=True)

    print(f"Training Accuracy:   {train_acc * 100:.2f}% (on {len(X_train)} train images)")
    print(f"Validation Accuracy: {val_acc * 100:.2f}% (on {len(X_val)} validation images)")
    print(f"Test Accuracy:       {test_acc * 100:.2f}% (on {len(X_test)} test images)")
    print(f"Macro Precision:     {precision_macro * 100:.2f}%")
    print(f"Macro Recall:        {recall_macro * 100:.2f}%")
    print(f"Macro F1-Score:      {f1_macro * 100:.2f}%\n")

    print("Confusion Matrix:")
    print("Rows: True, Columns: Predicted")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y_test, y_test_preds, target_names=class_names))

    # Save final model
    print(f"\nSaving best model to {MODEL_SAVE_PATH}...")
    model.save(str(MODEL_SAVE_PATH))
    print("Model saved successfully.")

    # Save metadata
    metadata = {
        "dataset": {
            "total_images": len(train_files) + len(val_files) + len(test_files),
            "train_images": len(train_files),
            "val_images": len(val_files),
            "test_images": len(test_files),
            "classes": class_names
        },
        "metrics": {
            "train_accuracy_pct": round(float(train_acc * 100), 2),
            "val_accuracy_pct": round(float(val_acc * 100), 2),
            "test_accuracy_pct": round(float(test_acc * 100), 2),
            "precision_macro_pct": round(float(precision_macro * 100), 2),
            "recall_macro_pct": round(float(recall_macro * 100), 2),
            "f1_macro_pct": round(float(f1_macro * 100), 2),
            "confusion_matrix": cm.tolist(),
            "per_class_metrics": clf_report
        },
        "model_architecture": "MobileNetV2 Transfer Learning + Fine Tuning",
        "input_shape": [224, 224, 3],
        "default_confidence_threshold_pct": 70.0
    }

    with open(METADATA_SAVE_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model metadata saved to {METADATA_SAVE_PATH}.")


if __name__ == "__main__":
    train()
