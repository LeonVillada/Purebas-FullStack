# MedPrescribe - Sistema de Gestión de Prescripciones Médicas 🏥

Este es un proyecto Full Stack desarrollado como una prueba técnica de alto nivel, utilizando tecnologías modernas y siguiendo las mejores prácticas de arquitectura de software.

## 🚀 Tecnologías Utilizadas

### Backend
- **Framework:** NestJS (TypeScript)
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Seguridad:** Passport JWT & Bcrypt
- **Generación de Reportes:** PDFKit (Generación de PDFs en el servidor)
- **Validación:** Class-validator & Class-transformer

### Frontend
- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Gestión de Sesión:** Axios & JS-Cookie
- **Diseño:** UX/UI Premium con soporte para Dark Mode

### Infraestructura
- **Orquestación:** Docker & Docker Compose

---

## 🛠️ Instalación y Configuración

### 1. Requisitos Previos
- Docker Desktop
- Node.js (v18 o superior)

### 2. Levantar la Base de Datos
En la raíz del proyecto, ejecuta:
```bash
docker-compose up -d
```

### 3. Configurar el Backend
```bash
cd backend
npm install
# Ejecutar migraciones y semilla (poblar DB)
npx prisma migrate dev
node prisma/seed.js
# Iniciar servidor
npm run start:dev
```
*El servidor correrá en http://localhost:3001*

### 4. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev
```
*La aplicación correrá en http://localhost:3000*

---

## 👥 Usuarios de Prueba

Todos los usuarios tienen la contraseña: `admin123`

1. **Administrador:** `admin@test.com` (Acceso a estadísticas y auditoría)
2. **Médico:** `doctor@test.com` (Puede crear prescripciones)
3. **Paciente:** `patient@test.com` (Puede ver y consumir sus recetas)

---

## ✨ Características Destacadas (Plus)

- **Auditoría Global:** Sistema de logs que registra cada acción crítica (creación y consumo de recetas).
- **Seguridad por Roles:** Protección de rutas mediante Guards tanto en Backend como en Frontend.
- **Trazabilidad:** Seguimiento detallado del estado de las prescripciones (ACTIVA / CONSUMIDA).
- **Generación de PDFs:** Las recetas se generan en tiempo real desde el servidor para mayor seguridad.
- **UX Premium:** Interfaz responsiva, limpia y con micro-interacciones.

---
*Desarrollado para la Prueba Técnica Fullstack.*
