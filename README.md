# Food Store — Sistema de Pedidos de Comida (TPI Programación IV)

Aplicación web fullstack para un negocio de comidas, construida con un backend en FastAPI + SQLModel sobre PostgreSQL y un frontend en React + TypeScript + Vite estilado con Tailwind CSS. Implementa arquitectura en capas con patrón Unit of Work, autenticación mediante JWT en cookie HttpOnly, autorización por roles, manejo de estado del servidor con TanStack Query, formularios con TanStack Form, tablas con TanStack Table y estado del cliente persistido con Zustand.

## 
- **Alumno:** Santiago Arroquigaray

## Enlaces de Entrega
- **Repositorio Público de GitHub:** Todavia no grabe nada
- **Video de Demostración (10 a 15 min):** https://github.com/Pitdog192/ARROQUIGARAY_SANTIAGO_TRABAJO_INTEGRADOR_PROGRAMACION-IV

## Requisitos Previos
- **Python:** 3.11 a 3.13
- **PostgreSQL:** 15 o superior (para desarrollo local también se acepta SQLite modificando DATABASE_URL)
- **Node.js:** 20.19 o superior
- **Gestor de paquetes frontend:** pnpm 9+ o npm

## Variables de Entorno

### 1. Backend (archivo `backend/.env` creado a partir de `backend/.env.example`)
- `DATABASE_URL=postgresql+psycopg://usuario:contraseña@localhost:5432/foodstore_db`
- `SECRET_KEY=cambiar-esta-clave-secreta-de-al-menos-32-caracteres-123456`
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- `FRONTEND_ORIGIN=http://localhost:5173`

### 2. Frontend (archivo `frontend/.env` creado a partir de `frontend/.env.example`)
- `VITE_API_URL=http://localhost:8000/api/v1`

## Instalación y Ejecución del Backend

1. Abrir una terminal y ubicarse en el directorio del servidor:
    ```cd backend```

2. Crear y activar el entorno virtual:
    ```
    python -m venv venv
    source venv/Scripts/activate
    source venv/bin/activate    
    ```

3. Instalar las dependencias con versiones fijadas:
    ```pip install -r requirements.txt```

4. Crear el archivo de variables de entorno copiando la plantilla:
    ```cp .env.example .env```

5. Ejecutar el seed inicial idempotente (también se ejecuta automaticamente al iniciar la aplicación con main.py):
    ```python -m app.db.seed```

6. Levantar el servidor de desarrollo:
    ```uvicorn app.main:app --reload```

### Documentación Interactiva de la API
- **Prefijo base:** http://localhost:8000/api/v1
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Usuario Administrador Inicial (Seed)
El script `app.db.seed` es idempotente y crea automáticamente 3 categorías, 8 productos con stock disponible y la cuenta de administración:
- **Username:** `admin`
- **Password:** `Admin1234!`
- **Rol:** `admin`


## Instalación y Ejecución del Frontend

1. Abrir una nueva terminal y ubicarse en el directorio del cliente:
    ```cd frontend```

2. Crear el archivo de variables de entorno copiando la plantilla:
    ```cp .env.example .env```

3. Instalar las dependencias del proyecto:
    ``` 
    pnpm install
    ```

4. Verificar la compilación y el chequeo estricto de tipos de TypeScript:
    ```
    pnpm build
    ```

5. Iniciar el servidor de desarrollo de Vite:
    ```
    pnpm dev
    ```
    (o bien: npm run dev)

6. Abrir en el navegador:
    http://localhost:5173


## Arquitectura del Proyecto

### Backend (`backend/app/`)
- `core/`: Configuración con pydantic-settings (`config.py`), motor y sesión SQLModel (`database.py`), seguridad bcrypt y JWT (`security.py`), dependencias de autenticación/roles (`deps.py`), repositorio genérico (`base_repository.py`) y `UnitOfWork` base (`unit_of_work.py`).
- `modules/`: Módulos por dominio (`auth`, `usuarios`, `categorias`, `productos`, `pedidos`) estructurados en capas (`router.py` -> `service.py` -> `unit_of_work.py` -> `repository.py` -> `models.py` / `schemas.py`). El commit transaccional se realiza exclusivamente en el método `__exit__` del Unit of Work.
- `db/seed.py`: Carga inicial idempotente de datos.

### Frontend (`frontend/src/`)
- `shared/`: Instancia Axios con `withCredentials: true` e interceptor de errores 401/400 (`axiosInstance.ts`), traductor de errores (`handleApiError.ts`), `queryClient.ts`, componentes visuales (`ui/`, `components/`) y layout principal (`Navbar`, `MainLayout`).
- `features/`: Organización modular por dominio (`auth`, `categorias`, `productos`, `usuarios`, `pedidos`) conteniendo sus propias subcarpetas `pages/`, `components/`, `hooks/`, `api/` y `types/`.
- `store/`: Estado global en el cliente con Zustand y persistencia (`authStore.ts` con `partialize` y `cartStore.ts`).
- `routes/`: Definición de rutas (`AppRouter.tsx`) y protección por sesión y rol (`ProtectedRoute.tsx`).