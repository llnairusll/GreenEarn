# 🌱 GreenEarn - Aplicación de Recompensas por Reciclaje

## 📖 Descripción

GreenEarn es una aplicación web progresiva (PWA) que permite a los usuarios ganar puntos y recompensas por sus actividades de reciclaje. La aplicación está diseñada con un enfoque mobile-first y funciona tanto online como offline.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Registro de Reciclaje**: Registra diferentes tipos de materiales reciclados
- **Sistema de Puntos**: Gana puntos por cada kilogramo reciclado
- **Tienda de Recompensas**: Canjea puntos por premios reales
- **Seguimiento de Progreso**: Visualiza tu impacto ambiental
- **Sistema de Logros**: Desbloquea insignias por tus actividades
- **Perfil de Usuario**: Gestiona tu cuenta y estadísticas

### 📱 Características Técnicas
- **PWA (Progressive Web App)**: Instalable en dispositivos móviles
- **Offline First**: Funciona sin conexión a internet
- **Responsive Design**: Optimizada para móviles y tablets
- **API RESTful**: Backend con Node.js y Express
- **LocalStorage**: Persistencia de datos local
- **Service Worker**: Caché inteligente y sincronización

## 🏗️ Arquitectura del Proyecto

```
app/
├── index.html          # Página principal HTML
├── styles.css          # Estilos CSS separados
├── script.js           # JavaScript del cliente
├── server.js           # Servidor Node.js con Express
├── sw.js              # Service Worker para PWA
├── manifest.json      # Manifiesto PWA
├── package.json       # Dependencias Node.js
└── README.md          # Esta documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- npm (v6 o superior)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/familia-valero/greenearn.git
   cd greenearn/app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   # Producción
   npm start
   
   # Desarrollo (con auto-reload)
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:3000`

## 📊 API Endpoints

### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/user/:id` - Obtener perfil de usuario

### Reciclaje
- `POST /api/recycle` - Registrar actividad de reciclaje
- `GET /api/activities/:userId` - Obtener historial de actividades

### Recompensas
- `GET /api/rewards` - Obtener recompensas disponibles
- `POST /api/redeem` - Canjear recompensa

### Estadísticas
- `GET /api/stats` - Estadísticas globales
- `GET /api/leaderboard` - Ranking de usuarios
- `GET /api/health` - Estado del servidor

## 🎮 Sistema de Puntos

| Material | Puntos por kg |
|----------|---------------|
| 🥤 Plástico | 10 puntos |
| 📄 Papel | 5 puntos |
| 🍺 Vidrio | 15 puntos |
| 🥫 Metal | 20 puntos |
| 📱 Electrónico | 50 puntos |

## 🏆 Sistema de Logros

- **🌟 Primer Centenar** - Alcanzar 100 puntos
- **⭐ Estrella Verde** - Alcanzar 500 puntos
- **💎 Diamante Ecológico** - Alcanzar 1000 puntos
- **♻️ Reciclador Novato** - Reciclar 5kg
- **🏆 Reciclador Experto** - Reciclar 20kg
- **👑 Eco Campeón** - Reciclar 50kg
- **🔥 Racha Iniciada** - 3 días consecutivos
- **🔥 Racha Semanal** - 7 días consecutivos
- **💪 Eco Warrior** - 30 días consecutivos

## 🛍️ Recompensas Disponibles

- ☕ **Café Gratis** (50 puntos)
- 🎬 **Entrada de Cine** (150 puntos)
- 🛍️ **Descuento 20%** (100 puntos)
- 🌱 **Kit de Plantas** (200 puntos)
- 🚴 **Bicicleta Eléctrica** (2000 puntos)
- 💰 **$10 USD** (500 puntos)

## 📱 Instalación como PWA

### En Android (Chrome):
1. Abrir la aplicación en Chrome
2. Tocar el menú (⋮) y seleccionar "Instalar aplicación"
3. Confirmar instalación

### En iOS (Safari):
1. Abrir la aplicación en Safari
2. Tocar el botón compartir (□↗)
3. Seleccionar "Agregar a pantalla de inicio"

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo
npm test           # Ejecutar pruebas
npm run build      # Construir para producción
```

### Variables de Entorno
Crear archivo `.env` con:
```env
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000/api
```

### Estructura de Datos

#### Usuario
```javascript
{
  id: "string",
  name: "string",
  email: "string",
  points: number,
  totalRecycled: number,
  co2Saved: number,
  streak: number,
  createdAt: Date
}
```

#### Actividad de Reciclaje
```javascript
{
  id: "string",
  userId: "string",
  materialType: "string",
  quantity: number,
  points: number,
  co2Reduction: number,
  date: Date
}
```

## 🌍 Impacto Ambiental

La aplicación calcula automáticamente:
- **CO2 Ahorrado**: ~2.1kg CO2 por kg de material reciclado
- **Impacto Global**: Suma de todos los usuarios
- **Estadísticas**: Tracking del impacto colectivo

## 🚀 Futuras Mejoras

### Próximas Características
- [ ] Integración con redes sociales
- [ ] Desafíos y competencias
- [ ] Mapa de centros de reciclaje
- [ ] Notificaciones push personalizadas
- [ ] Sistema de referidos
- [ ] Integración con dispositivos IoT
- [ ] Blockchain para verificación
- [ ] Marketplace de productos eco-friendly

### Mejoras Técnicas
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT
- [ ] Tests automatizados
- [ ] CI/CD Pipeline
- [ ] Docker containerización
- [ ] Monitoring y analytics
- [ ] Escalabilidad horizontal

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Familia Valero** - Desarrollo inicial y concepto
- **Comunidad Open Source** - Contribuciones y mejoras

## 📞 Contacto

- **Email**: help@greenearn.com
- **Website**: https://greenearn.app
- **GitHub**: https://github.com/familia-valero/greenearn

## 🙏 Agradecimientos

- Comunidad de desarrolladores JavaScript
- Usuarios beta testers
- Organizaciones ambientales colaboradoras

---

**¡Gracias por contribuir a un mundo más verde! 🌱** 