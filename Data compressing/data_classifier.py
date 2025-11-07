import mimetypes
import os

def detect_data_type(filepath):
    # 1. Detect using MIME type
    mime, encoding = mimetypes.guess_type(filepath)

    if mime:
        if mime.startswith("image"):
            return "image"
        if mime.startswith("video"):
            return "video"
        if mime.startswith("text"):
            return "telemetry"
    
    # 2. Fallback based on extension
    ext = os.path.splitext(filepath)[1].lower()

    if ext in [".jpg", ".jpeg", ".png", ".tif", ".bmp"]:
        return "image"
    if ext in [".csv", ".txt", ".log"]:
        return "telemetry"
    if ext in [".bin", ".dat"]:
        return "science"
    if ext in [".mp4", ".avi", ".mov"]:
        return "video"

    return "unknown"
