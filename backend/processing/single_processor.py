import cv2
import numpy as np
import base64
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def image_to_base64(img):
    if img is None:
        return ""
    _, buffer = cv2.imencode('.jpg', img)
    img_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{img_str}"

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

def get_plot_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.0, transparent=True)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return f"data:image/png;base64,{img_str}"

def get_grayscale_histogram_image(img):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
    
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    
    plt.figure(figsize=(4, 1.5))
    plt.plot(hist, color='#60a5fa') # Tailwind blue-400
    plt.fill_between(range(256), hist.flatten(), color='#60a5fa', alpha=0.3)
    plt.axis('off')
    
    return get_plot_base64()

def get_rgb_histogram_image(img):
    plt.figure(figsize=(4, 1.5))
    if len(img.shape) == 3:
        colors = ('#3b82f6', '#22c55e', '#ef4444') # blue, green, red
        for i, col in enumerate(colors):
            hist = cv2.calcHist([img], [i], None, [256], [0, 256])
            plt.plot(hist, color=col)
            plt.fill_between(range(256), hist.flatten(), color=col, alpha=0.3)
    else:
        hist = cv2.calcHist([img], [0], None, [256], [0, 256])
        plt.plot(hist, color='#94a3b8')
        plt.fill_between(range(256), hist.flatten(), color='#94a3b8', alpha=0.3)
    plt.axis('off')
    return get_plot_base64()

def get_hsv_histogram_image(img):
    plt.figure(figsize=(4, 1.5))
    if len(img.shape) == 3:
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        colors = ('#eab308', '#06b6d4', '#a855f7') # yellow for H, cyan for S, purple for V
        for i, col in enumerate(colors):
            hist = cv2.calcHist([hsv], [i], None, [256], [0, 256])
            plt.plot(hist, color=col)
            plt.fill_between(range(256), hist.flatten(), color=col, alpha=0.3)
    else:
        hist = cv2.calcHist([img], [0], None, [256], [0, 256])
        plt.plot(hist, color='#94a3b8')
        plt.fill_between(range(256), hist.flatten(), color='#94a3b8', alpha=0.3)
    plt.axis('off')
    return get_plot_base64()

