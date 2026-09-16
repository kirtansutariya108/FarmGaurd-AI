import json
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score

EVAL_DIR = Path(__file__).resolve().parent.parent / "evaluation"


def generate_evaluation_artifacts(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: list,
    split_counts: dict,
    train_acc: float,
    val_acc: float,
    test_acc: float,
    eval_dir: Path = EVAL_DIR
):
    """Generate and save confusion_matrix.png, classification_report.txt, and metrics.json."""
    eval_dir.mkdir(parents=True, exist_ok=True)

    cm = confusion_matrix(y_true, y_pred)
    clf_report_str = classification_report(y_true, y_pred, target_names=class_names, digits=4)
    clf_report_dict = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)

    precision_macro = precision_score(y_true, y_pred, average="macro", zero_division=0)
    recall_macro = recall_score(y_true, y_pred, average="macro", zero_division=0)
    f1_macro = f1_score(y_true, y_pred, average="macro", zero_division=0)

    # 1. Save classification_report.txt
    report_path = eval_dir / "classification_report.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("RICE LEAF DISEASE CLASSIFICATION REPORT (HELD-OUT TEST SET)\n")
        f.write("=" * 65 + "\n\n")
        f.write(f"Dataset Split: Train={split_counts['train']}, Val={split_counts['val']}, Test={split_counts['test']} (Total: {split_counts['total']})\n")
        f.write(f"Training Accuracy:   {train_acc * 100:.2f}%\n")
        f.write(f"Validation Accuracy: {val_acc * 100:.2f}%\n")
        f.write(f"Test Accuracy:       {test_acc * 100:.2f}%\n")
        f.write(f"Macro Precision:     {precision_macro * 100:.2f}%\n")
        f.write(f"Macro Recall:        {recall_macro * 100:.2f}%\n")
        f.write(f"Macro F1-Score:      {f1_macro * 100:.2f}%\n\n")
        f.write("Detailed Per-Class Performance:\n")
        f.write("-" * 65 + "\n")
        f.write(clf_report_str + "\n\n")
        f.write("Confusion Matrix (Rows: Actual, Cols: Predicted):\n")
        f.write("-" * 65 + "\n")
        for row, name in zip(cm, class_names):
            f.write(f"  {name:<25}: {row}\n")
    print(f"Saved classification report to {report_path}")

    # 2. Save metrics.json
    metrics_path = eval_dir / "metrics.json"
    metrics_data = {
        "dataset_splits": split_counts,
        "classes": class_names,
        "overall_metrics": {
            "training_accuracy_pct": round(float(train_acc * 100), 2),
            "validation_accuracy_pct": round(float(val_acc * 100), 2),
            "test_accuracy_pct": round(float(test_acc * 100), 2),
            "macro_precision_pct": round(float(precision_macro * 100), 2),
            "macro_recall_pct": round(float(recall_macro * 100), 2),
            "macro_f1_pct": round(float(f1_macro * 100), 2),
        },
        "confusion_matrix": cm.tolist(),
        "per_class_report": clf_report_dict
    }
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)
    print(f"Saved metrics JSON to {metrics_path}")

    # 3. Generate and save confusion_matrix.png
    cm_plot_path = eval_dir / "confusion_matrix.png"
    fig, ax = plt.subplots(figsize=(7, 6))
    im = ax.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)

    ax.set(
        xticks=np.arange(cm.shape[1]),
        yticks=np.arange(cm.shape[0]),
        xticklabels=class_names,
        yticklabels=class_names,
        title="Confusion Matrix - Rice Leaf Disease Test Set",
        ylabel="True Label (Actual)",
        xlabel="Predicted Label"
    )
    plt.setp(ax.get_xticklabels(), rotation=30, ha="right", rotation_mode="anchor")

    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(
                j, i, format(cm[i, j], "d"),
                ha="center", va="center",
                color="white" if cm[i, j] > thresh else "black",
                fontweight="bold"
            )

    fig.tight_layout()
    plt.savefig(cm_plot_path, dpi=200)
    plt.close()
    print(f"Saved confusion matrix plot to {cm_plot_path}")

    return metrics_data
