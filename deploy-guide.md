# 📱 Guía: Convertir GreenEarn a APK

## 🎯 **MÉTODO 1: PWA Builder (RECOMENDADO - GRATIS)**

### **Paso 1: Subir a GitHub Pages**

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com
   - Crea nuevo repositorio "greenearn-app"
   - Marca como público

2. **Subir archivos:**
   ```bash
   git init
   git add .
   git commit -m "GreenEarn PWA inicial"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/greenearn-app.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Ir a Settings > Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

4. **Tu app estará en:**
   `https://TU-USUARIO.github.io/greenearn-app/`

### **Paso 2: Generar APK con PWA Builder**

1. **Ir a:** https://www.pwabuilder.com/

2. **Ingresar tu URL:** `https://TU-USUARIO.github.io/greenearn-app/`

3. **Click "Start"**

4. **Revisar PWA Score** (debería ser alto)

5. **Ir a "Package For Stores"**

6. **Seleccionar "Android"**

7. **Configurar opciones:**
   - **Package ID:** `com.greenearn.app`
   - **App Name:** `GreenEarn`
   - **Version:** `1.0.0`
   - **Min SDK:** `21` (Android 5.0+)
   - **Target SDK:** `33` (Android 13)

8. **Click "Generate Package"**

9. **Descargar APK** (tardará 2-5 minutos)

### **Paso 3: Instalar APK**

1. **En tu teléfono Android:**
   - Habilitar "Fuentes desconocidas"
   - Descargar e instalar APK

2. **Probar funcionalidades:**
   - ✅ Registro de usuarios
   - ✅ Reciclaje de materiales
   - ✅ Sistema de puntos
   - ✅ Canje de recompensas
   - ✅ Funciona offline

---

## ⚡ **MÉTODO 2: Capacitor (AVANZADO)**

### **Instalación:**
```bash
npm install -g @ionic/cli
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### **Inicialización:**
```bash
npx cap init "GreenEarn" "com.greenearn.app"
npx cap add android
```

### **Configuración capacitor.config.ts:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.greenearn.app',
  appName: 'GreenEarn',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#63caa1",
      showSpinner: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#63caa1"
    }
  }
};

export default config;
```

### **Build:**
```bash
npx cap copy
npx cap sync
npx cap open android
```

### **En Android Studio:**
1. **Build > Generate Signed Bundle/APK**
2. **Seleccionar APK**
3. **Crear keystore (primera vez)**
4. **Build APK**

---

## 🤖 **MÉTODO 3: Bubblewrap (GOOGLE)**

### **Instalación:**
```bash
npm install -g @bubblewrap/cli
```

### **Inicialización:**
```bash
bubblewrap init --manifest https://TU-USUARIO.github.io/greenearn-app/manifest.json
```

### **Build:**
```bash
bubblewrap build
```

---

## 📋 **CHECKLIST ANTES DE GENERAR APK**

### **Archivos Requeridos:**
- ✅ `index.html` - Página principal
- ✅ `manifest.json` - Configuración PWA
- ✅ `sw.js` - Service Worker
- ✅ `styles.css` - Estilos
- ✅ `script.js` - JavaScript
- ✅ Iconos (192x192, 512x512)

### **Configuración Manifest:**
- ✅ `name` y `short_name`
- ✅ `start_url`: "/"
- ✅ `display`: "standalone"
- ✅ `theme_color`: "#63caa1"
- ✅ `background_color`: "#f8f9fa"
- ✅ `icons` con diferentes tamaños
- ✅ `id`: "com.greenearn.app"

### **Funcionalidades a Probar:**
- ✅ Instalación como PWA
- ✅ Funciona offline
- ✅ Service Worker activo
- ✅ Responsive design
- ✅ Performance optimizada

---

## 🚀 **PUBLICAR EN GOOGLE PLAY STORE**

### **Requisitos:**
1. **Cuenta de desarrollador:** $25 USD (una vez)
2. **APK firmado** con keystore
3. **Íconos** de alta resolución
4. **Screenshots** de la app
5. **Descripción** de la app
6. **Política de privacidad**

### **Proceso:**
1. **Crear app en Play Console**
2. **Subir APK firmado**
3. **Completar información**
4. **Revisión (2-3 días)**
5. **Publicación**

---

## 🎨 **ICONOS REQUERIDOS**

Para mejor resultado, crear iconos reales:

### **Tamaños Necesarios:**
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

### **Herramientas:**
- **Canva:** Para diseño fácil
- **Figma:** Para diseño profesional
- **PWA Asset Generator:** Generación automática

---

## 💡 **TIPS IMPORTANTES**

### **Para Mejor Performance:**
- Optimizar imágenes
- Minimizar CSS/JS
- Habilitar compresión
- Cache strategy eficiente

### **Para Play Store:**
- Íconos de alta calidad
- Screenshots atractivos
- Descripción en español
- Keywords relevantes
- Política de privacidad

### **Testing:**
- Probar en diferentes dispositivos
- Verificar funcionalidad offline
- Revisar responsive design
- Testear en redes lentas

---

## 📞 **¿NECESITAS AYUDA?**

Si tienes problemas:
1. Revisar logs de PWA Builder
2. Validar manifest.json
3. Verificar Service Worker
4. Consultar documentación oficial

**¡Tu app GreenEarn está lista para convertirse en APK! 🎉** 