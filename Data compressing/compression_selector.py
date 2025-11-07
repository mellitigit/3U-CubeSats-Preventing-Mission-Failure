def select_compression_protocol(data_type):
    if data_type == "image":
        return "jpeg"  # or "jpeg2000"
    if data_type == "video":
        return "h264"
    if data_type == "telemetry":
        return "lz4"
    if data_type == "science":
        return "zstd"   # or "ccsds121"
    
    return "none"

