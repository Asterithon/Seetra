import cv2
import numpy as np
import base64
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Import util functions from single_processor to stay DRY
from processing.single_processor import (
    image_to_base64,
    get_grayscale_histogram_image,
    get_rgb_histogram_image,
    get_hsv_histogram_image
)

def extract_center_matrix(img, size=9):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
        
    h, w = gray.shape
    cy, cx = h // 2, w // 2
    half = size // 2
    
    y1 = max(0, cy - half)
    y2 = min(h, cy + half + 1)
    x1 = max(0, cx - half)
    x2 = min(w, cx + half + 1)
    
    matrix = gray[y1:y2, x1:x2]
    
    if matrix.shape != (size, size):
        padded = np.zeros((size, size), dtype=np.uint8)
        py = (size - matrix.shape[0]) // 2
        px = (size - matrix.shape[1]) // 2
        padded[py:py+matrix.shape[0], px:px+matrix.shape[1]] = matrix
        return padded.tolist()
        
    return matrix.tolist()

def resize_cover(img, target_w, target_h):
    """Resizes and crops the image to exactly target_w x target_h like CSS object-fit: cover"""
    h, w = img.shape[:2]
    img_aspect = w / h
    target_aspect = target_w / target_h
    
    if img_aspect > target_aspect:
        # Image is wider than target. Scale to match height, then crop width.
        new_h = target_h
        new_w = int(target_h * img_aspect)
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        # Crop center
        start_x = (new_w - target_w) // 2
        return resized[:, start_x:start_x+target_w]
    else:
        # Image is taller than target. Scale to match width, then crop height.
        new_w = target_w
        new_h = int(target_w / img_aspect)
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        # Crop center
        start_y = (new_h - target_h) // 2
        return resized[start_y:start_y+target_h, :]

def process_blend_image(image1_bytes, image2_bytes, params):
    np1 = np.frombuffer(image1_bytes, np.uint8)
    np2 = np.frombuffer(image2_bytes, np.uint8)
    
    img1 = cv2.imdecode(np1, cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(np2, cv2.IMREAD_COLOR)
    
    if img1 is None or img2 is None:
        raise ValueError("Gambar tidak valid")

    # Target size is the minimum dimensions
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    target_w = min(w1, w2)
    target_h = min(h1, h2)
    
    # Auto-resize to cover the minimum dimension without distortion
    if img1.shape[:2] != (target_h, target_w):
        img1 = resize_cover(img1, target_w, target_h)
    if img2.shape[:2] != (target_h, target_w):
        img2 = resize_cover(img2, target_w, target_h)

    op_type = params.get('op_type', 'aritmatika') # 'aritmatika' or 'logika'
    operation = params.get('operation', 'add')
    grayscale = params.get('grayscale', False)

    # Logika operation mandates Grayscale
    if op_type == 'logika':
        grayscale = True

    if grayscale:
        if len(img1.shape) == 3: img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
        if len(img2.shape) == 3: img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
        if len(img1.shape) == 2: img1 = cv2.cvtColor(img1, cv2.COLOR_GRAY2BGR)
        if len(img2.shape) == 2: img2 = cv2.cvtColor(img2, cv2.COLOR_GRAY2BGR)

    matrix_before_1 = extract_center_matrix(img1)
    matrix_before_2 = extract_center_matrix(img2)
    
    if grayscale:
        hist_img1 = get_grayscale_histogram_image(img1)
        hist_img2 = get_grayscale_histogram_image(img2)
    else:
        hist_img1 = {'rgb': get_rgb_histogram_image(img1), 'hsv': get_hsv_histogram_image(img1)}
        hist_img2 = {'rgb': get_rgb_histogram_image(img2), 'hsv': get_hsv_histogram_image(img2)}

    formulas = []
    
    # Perform blending
    # In OpenCV, cv2.add implements saturation (clipping at 255) automatically
    if op_type == 'aritmatika':
        if operation == 'add':
            result = cv2.add(img1, img2)
            formulas.append("P_hasil(x,y) = min(P1(x,y) + P2(x,y), 255)")
        elif operation == 'subtract':
            result = cv2.subtract(img1, img2)
            formulas.append("P_hasil(x,y) = max(P1(x,y) - P2(x,y), 0)")
        elif operation == 'multiply':
            # cv2.multiply would overflow easily. We need to convert to float, multiply, and clip
            img1_f = img1.astype(np.float32)
            img2_f = img2.astype(np.float32)
            res_f = np.clip(img1_f * img2_f, 0, 255)
            result = res_f.astype(np.uint8)
            formulas.append("P_hasil(x,y) = min(P1(x,y) * P2(x,y), 255)")
        elif operation == 'divide':
            # Avoid division by zero
            img1_f = img1.astype(np.float32)
            img2_f = img2.astype(np.float32) + 1e-6
            res_f = np.clip(img1_f / img2_f, 0, 255)
            result = res_f.astype(np.uint8)
            formulas.append("P_hasil(x,y) = min(P1(x,y) / (P2(x,y) + epsilon), 255)")
        else:
            result = img1
            formulas.append("Operasi tidak valid")
    else: # Logika
        if operation == 'and':
            result = cv2.bitwise_and(img1, img2)
            formulas.append("P_hasil(x,y) = P1(x,y) AND P2(x,y) [Bitwise]")
        elif operation == 'or':
            result = cv2.bitwise_or(img1, img2)
            formulas.append("P_hasil(x,y) = P1(x,y) OR P2(x,y) [Bitwise]")
        elif operation == 'xor':
            result = cv2.bitwise_xor(img1, img2)
            formulas.append("P_hasil(x,y) = P1(x,y) XOR P2(x,y) [Bitwise]")
        else:
            result = img1
            formulas.append("Operasi tidak valid")

    matrix_after = extract_center_matrix(result)
    
    if grayscale:
        hist_result = get_grayscale_histogram_image(result)
    else:
        hist_result = {'rgb': get_rgb_histogram_image(result), 'hsv': get_hsv_histogram_image(result)}

    return {
        'processed_image': image_to_base64(result),
        'image1_preview': image_to_base64(img1),
        'image2_preview': image_to_base64(img2),
        'math_data': {
            'matrix_1': matrix_before_1,
            'matrix_2': matrix_before_2,
            'matrix_after': matrix_after,
            'formulas': formulas
        },
        'histogram': {
            'hist_1': hist_img1,
            'hist_2': hist_img2,
            'hist_after': hist_result
        }
    }
