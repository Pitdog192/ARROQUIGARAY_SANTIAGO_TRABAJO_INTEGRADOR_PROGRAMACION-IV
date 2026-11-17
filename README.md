# Trabajo Práctico Integrador - Food Store (Programación IV)
## Requisitos Previos

* Python (versión recomendada entre 3.11 y 3.13)
* Node.js (versión 18.x o superior) y npm
* PostgreSQL (versión 15 o superior en ejecución local)
* Git


## Variables de Entorno (.env)

Crear un archivo llamado .env dentro de la carpeta backend/ completando las variables de configuración correspondientes (DATABASE_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES y FRONTEND_ORIGIN).

```env
DATABASE_URL=postgresql+psycopg://<usuario>:<contraseña>@localhost:5432/foodstore_db
SECRET_KEY=clave-secreta-super-segura-y-extensa-para-jwt-min-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
```

## Instalación y Ejecución
### 1. Clonar el repositorio y posicionarse en la raíz

```
git clone https://github.com/Pitdog192/ARROQUIGARAY_SANTIAGO_TRABAJO_INTEGRADOR_PROGRAMACION-IV.git
cd ARROQUIGARAY_SANTIAGO_TRABAJO_INTEGRADOR_PROGRAMACION-IV
```


### 2. Configuración y Ejecución del Backend

Abrir una terminal y dirigirse a la carpeta backend/ con cd backend

#### A. Crear y activar el entorno virtual
* En Windows (Git Bash / PowerShell):
    ```bash
        python -m venv venv
        source venv/Scripts/activate
    ```
* En Linux / macOS:
    ```
        python3 -m venv venv
        source venv/bin/activate
    ```

#### B. Instalar las dependencias fijadas
pip install -r requirements.txt

#### C. Inicializar la Base de Datos y ejecutar el Script Semilla (Seed)
Este comando va a crear todas las tablas en PostgreSQL y poblará la base de datos de forma idempotente con categorías, productos con stock y el usuario administrador:

```
python -m app.db.seed
```

#### D. Iniciar el servidor de desarrollo del Backend

```
uvicorn app.main:app --reload
```

* El servidor estará disponible en: http://localhost:127.0.0.1:8000
* Documentación interactiva (Swagger UI): http://localhost:127.0.0.1:8000/docs
* Documentación interactiva (ReDoc): http://localhost:127.0.0.1:8000/redoc


### 3. Configuración y Ejecución del Frontend

Abrir una nueva pestaña o ventana de terminal, independiente de la del backend y dirigirse a la carpeta del front con cd frontend

#### A. Instalar las dependencias de Node
```
npm install
```

#### B. Iniciar el entorno de desarrollo del Frontend
```
npm run dev
```

Y la aplicación frontend va a estar disponible en: http://localhost:5173

## Usuario Administrador por Defecto del seed

El script de inicialización seed.py va a generar un usuario con privilegios de administrador para la gestión y pruebas del sistema:

* Usuario / Username: admin
* Contraseña / Password: Admin1234!
* Rol: admin