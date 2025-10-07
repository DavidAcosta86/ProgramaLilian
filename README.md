# Programa Lilian - Backend & Frontend

Plataforma web para Programa Lilian - Apoyo oncológico y recaudación de fondos.

## Arquitectura

Este proyecto está dockerizado y consta de los siguientes servicios:

- **Backend**: Spring Boot API REST (Java 17, MySQL, RabbitMQ)
- **Frontend**: Next.js aplicación web (React, TypeScript, TailwindCSS)
- **MySQL**: Base de datos principal
- **RabbitMQ**: Sistema de mensajes para emails asíncronos
- **phpMyAdmin**: Interfaz web para gestión de base de datos (opcional)

## Requisitos Previos

- Docker Desktop (Versión 4.0+)
- Git
- 4GB RAM disponible
- Puertos libres: 3000, 8080, 3306, 5672, 15672, 8081

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone [repository-url]
cd ProgramaLilian
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales:

```env
# Reemplaza con tus APIs reales
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
MP_ACCESS_TOKEN=tu-mercadopago-token
GMAIL_USERNAME=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-app-password
```

### 3. Levantar Servicios con Docker

```bash
# Construir e iniciar todo
docker-compose up --build
```

### 4. Acceder a las Aplicaciones

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **phpMyAdmin**: http://localhost:8081

### 5. Primer Uso

1. Crea las bases de datos: `docker-compose exec backend ./mvnw liquibase:update` (o consulta guías)
2. Accede al admin del backend para configurar
3. Ingresa a Strapi para gestionar contenido (una vez implementado)

## Desarrollo Local

### Sin Docker (requiere JDK 17 y Node.js)

#### Backend

```bash
cd Backend
./mvnw spring-boot:run
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Guías de Configuración

Consulta las guías detalladas en `Context/`:

- [Configuración Gmail SMTP](Context/README-GMAIL-SETUP.md)
- [Google OAuth2 Setup](Context/README-GOOGLE-OAUTH.md)
- [Mercado Pago Configuración](Context/README-MERCADO-PAGO.md)
- [Docker y Desarrollo](Context/README-DOCKER-SETUP.md)
- [Testing y JaCoCo](Context/README-TESTING.md)

## Estructura del Proyecto

```
ProgramaLilian/
├── Backend/                 # Spring Boot API
│   ├── src/                 # Código fuente Java
│   ├── pom.xml              # Maven configuration
│   └── Dockerfile           # Backend container
├── Frontend/                # Next.js Web App
│   ├── src/                 # React/Next.js code
│   ├── package.json         # NPM dependencies
│   └── Dockerfile           # Frontend container
├── Context/                 # Documentación y guías
├── docker-compose.yml       # Docker orchestration
├── .env.example            # Template variables
└── README.md               # Este archivo
```

## Testing

### Backend - JaCoCo Coverage 80%+

```bash
cd Backend
./mvnw test jacoco:report
open target/site/jacoco/index.html
```

### Frontend

```bash
cd Frontend
npm test
```

## Despliegue Producción

### Variables Adicionales para Producción

```env
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-prod-db-host
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
DOMAIN=https://tu-dominio.com
```

### Servicios de Hosting Recomendados

- **Backend**: Heroku, Railway, DigitalOcean App Platform
- **Frontend**: Vercel, Netlify, Railway
- **Database**: PlanetScale, Railway, AWS RDS
- **Mensajería**: CloudAMQP, Railway

## Estados de los Servicios

### Health Checks

- **Backend**: http://localhost:8080/actuator/health
- **Database**: Verificar connectividad MySQL
- **RabbitMQ**: http://localhost:15672

## Troubleshooting

### Problemas Comunes

1. **Puerto ocupado**: Verifica que los puertos estén libres
2. **Error de conexión BD**: Espera que MySQL esté healthy
3. **Gmail bloqueado**: Usa "App Passwords" no la contraseña normal
4. **Memoria insuficiente**: Aumenta RAM en Docker Desktop (4GB+)

### Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs mysql
```

## Próximos Pasos

1. Implementar entidades JPA y servicios core
2. Configurar autenticación y seguridad
3. Integrar Mercado Pago
4. Implementar sistema de email con RabbitMQ
5. Crear panel de administración
6. Test end-to-end y desplegar

## Contribuir

1. Crea un branch para tu feature
2. Sigue TDD - escribe tests primero
3. Mantén cobertura >80% en backend
4. Comenta en inglés en código
5. Actualiza documentación

## Licencia

[Tu licencia aquí]

---

**Desarrollado con ❤️ para Programa Lilian**
