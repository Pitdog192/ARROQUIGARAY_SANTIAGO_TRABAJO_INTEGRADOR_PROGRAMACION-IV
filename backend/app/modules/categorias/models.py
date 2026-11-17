from typing import List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.modules.productos.models import Producto

class Categoria(SQLModel, table=True):
    __tablename__ = "categoria"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, nullable=False, max_length=100)
    descripcion: str | None = Field(default=None)
    activo: bool = Field(default=True, nullable=False)

    # Relación 1:N con Producto
    productos: List["Producto"] = Relationship(back_populates="categoria")