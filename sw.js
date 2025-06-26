// Service Worker para GreenEarn PWA
const CACHE_NAME = 'greenearn-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Cachando archivos');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker: Instalación completada');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Error en instalación', error);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eliminar caches antiguos
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Eliminando cache antiguo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activación completada');
            return self.clients.claim();
        })
    );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
    // Solo manejar peticiones GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Estrategia Cache First para archivos estáticos
    if (isStaticAsset(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Retorna del cache si existe
                    if (response) {
                        return response;
                    }
                    
                    // Si no está en cache, fetch de la red
                    return fetch(event.request)
                        .then((response) => {
                            // Verificar si es una respuesta válida
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            
                            // Clonar la respuesta
                            const responseToCache = response.clone();
                            
                            // Añadir al cache
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                            
                            return response;
                        });
                })
                .catch(() => {
                    // Si falla todo, mostrar página offline
                    return caches.match('/index.html');
                })
        );
    }
    
    // Estrategia Network First para APIs
    else if (isApiRequest(event.request.url)) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Si la respuesta es exitosa, cacheamos para uso offline
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Si no hay red, intentar obtener del cache
                    return caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                return response;
                            }
                            // Si no hay cache, retornar respuesta de error personalizada
                            return new Response(
                                JSON.stringify({
                                    error: 'Sin conexión',
                                    message: 'Esta funcionalidad requiere conexión a internet'
                                }),
                                {
                                    status: 503,
                                    statusText: 'Service Unavailable',
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            );
                        });
                })
        );
    }
});

// Manejar sincronización en segundo plano
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Sincronización en segundo plano', event.tag);
    
    if (event.tag === 'sync-recycling-data') {
        event.waitUntil(syncRecyclingData());
    }
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
    console.log('📱 Service Worker: Notificación push recibida');
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación de GreenEarn',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver App',
                icon: '/icon-72.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/icon-72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('GreenEarn', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Service Worker: Click en notificación', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Funciones auxiliares
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.html'];
    return staticExtensions.some(ext => url.includes(ext)) || url.endsWith('/');
}

function isApiRequest(url) {
    return url.includes('/api/');
}

async function syncRecyclingData() {
    try {
        // Obtener datos pendientes del IndexedDB o localStorage
        const pendingData = await getPendingRecyclingData();
        
        if (pendingData.length > 0) {
            console.log('📤 Service Worker: Sincronizando datos pendientes', pendingData.length);
            
            for (const data of pendingData) {
                try {
                    const response = await fetch('/api/recycle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (response.ok) {
                        await removePendingData(data.id);
                        console.log('✅ Service Worker: Datos sincronizados', data.id);
                    }
                } catch (error) {
                    console.error('❌ Service Worker: Error sincronizando', error);
                }
            }
        }
    } catch (error) {
        console.error('❌ Service Worker: Error en sincronización general', error);
    }
}

async function getPendingRecyclingData() {
    // En una implementación real, esto obtendría datos de IndexedDB
    // Por ahora retornamos array vacío
    return [];
}

async function removePendingData(id) {
    // En una implementación real, esto eliminaría datos de IndexedDB
    console.log('🗑️ Service Worker: Eliminando datos pendientes', id);
}

// Manejar errores no capturados
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker: Error no capturado', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker: Promise rechazada no manejada', event.reason);
    event.preventDefault();
}); 