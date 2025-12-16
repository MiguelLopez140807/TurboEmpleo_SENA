"""
Script de prueba para generar un reporte PDF mejorado
"""
import os
import sys
import django
from datetime import datetime

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mi_backend.settings')
django.setup()

from usuarios.views import ReportesViewSet
from django.test import RequestFactory
from django.contrib.auth.models import User

def test_pdf_generation():
    """Prueba la generación de reportes PDF mejorados"""
    
    # Crear una instancia del viewset
    view = ReportesViewSet()
    
    # Datos de prueba
    datos_prueba = [
        {
            'id': 1,
            'fecha': '2025-12-15T20:36:00Z',
            'estado': 'Pendiente',
            'aspirante': 'Miguel Angel Lopez Leon',
            'empresa': 'Vallejo',
            'vacante': 'Desarrollador Front-End Senior',
            'es_turbo': True
        },
        {
            'id': 2,
            'fecha': '2025-12-14T05:17:00Z',
            'estado': 'Aprobado',
            'aspirante': 'Valeria Pinzon',
            'empresa': 'Vallejo',
            'vacante': 'Desarrollador Front-End Senior',
            'es_turbo': False
        },
        {
            'id': 3,
            'fecha': '2025-12-14T06:39:00Z',
            'estado': 'Entrevista Programada',
            'aspirante': 'Valeria Pinzon',
            'empresa': 'Arturo Calle',
            'vacante': 'Gerente de Proyectos Bilingüe',
            'es_turbo': True
        }
    ]
    
    print("🚀 Generando reporte PDF mejorado...")
    
    try:
        # Generar el PDF
        response = view._export_pdf(
            datos_prueba, 
            'test_reporte_mejorado', 
            'Reporte de Postulaciones - Prueba'
        )
        
        # Guardar el archivo
        filename = f'test_reporte_mejorado_{datetime.now().strftime("%Y%m%d_%H%M")}.pdf'
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Reporte PDF generado exitosamente: {filename}")
        print(f"📄 Tamaño del archivo: {len(response.content)} bytes")
        print(f"🎯 Datos incluidos: {len(datos_prueba)} registros")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al generar el PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_pdf_generation()
    if success:
        print("\n🎉 Prueba completada exitosamente!")
        print("💡 El reporte PDF ha sido mejorado con:")
        print("   • Logo de TurboEmpleo")
        print("   • Mejor espaciado y diseño")
        print("   • Colores corporativos mejorados")
        print("   • Footer informativo")
        print("   • Iconos y emojis para mejor legibilidad")
    else:
        print("\n💥 La prueba falló. Revise los errores arriba.")