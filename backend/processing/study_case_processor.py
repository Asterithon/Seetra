import cv2
import numpy as np

from processing.single_processor import (
    image_to_base64,
    extract_center_matrix,
    get_rgb_histogram_image,
    get_hsv_histogram_image,
    get_grayscale_histogram_image
)

def process_yellow_teeth(img):
    snapshots = []
    formulas = []
    
    # 1. Original
    snapshots.append({
        'title': '1. Original Image',
        'image': image_to_base64(img)
    })
    
    # Grayscale Background
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_bgr = cv2.cvtColor(gray_img, cv2.COLOR_GRAY2BGR)
    snapshots.append({
        'title': '2. Grayscale Background',
        'image': image_to_base64(gray_bgr)
    })
    
    # HSV Masking
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # Define range for yellow color in HSV
    lower_yellow = np.array([15, 50, 50])
    upper_yellow = np.array([40, 255, 255])
    
    mask = cv2.inRange(hsv_img, lower_yellow, upper_yellow)
    
    # Color masked region
    yellow_highlight = cv2.bitwise_and(img, img, mask=mask)
    snapshots.append({
        'title': '3. Yellow HSV Masking',
        'image': image_to_base64(yellow_highlight)
    })
    
    # Invert mask
    mask_inv = cv2.bitwise_not(mask)
    
    # Background region
    gray_background = cv2.bitwise_and(gray_bgr, gray_bgr, mask=mask_inv)
    
    # Combine
    final_result = cv2.add(yellow_highlight, gray_background)
    snapshots.append({
        'title': '4. Final Blended Output',
        'image': image_to_base64(final_result)
    })
    
    formulas = [
        "1. Konversi ruang warna BGR ke HSV",
        "2. Deteksi piksel: 15 <= Hue <= 40, Sat/Val >= 50 (Mask_Kuning)",
        "3. Latar_Belakang = Grayscale(Citra_Asli)",
        "4. P'(x,y) = Citra_Asli(x,y) jika Mask_Kuning==1, else Latar_Belakang(x,y)"
    ]

    total_pixels = img.shape[0] * img.shape[1]
    yellow_pixels = cv2.countNonZero(mask)
    yellow_percentage = (yellow_pixels / total_pixels) * 100

    matrix_before = extract_center_matrix(img)
    matrix_after = extract_center_matrix(final_result)
    
    return {
        'processed_image': image_to_base64(final_result),
        'snapshots': snapshots,
        'yellow_percentage': f"{yellow_percentage:.2f}",
        'math_data': {
            'matrix_before': matrix_before,
            'matrix_after': matrix_after,
            'formulas': formulas
        },
        'histogram': {
            'rgb_before': get_rgb_histogram_image(img),
            'hsv_before': get_hsv_histogram_image(img),
            'rgb_after': get_rgb_histogram_image(final_result),
            'hsv_after': get_hsv_histogram_image(final_result)
        }
    }

STUDY_CASES = {
    'yellow_teeth': process_yellow_teeth
}

def process_study_case(image_bytes, case_id):
    if case_id not in STUDY_CASES:
        raise ValueError(f"Study case '{case_id}' tidak ditemukan dalam registry.")
        
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Gambar tidak valid")
        
    return STUDY_CASES[case_id](img)
