from PIL import Image, ImageDraw, ImageFont
import os

def create_turboempleo_logo():
    """Crear logo de TurboEmpleo programáticamente"""
    
    # Configuración del logo
    size = (120, 120)
    bg_color = '#5e17eb'  # Turbo purple
    accent_color = '#ba54f3'  # Turbo accent
    light_color = '#d6c6f9'  # Turbo light purple
    
    # Crear imagen
    img = Image.new('RGBA', size, (0, 0, 0, 0))  # Fondo transparente
    draw = ImageDraw.Draw(img)
    
    # Dibujar círculo principal
    center = (60, 60)
    radius = 50
    draw.ellipse([center[0]-radius, center[1]-radius, 
                  center[0]+radius, center[1]+radius], 
                 fill=bg_color, outline='#4c0dcd', width=3)
    
    # Dibujar círculo interno decorativo
    inner_radius = 42
    draw.ellipse([center[0]-inner_radius, center[1]-inner_radius,
                  center[0]+inner_radius, center[1]+inner_radius], 
                 fill=None, outline=accent_color, width=2)
    
    # Intentar cargar fuente, usar default si no está disponible
    try:
        font_large = ImageFont.truetype("arial.ttf", 16)
        font_small = ImageFont.truetype("arial.ttf", 12)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Dibujar texto TURBO
    turbo_text = "TURBO"
    turbo_bbox = draw.textbbox((0, 0), turbo_text, font=font_large)
    turbo_width = turbo_bbox[2] - turbo_bbox[0]
    turbo_x = center[0] - turbo_width // 2
    draw.text((turbo_x, 35), turbo_text, fill='white', font=font_large)
    
    # Dibujar texto EMPLEO
    empleo_text = "EMPLEO"
    empleo_bbox = draw.textbbox((0, 0), empleo_text, font=font_small)
    empleo_width = empleo_bbox[2] - empleo_bbox[0]
    empleo_x = center[0] - empleo_width // 2
    draw.text((empleo_x, 55), empleo_text, fill='white', font=font_small)
    
    # Dibujar puntos decorativos
    draw.ellipse([47, 77, 53, 83], fill='white')  # Centro
    draw.ellipse([38, 77, 42, 81], fill=light_color)  # Izquierda
    draw.ellipse([68, 77, 72, 81], fill=light_color)  # Derecha
    
    # Dibujar línea decorativa
    draw.line([(25, 85), (95, 85)], fill=accent_color, width=2)
    
    # Dibujar esquinas decorativas
    corner_size = 3
    corners = [(20, 15), (95, 15), (20, 95), (95, 95)]
    for x, y in corners:
        draw.rectangle([x, y, x+corner_size, y+corner_size], fill=light_color)
    
    return img

def save_logo():
    """Guardar logo en formato PNG"""
    logo = create_turboempleo_logo()
    
    # Crear directorio si no existe
    static_dir = os.path.join(os.path.dirname(__file__), 'static', 'img')
    os.makedirs(static_dir, exist_ok=True)
    
    # Guardar logo
    logo_path = os.path.join(static_dir, 'logo_turboempleo.png')
    logo.save(logo_path, 'PNG')
    
    print(f"Logo guardado en: {logo_path}")
    return logo_path

if __name__ == "__main__":
    save_logo()