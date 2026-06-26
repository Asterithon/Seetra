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

def morphological_thinning(img):
    binary = (img > 128).astype(np.uint8)
    
    # Structuring elements for thinning (Golay alphabet for thinning)
    kernels = [
        np.array([[ 0,  0, 0], [-1,  1,-1], [ 1,  1, 1]], dtype=np.int8),
        np.array([[-1,  0, 0], [ 1,  1, 0], [ 1,  1,-1]], dtype=np.int8),
        np.array([[ 1, -1, 0], [ 1,  1, 0], [ 1, -1, 0]], dtype=np.int8),
        np.array([[ 1,  1,-1], [ 1,  1, 0], [-1,  0, 0]], dtype=np.int8),
        np.array([[ 1,  1, 1], [-1,  1,-1], [ 0,  0, 0]], dtype=np.int8),
        np.array([[-1,  1, 1], [ 0,  1, 1], [ 0,  0,-1]], dtype=np.int8),
        np.array([[ 0, -1, 1], [ 0,  1, 1], [ 0, -1, 1]], dtype=np.int8),
        np.array([[ 0,  0,-1], [ 0,  1, 1], [-1,  1, 1]], dtype=np.int8)
    ]
    
    thinned = binary.copy()
    for _ in range(30):  # limit iterations for speed
        last = thinned.copy()
        for k in kernels:
            hm = cv2.morphologyEx(thinned, cv2.MORPH_HITMISS, k)
            thinned = cv2.subtract(thinned, hm)
        if np.array_equal(thinned, last):
            break
            
    return thinned * 255

