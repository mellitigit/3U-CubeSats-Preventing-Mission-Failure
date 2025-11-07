from data_classifier import detect_data_type
from compression_selector import select_compression_protocol
from compression_settings import *
from compression_engine import *

def compress_file(input_path, compression_ratio):
    data_type = detect_data_type(input_path)
    protocol = select_compression_protocol(data_type)

    output_path = input_path + ".compressed"

    # IMAGE
    if protocol == "jpeg":
        quality = jpeg_quality_from_ratio(compression_ratio)
        return compress_image_jpeg(input_path, output_path, quality)

    # SCIENCE DATA
    if protocol == "zstd":
        level = zstd_level_from_ratio(compression_ratio)
        return compress_zstd(input_path, output_path, level)

    # TELEMETRY
    if protocol == "lz4":
        level = lz4_level_from_ratio(compression_ratio)
        return compress_lz4(input_path, output_path, level)

    # VIDEO
    if protocol == "h264":
        bitrate = str(int(compression_ratio * 2000)) + "k"
        return compress_h264(input_path, output_path, bitrate)

    # NO COMPRESSION
    return input_path
