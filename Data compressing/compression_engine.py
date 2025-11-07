import subprocess
from PIL import Image
import lz4.frame
import zstandard as zstd

# IMAGE COMPRESSION (JPEG)
def compress_image_jpeg(input_path, output_path, quality):
    img = Image.open(input_path)
    img.save(output_path, "JPEG", quality=quality)
    return output_path


# LZ4 (fast lossless)
def compress_lz4(input_path, output_path, level=1):
    with open(input_path, "rb") as f_in:
        data = f_in.read()
    compressed = lz4.frame.compress(data, compression_level=level)
    with open(output_path, "wb") as f_out:
        f_out.write(compressed)
    return output_path


# ZSTD (lossless, high ratio)
def compress_zstd(input_path, output_path, level=3):
    with open(input_path, "rb") as f_in:
        data = f_in.read()

    compressor = zstd.ZstdCompressor(level=level)
    compressed = compressor.compress(data)

    with open(output_path, "wb") as f_out:
        f_out.write(compressed)

    return output_path


# VIDEO COMPRESSION (H.264, Pi hardware accelerated)
def compress_h264(input_path, output_path, bitrate="1000k"):
    subprocess.run([
        "ffmpeg", "-i", input_path, 
        "-vcodec", "h264_omx",   # Raspberry Pi hardware encoder
        "-b:v", bitrate, output_path
    ])
    return output_path