def zhang_suen_thinning(img):
    # Ensure binary image with values 0 and 1
    binary = (img > 128).astype(np.uint8)
    
    # Pad to handle boundaries easily
    padded = np.pad(binary, 1, mode='constant', constant_values=0)
    
    iteration = 0
    max_iterations = 100  # Safety limit
    while iteration < max_iterations:
        changed = False
        
        # Step 1
        p2 = padded[:-2, 1:-1]
        p3 = padded[:-2, 2:]
        p4 = padded[1:-1, 2:]
        p5 = padded[2:, 2:]
        p6 = padded[2:, 1:-1]
        p7 = padded[2:, :-2]
        p8 = padded[1:-1, :-2]
        p9 = padded[:-2, :-2]
        p1 = padded[1:-1, 1:-1]
        
        b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
        
        a = ((p2 == 0) & (p3 == 1)).astype(np.uint8) + \
            ((p3 == 0) & (p4 == 1)).astype(np.uint8) + \
            ((p4 == 0) & (p5 == 1)).astype(np.uint8) + \
            ((p5 == 0) & (p6 == 1)).astype(np.uint8) + \
            ((p6 == 0) & (p7 == 1)).astype(np.uint8) + \
            ((p7 == 0) & (p8 == 1)).astype(np.uint8) + \
            ((p8 == 0) & (p9 == 1)).astype(np.uint8) + \
            ((p9 == 0) & (p2 == 1)).astype(np.uint8)
            
        cond1 = (p1 == 1)
        cond2 = (b >= 2) & (b <= 6)
        cond3 = (a == 1)
        cond4 = (p2 * p4 * p6 == 0)
        cond5 = (p4 * p6 * p8 == 0)
        
        to_delete = cond1 & cond2 & cond3 & cond4 & cond5
        if np.any(to_delete):
            padded[1:-1, 1:-1][to_delete] = 0
            changed = True
            
        # Step 2
        p2 = padded[:-2, 1:-1]
        p3 = padded[:-2, 2:]
        p4 = padded[1:-1, 2:]
        p5 = padded[2:, 2:]
        p6 = padded[2:, 1:-1]
        p7 = padded[2:, :-2]
        p8 = padded[1:-1, :-2]
        p9 = padded[:-2, :-2]
        p1 = padded[1:-1, 1:-1]
        
        b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
        
        a = ((p2 == 0) & (p3 == 1)).astype(np.uint8) + \
            ((p3 == 0) & (p4 == 1)).astype(np.uint8) + \
            ((p4 == 0) & (p5 == 1)).astype(np.uint8) + \
            ((p5 == 0) & (p6 == 1)).astype(np.uint8) + \
            ((p6 == 0) & (p7 == 1)).astype(np.uint8) + \
            ((p7 == 0) & (p8 == 1)).astype(np.uint8) + \
            ((p8 == 0) & (p9 == 1)).astype(np.uint8) + \
            ((p9 == 0) & (p2 == 1)).astype(np.uint8)
            
        cond1 = (p1 == 1)
        cond2 = (b >= 2) & (b <= 6)
        cond3 = (a == 1)
        cond4 = (p2 * p4 * p8 == 0)
        cond5 = (p2 * p6 * p8 == 0)
        
        to_delete_2 = cond1 & cond2 & cond3 & cond4 & cond5
        if np.any(to_delete_2):
            padded[1:-1, 1:-1][to_delete_2] = 0
            changed = True
            
        if not changed:
            break
            
        iteration += 1
        
    return padded[1:-1, 1:-1] * 255

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
        'op_key': 'original_image',
        'params': {},
        'title': '1. Original Image',
        'image': image_to_base64(current_img)
    })
    step_counter = 2

    # --- 0. GLOBAL (Grayscale first, then Binarize) ---
    glob = params.get('global', {})
    if glob.get('binarize', False):
        if len(current_img.shape) == 3:
            current_img = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY)
        
        # Binarize using default or user threshold
        thresh_val = int(params.get('titik', {}).get('threshold', 128))
        _, thresh_img = cv2.threshold(current_img, thresh_val, 255, cv2.THRESH_BINARY)
        current_img = cv2.cvtColor(thresh_img, cv2.COLOR_GRAY2BGR)
        
        snapshots.append({
            'op_key': 'binarize',
            'params': {'threshold': thresh_val},
            'title': f'{step_counter}. Mode Biner ({thresh_val})',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P_bin(x,y) = 255 if P_gray(x,y) > {thresh_val} else 0")
        
    elif glob.get('grayscale', False):
        if len(current_img.shape) == 3:
            current_img = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY)
            current_img = cv2.cvtColor(current_img, cv2.COLOR_GRAY2BGR)
        snapshots.append({
            'op_key': 'grayscale',
            'params': {},
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
        snapshots.append({
            'op_key': 'scale',
            'params': {'scale': scale},
            'title': f'{step_counter}. Scaling ({scale}x)',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x/{scale}, y/{scale})")
        
    tx = int(geom.get('transX', 0))
    if tx != 0:
        M = np.float32([[1, 0, tx], [0, 1, 0]])
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({
            'op_key': 'translate_x',
            'params': {'tx': tx},
            'title': f'{step_counter}. Translasi X ({tx}px)',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x - {tx}, y)")
        
    ty = int(geom.get('transY', 0))
    if ty != 0:
        M = np.float32([[1, 0, 0], [0, 1, ty]])
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({
            'op_key': 'translate_y',
            'params': {'ty': ty},
            'title': f'{step_counter}. Translasi Y ({ty}px)',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x, y - {ty})")
        
    angle = float(geom.get('rotasi', 0))
    if angle != 0:
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        current_img = cv2.warpAffine(current_img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        snapshots.append({
            'op_key': 'rotate',
            'params': {'angle': angle},
            'title': f'{step_counter}. Rotasi ({angle}°)',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x*cos({angle}) - y*sin({angle}), x*sin({angle}) + y*cos({angle}))")
        
    flip_mode = geom.get('flip', 'none')
    if flip_mode == 'horizontal':
        current_img = cv2.flip(current_img, 1)
        snapshots.append({
            'op_key': 'flip_h',
            'params': {},
            'title': f'{step_counter}. Flip Horizontal',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(width - 1 - x, y)")
    elif flip_mode == 'vertical':
        current_img = cv2.flip(current_img, 0)
        snapshots.append({
            'op_key': 'flip_v',
            'params': {},
            'title': f'{step_counter}. Flip Vertikal',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = P(x, height - 1 - y)")

    # --- 2. OPERASI TITIK ---
    titik = params.get('titik', {})
    
    brightness = int(titik.get('brightness', 0))
    if brightness != 0:
        current_img = cv2.convertScaleAbs(current_img, alpha=1.0, beta=brightness)
        snapshots.append({
            'op_key': 'brightness',
            'params': {'brightness': brightness},
            'title': f'{step_counter}. Brightness ({brightness})',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = clip(P(x,y) + {brightness}, 0, 255)")
        
    contrast = float(titik.get('contrast', 1.0))
    if contrast != 1.0:
        current_img = cv2.convertScaleAbs(current_img, alpha=contrast, beta=0)
        snapshots.append({
            'op_key': 'contrast',
            'params': {'contrast': contrast},
            'title': f'{step_counter}. Contrast ({contrast}x)',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = clip(P(x,y) * {contrast}, 0, 255)")
        
    threshold = int(titik.get('threshold', 128))
    if threshold != 128:
        _, current_img = cv2.threshold(current_img, threshold, 255, cv2.THRESH_BINARY)
        snapshots.append({
            'op_key': 'threshold',
            'params': {'threshold': threshold},
            'title': f'{step_counter}. Threshold ({threshold})',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = 255 if P(x,y) > {threshold} else 0")
        
    negasi = titik.get('negasi', False)
    if negasi:
        current_img = cv2.bitwise_not(current_img)
        snapshots.append({
            'op_key': 'negation',
            'params': {},
            'title': f'{step_counter}. Negasi',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = 255 - P(x,y)")

    # --- 3. OPERASI SPASIAL ---
    spasial = params.get('spasial', {})
    
    mean_size = int(spasial.get('meanSize', 3))
    if mean_size > 3:
        current_img = cv2.blur(current_img, (mean_size, mean_size))
        snapshots.append({
            'op_key': 'mean_filter',
            'params': {'mean_size': mean_size},
            'title': f'{step_counter}. Mean Filter ({mean_size}x{mean_size})',
            'image': image_to_base64(current_img)
        })
        step_counter += 1
        formulas.append(f"P'(x,y) = (1/{mean_size*mean_size}) * sum(neighbors)")
        
    median_size = int(spasial.get('medianSize', 3))
    if median_size > 3:
        if median_size % 2 == 0: median_size += 1
        current_img = cv2.medianBlur(current_img, median_size)
        snapshots.append({
            'op_key': 'median_filter',
            'params': {'median_size': median_size},
            'title': f'{step_counter}. Median Filter ({median_size}x{median_size})',
            'image': image_to_base64(current_img)
        })
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
            snapshots.append({
                'op_key': 'edge_sobel',
                'params': {},
                'title': f'{step_counter}. Edge Sobel',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = sqrt(Gx^2 + Gy^2) where Gx, Gy are Sobel gradients")
        elif edge_type == 'prewitt':
            kernelx = np.array([[1, 1, 1], [0, 0, 0], [-1, -1, -1]], dtype=int)
            kernely = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=int)
            x = cv2.filter2D(gray_for_edge, cv2.CV_16S, kernelx)
            y = cv2.filter2D(gray_for_edge, cv2.CV_16S, kernely)
            edge_img = cv2.convertScaleAbs(cv2.addWeighted(cv2.convertScaleAbs(x), 0.5, cv2.convertScaleAbs(y), 0.5, 0))
            current_img = edge_img
            snapshots.append({
                'op_key': 'edge_prewitt',
                'params': {},
                'title': f'{step_counter}. Edge Prewitt',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = Prewitt kernel convolution")
        elif edge_type == 'roberts':
            kernelx = np.array([[1, 0], [0, -1]], dtype=np.float32)
            kernely = np.array([[0, 1], [-1, 0]], dtype=np.float32)
            x = cv2.filter2D(gray_for_edge, cv2.CV_32F, kernelx)
            y = cv2.filter2D(gray_for_edge, cv2.CV_32F, kernely)
            edge_img = cv2.magnitude(x, y)
            current_img = cv2.convertScaleAbs(edge_img)
            snapshots.append({
                'op_key': 'edge_roberts',
                'params': {},
                'title': f'{step_counter}. Edge Roberts',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = sqrt(Gx^2 + Gy^2) where Gx, Gy are Roberts Cross gradients")
        elif edge_type == 'laplacian':
            laplacian = cv2.Laplacian(gray_for_edge, cv2.CV_32F, ksize=3)
            current_img = cv2.convertScaleAbs(laplacian)
            snapshots.append({
                'op_key': 'edge_laplacian',
                'params': {},
                'title': f'{step_counter}. Edge Laplacian',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = Laplacian(P) [Second-order derivative]")
        elif edge_type == 'canny':
            low = int(spasial.get('cannyLow', 50))
            high = int(spasial.get('cannyHigh', 150))
            current_img = cv2.Canny(gray_for_edge, low, high)
            snapshots.append({
                'op_key': 'edge_canny',
                'params': {'low': low, 'high': high},
                'title': f'{step_counter}. Edge Canny ({low},{high})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"P'(x,y) = Canny(low={low}, high={high})")
            
        if len(current_img.shape) == 2:
            current_img = cv2.cvtColor(current_img, cv2.COLOR_GRAY2BGR)
        step_counter += 1

    # --- 4. OPERASI MORFOLOGI ---
    morf = params.get('morfologi', {})
    morf_type = morf.get('type', 'none')
    morf_size = int(morf.get('kernelSize', 3))
    
    if morf_type != 'none':
        if morf_size % 2 == 0: morf_size += 1
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (morf_size, morf_size))
        
        if morf_type == 'dilate':
            current_img = cv2.dilate(current_img, kernel)
            snapshots.append({
                'op_key': 'morph_dilate',
                'params': {'kernel_size': morf_size},
                'title': f'{step_counter}. Dilasi ({morf_size}x{morf_size})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"P'(x,y) = max(P(x+i, y+j)) for (i,j) in {morf_size}x{morf_size} neighborhood")
        elif morf_type == 'erode':
            current_img = cv2.erode(current_img, kernel)
            snapshots.append({
                'op_key': 'morph_erode',
                'params': {'kernel_size': morf_size},
                'title': f'{step_counter}. Erosi ({morf_size}x{morf_size})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"P'(x,y) = min(P(x+i, y+j)) for (i,j) in {morf_size}x{morf_size} neighborhood")
        elif morf_type == 'open':
            current_img = cv2.morphologyEx(current_img, cv2.MORPH_OPEN, kernel)
            snapshots.append({
                'op_key': 'morph_open',
                'params': {'kernel_size': morf_size},
                'title': f'{step_counter}. Opening ({morf_size}x{morf_size})',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = Dilate(Erode(P)) [Opening]")
        elif morf_type == 'close':
            current_img = cv2.morphologyEx(current_img, cv2.MORPH_CLOSE, kernel)
            snapshots.append({
                'op_key': 'morph_close',
                'params': {'kernel_size': morf_size},
                'title': f'{step_counter}. Closing ({morf_size}x{morf_size})',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = Erode(Dilate(P)) [Closing]")
            
        step_counter += 1

    # --- 5. OPERASI THINNING / PENIPISAN ---
    thin = params.get('thinning', {})
    thin_type = thin.get('type', 'none')
    
    if thin_type != 'none':
        gray = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY) if len(current_img.shape) == 3 else current_img
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        if thin_type == 'standard':
            thinned = morphological_thinning(binary)
            current_img = cv2.cvtColor(thinned, cv2.COLOR_GRAY2BGR)
            snapshots.append({
                'op_key': 'thinning_standard',
                'params': {},
                'title': f'{step_counter}. Morphological Thinning',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = P \ (P hit-or-miss rotations)")
        elif thin_type == 'zhang_suen':
            thinned = zhang_suen_thinning(binary)
            current_img = cv2.cvtColor(thinned, cv2.COLOR_GRAY2BGR)
            snapshots.append({
                'op_key': 'thinning_zhang_suen',
                'params': {},
                'title': f'{step_counter}. Zhang-Suen Thinning',
                'image': image_to_base64(current_img)
            })
            formulas.append("P'(x,y) = Zhang-Suen Thinning [Iterative deletion of boundary pixels]")
            
        step_counter += 1

    # --- 6. OPERASI SEGMENTASI ---
    seg = params.get('segmentasi', {})
    seg_type = seg.get('type', 'none')
    
    if seg_type != 'none':
        if seg_type == 'threshold':
            thresh_val = int(seg.get('threshVal', 128))
            thresh_mode = seg.get('threshMode', 'binary')
            
            modes = {
                'binary': cv2.THRESH_BINARY,
                'binary_inv': cv2.THRESH_BINARY_INV,
                'trunc': cv2.THRESH_TRUNC,
                'tozero': cv2.THRESH_TOZERO,
                'tozero_inv': cv2.THRESH_TOZERO_INV
            }
            mode = modes.get(thresh_mode, cv2.THRESH_BINARY)
            
            gray = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY) if len(current_img.shape) == 3 else current_img
            _, thresh_img = cv2.threshold(gray, thresh_val, 255, mode)
            current_img = cv2.cvtColor(thresh_img, cv2.COLOR_GRAY2BGR)
            snapshots.append({
                'op_key': 'segment_threshold',
                'params': {'val': thresh_val, 'mode': thresh_mode},
                'title': f'{step_counter}. Global Thresh ({thresh_mode}:{thresh_val})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"Global Thresholding (type={thresh_mode}, val={thresh_val})")
            
        elif seg_type == 'adaptive':
            method_str = seg.get('method', 'mean')
            block_size = int(seg.get('blockSize', 3))
            const_c = int(seg.get('constC', 2))
            
            if block_size % 2 == 0: block_size += 1
            if block_size <= 1: block_size = 3
            
            method = cv2.ADAPTIVE_THRESH_MEAN_C if method_str == 'mean' else cv2.ADAPTIVE_THRESH_GAUSSIAN_C
            
            gray = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY) if len(current_img.shape) == 3 else current_img
            adaptive_img = cv2.adaptiveThreshold(gray, 255, method, cv2.THRESH_BINARY, block_size, const_c)
            current_img = cv2.cvtColor(adaptive_img, cv2.COLOR_GRAY2BGR)
            snapshots.append({
                'op_key': 'segment_adaptive',
                'params': {'method': method_str, 'block': block_size, 'c': const_c},
                'title': f'{step_counter}. Adaptive Thresh ({method_str}, {block_size}x{block_size})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"Adaptive Threshold (method={method_str}, block={block_size}, C={const_c})")
            
        elif seg_type == 'otsu':
            use_gaussian = seg.get('useGaussian', False)
            g_size = int(seg.get('gaussianSize', 5))
            if g_size % 2 == 0: g_size += 1
            
            gray = cv2.cvtColor(current_img, cv2.COLOR_BGR2GRAY) if len(current_img.shape) == 3 else current_img
            if use_gaussian:
                gray = cv2.GaussianBlur(gray, (g_size, g_size), 0)
                
            otsu_val, otsu_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            current_img = cv2.cvtColor(otsu_img, cv2.COLOR_GRAY2BGR)
            snapshots.append({
                'op_key': 'segment_otsu',
                'params': {'otsu_val': otsu_val, 'blur': use_gaussian},
                'title': f'{step_counter}. Otsu Thresh (Optimal Val: {int(otsu_val)})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"Otsu Binarization (Otsu threshold value = {int(otsu_val)})")
            
        elif seg_type == 'kmeans':
            k_clusters = int(seg.get('clusters', 3))
            if k_clusters < 1: k_clusters = 1
            
            pixel_vals = current_img.reshape((-1, 3))
            pixel_vals = np.float32(pixel_vals)
            
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            _, labels, centers = cv2.kmeans(pixel_vals, k_clusters, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            centers = np.uint8(centers)
            segmented_data = centers[labels.flatten()]
            current_img = segmented_data.reshape((current_img.shape))
            
            snapshots.append({
                'op_key': 'segment_kmeans',
                'params': {'k': k_clusters},
                'title': f'{step_counter}. K-Means Segmentation (K={k_clusters})',
                'image': image_to_base64(current_img)
            })
            formulas.append(f"K-Means Clustering Segmentation (K={k_clusters} color clusters)")
            
        step_counter += 1

    matrix_after = extract_center_matrix(current_img)
    hist_after = get_grayscale_histogram_image(current_img)
    rgb_hist_after = get_rgb_histogram_image(current_img)
    hsv_hist_after = get_hsv_histogram_image(current_img)

    if not formulas:
        formulas.append("formula.none")

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
