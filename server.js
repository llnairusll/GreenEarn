const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Database simulation (en producción usar MongoDB, PostgreSQL, etc.)
let users = [];
let activities = [];
let rewards = [
    { id: 'cafe', name: 'Café Gratis', description: 'Un delicioso café en tu cafetería favorita', points: 50, icon: '☕' },
    { id: 'cine', name: 'Entrada de Cine', description: 'Disfruta de tu película favorita', points: 150, icon: '🎬' },
    { id: 'descuento', name: 'Descuento 20%', description: 'En tiendas ecológicas asociadas', points: 100, icon: '🛍️' },
    { id: 'plantas', name: 'Kit de Plantas', description: 'Semillas y macetas para tu hogar', points: 200, icon: '🌱' },
    { id: 'bicicleta', name: 'Bicicleta Eléctrica', description: 'Transporte ecológico premium', points: 2000, icon: '🚴' },

];

// Servir página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes

// Registrar usuario
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // En producción: hashear la contraseña
            points: 100, // Bonus de bienvenida
            totalRecycled: 0,
            co2Saved: 0,
            streak: 0,
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        // Retornar usuario sin contraseña
        const { password: _, ...userResponse } = newUser;
        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar sesión
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Retornar usuario sin contraseña
        const { password: _, ...userResponse } = user;
        res.json({ 
            message: 'Inicio de sesión exitoso',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener perfil de usuario
app.get('/api/user/:id', (req, res) => {
    try {
        const user = users.find(u => u.id === req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const { password: _, ...userResponse } = user;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Registrar actividad de reciclaje
app.post('/api/recycle', async (req, res) => {
    try {
        const { userId, materialType, quantity } = req.body;
        
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Puntos por material
        const materialPoints = {
            plastico: 10,
            vidrio: 15,
            metal: 20,
            electronico: 50
        };
        
        const points = Math.floor(materialPoints[materialType] * quantity);
        const co2Reduction = quantity * 2.1;
        
        // Crear actividad
        const activity = {
            id: Date.now().toString(),
            userId,
            materialType,
            quantity,
            points,
            co2Reduction,
            date: new Date()
        };
        
        activities.push(activity);
        
        // Actualizar usuario
        user.points += points;
        user.totalRecycled += quantity;
        user.co2Saved += co2Reduction;
        user.streak += 1; // Simplificado
        
        res.json({
            message: 'Reciclaje registrado exitosamente',
            activity,
            newPoints: user.points,
            totalRecycled: user.totalRecycled,
            co2Saved: user.co2Saved
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener historial de actividades
app.get('/api/activities/:userId', (req, res) => {
    try {
        const userActivities = activities
            .filter(activity => activity.userId === req.params.userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 20);
        
        res.json(userActivities);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener recompensas disponibles
app.get('/api/rewards', (req, res) => {
    res.json(rewards);
});

// Canjear recompensa
app.post('/api/redeem', async (req, res) => {
    try {
        const { userId, rewardId } = req.body;
        
        const user = users.find(u => u.id === userId);
        const reward = rewards.find(r => r.id === rewardId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        if (!reward) {
            return res.status(404).json({ error: 'Recompensa no encontrada' });
        }
        
        if (user.points < reward.points) {
            return res.status(400).json({ error: 'Puntos insuficientes' });
        }
        
        // Procesar canje
        user.points -= reward.points;
        
        const redemption = {
            id: Date.now().toString(),
            userId,
            rewardId,
            rewardName: reward.name,
            pointsUsed: reward.points,
            date: new Date(),
            status: 'pending' // pending, confirmed, delivered
        };
        
        // En una app real, esto se guardaría en una tabla de canjes
        
        res.json({
            message: 'Recompensa canjeada exitosamente',
            redemption,
            remainingPoints: user.points
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener estadísticas globales
app.get('/api/stats', (req, res) => {
    try {
        const totalUsers = users.length;
        const totalActivities = activities.length;
        const totalRecycled = users.reduce((sum, user) => sum + user.totalRecycled, 0);
        const totalCO2Saved = users.reduce((sum, user) => sum + user.co2Saved, 0);
        
        res.json({
            totalUsers,
            totalActivities,
            totalRecycled: totalRecycled.toFixed(1),
            totalCO2Saved: totalCO2Saved.toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener ranking de usuarios
app.get('/api/leaderboard', (req, res) => {
    try {
        const leaderboard = users
            .map(user => ({
                id: user.id,
                name: user.name,
                points: user.points,
                totalRecycled: user.totalRecycled,
                co2Saved: user.co2Saved
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);
        
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌱 Servidor GreenEarn ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 API disponible en http://localhost:${PORT}/api`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});

module.exports = app; 