def process_single_image(image_bytes, params):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image file")

    snapshots = []
    formulas = []
    
    matrix_before = extract_center_matrix(img)
    rgb_hist_before = get_rgb_histogram_image(img)
    hsv_hist_before = get_hsv_histogram_image(img)
    
    h, w = img.shape[:2]
    current_img = img.copy()

    snapshots.append({
        'title': '1. Original Image',
        'image': image_to_base64(current_img)
    })
    step_counter = 2

    # --- 0. GLOBAL (Grayscale first) ---
    glob = params.get('global', {})
    if glob.get('grayscale', False):
        if len(current_img.shape) == 3:
            current_img = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY)
            current_img = cv2.cvtColor(current_img, cv2.COLOR_GRAY2BGR)
        snapshots.append({
            'title': f'{step_counter}. Grayscale',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append("P_gray(x,y) = 0.299*R + 0.587*G + 0.114*B")

    # --- 1. OPERASI GEOMETRI ---
    geom = params.get('geometri', {})
    
    scale = float(geom.get('scaling', 1.0))
    if scale != 1.0:
        new_w, new_h = int(w * scale), int(h * scale)
        current_img = cv2.resize(current_img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        h, w = current_img.shape[:2]
        snapshots.append({'title': f'{step_counter}. Scaling ({scale}x)', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x/{scale}, y/{scale})")
        
    tx = int(geom.get('transX', 0))
    if tx != 0:
        M = np.float32([[1, 0, tx], [0, 1, 0]])
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({'title': f'{step_counter}. Translasi X ({tx}px)', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x - {tx}, y)")
        
    ty = int(geom.get('transY', 0))
    if ty != 0:
        M = np.float32([[1, 0, 0], [0, 1, ty]])
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({'title': f'{step_counter}. Translasi Y ({ty}px)', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x, y - {ty})")
        
    angle = float(geom.get('rotasi', 0))
    if angle != 0:
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({'title': f'{step_counter}. Rotasi ({angle}°)', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x*cos({angle}) - y*sin({angle}), x*sin({angle}) + y*cos({angle}))")
        
    flip_mode = geom.get('flip', 'none')
    if flip_mode == 'horizontal':
        current_img = cv2.flip(current_img, 1)
        snapshots.append({'title': f'{step_counter}. Flip Horizontal', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(width - 1 - x, y)")
    elif flip_mode == 'vertical':
        current_img = cv2.flip(current_img, 0)
        snapshots.append({'title': f'{step_counter}. Flip Vertikal', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x, height - 1 - y)")

    # --- 2. OPERASI TITIK ---
    titik = params.get('titik', {})
    
    brightness = int(titik.get('brightness', 0))
    if brightness != 0:
        current_img = cv2.convertScaleAbs(current_img, alpha=1.0, beta=brightness)
        snapshots.append({'title': f'{step_counter}. Brightness ({brightness})', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = clip(P(x,y) + {brightness}, 0, 255)")
        
    contrast = float(titik.get('contrast', 1.0))
    if contrast != 1.0:
        current_img = cv2.convertScaleAbs(current_img, alpha=contrast, beta=0)
        snapshots.append({'title': f'{step_counter}. Contrast ({contrast}x)', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = clip(P(x,y) * {contrast}, 0, 255)")
        
    threshold = int(titik.get('threshold', 128))
    if threshold != 128:
        _, current_img = cv2.threshold(current_img, threshold, 255, cv2.THRESH_BINARY)
        snapshots.append({'title': f'{step_counter}. Threshold ({threshold})', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = 255 if P(x,y) > {threshold} else 0")
        
    negasi = titik.get('negasi', False)
    if negasi:
        current_img = cv2.bitwise_not(current_img)
        snapshots.append({'title': f'{step_counter}. Negasi', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = 255 - P(x,y)")

    # --- 3. OPERASI SPASIAL ---
    spasial = params.get('spasial', {})
    
    mean_size = int(spasial.get('meanSize', 3))
    if mean_size > 3:
        current_img = cv2.blur(current_img, (mean_size, mean_size))
        snapshots.append({'title': f'{step_counter}. Mean Filter ({mean_size}x{mean_size})', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = (1/{mean_size*mean_size}) * sum(neighbors)")
        
    median_size = int(spasial.get('medianSize', 3))
    if median_size > 3:
        if median_size % 2 == 0: median_size += 1
        current_img = cv2.medianBlur(current_img, median_size)
        snapshots.append({'title': f'{step_counter}. Median Filter ({median_size}x{median_size})', 'image': image_to_base64(current_img)})
        step_counter += 1
        formulas.append(f"P'(x,y) = median(neighbors in {median_size}x{median_size})")
        
    edge_type = spasial.get('edgeType', 'none')
    if edge_type != 'none':
        gray_for_edge = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY) if len(current_img.shape) == 3 else current_img
        
        if edge_type == 'sobel':
            sobelx = cv2.Sobel(gray_for_edge, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray_for_edge, cv2.CV_64F, 0, 1, ksize=3)
            edge_img = cv2.magnitude(sobelx, sobely)
            current_img = cv2.convertScaleAbs(edge_img)
            snapshots.append({'title': f'{step_counter}. Edge Sobel', 'image': image_to_base64(current_img)})
            formulas.append("P'(x,y) = sqrt(Gx^2 + Gy^2) where Gx, Gy are Sobel gradients")
        elif edge_type == 'prewitt':
            kernelx = np.array([[1, 1, 1], [0, 0, 0], [-1, -1, -1]], dtype=int)
            kernely = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=int)
            x = cv2.filter2D(gray_for_edge, cv2.CV_16S, kernelx)
            y = cv2.filter2D(gray_for_edge, cv2.CV_16S, kernely)
            edge_img = cv2.convertScaleAbs(cv2.addWeighted(cv2.convertScaleAbs(x), 0.5, cv2.convertScaleAbs(y), 0.5, 0))
            current_img = edge_img
            snapshots.append({'title': f'{step_counter}. Edge Prewitt', 'image': image_to_base64(current_img)})
            formulas.append("P'(x,y) = Prewitt kernel convolution")
        elif edge_type == 'canny':
            low = int(spasial.get('cannyLow', 50))
            high = int(spasial.get('cannyHigh', 150))
            current_img = cv2.Canny(gray_for_edge, low, high)
            snapshots.append({'title': f'{step_counter}. Edge Canny ({low},{high})', 'image': image_to_base64(current_img)})
            formulas.append(f"P'(x,y) = Canny(low={low}, high={high})")
            
        if len(current_img.shape) == 2:
            current_img = cv2.cvtColor(current_img, cv2.COLOR_GRAY2BGR)
        step_counter += 1
            
    matrix_after = extract_center_matrix(current_img)
    hist_after = get_grayscale_histogram_image(current_img)
    rgb_hist_after = get_rgb_histogram_image(current_img)
    hsv_hist_after = get_hsv_histogram_image(current_img)

    if not formulas:
        formulas.append("Tidak ada operasi yang diaplikasikan (P' = P).")

    return {
        'processed_image': image_to_base64(current_img),
        'snapshots': snapshots,
        'math_data': {
            'matrix_before': matrix_before,
            'matrix_after': matrix_after,
            'formulas': formulas
        },
        'histogram': {
            'rgb_before': rgb_hist_before,
            'hsv_before': hsv_hist_before,
            'hist_after': hist_after,
            'rgb_after': rgb_hist_after,
            'hsv_after': hsv_hist_after
        }
    }
