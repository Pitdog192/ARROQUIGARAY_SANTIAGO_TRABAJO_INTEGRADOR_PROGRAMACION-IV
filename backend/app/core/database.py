import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("¡Cuidado! No se encontró DATABASE_URL en el archivo .env")

engine = create_engine(DATABASE_URL, echo=True)

def create_all_tables():
    """Crea todas las tablas definidas en los modelos SQLModel y registra los mappers."""
    from app.modules.usuarios.models import Usuario
    from app.modules.categorias.models import Categoria
    from app.modules.productos.models import Producto
    from app.modules.pedidos.models import Pedido, DetallePedido

    SQLModel.metadata.create_all(engine)

def session_factory() -> Session:
    """Fábrica para obtener una nueva sesión de base de datos."""
    return Session(engine)