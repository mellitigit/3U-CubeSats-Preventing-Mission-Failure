def jpeg_quality_from_ratio(ratio):
    if ratio >= 0.9: return 95
    if ratio >= 0.7: return 85
    if ratio >= 0.5: return 75
    if ratio >= 0.3: return 50
    return 30


def zstd_level_from_ratio(ratio):
    if ratio >= 0.9: return 1
    if ratio >= 0.6: return 3
    if ratio >= 0.4: return 6
    return 10


def lz4_level_from_ratio(ratio):
    if ratio >= 0.8: return 1
    if ratio >= 0.5: return 2
    return 4
