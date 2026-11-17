from datetime import datetime, timezone
from typing import List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.modules.usuarios.models import Usuario
    from app.modules.productos.models import Producto

class Pedido(SQLModel, table=True):
    __tablename__ = "pedido"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", nullable=False)
    estado: str = Field(default="PENDIENTE", nullable=False)  # PENDIENTE, EN_PREPARACION, ENTREGADO, CANCELADO
    forma_pago: str = Field(nullable=False)  # EFECTIVO o TRANSFERENCIA
    direccion_entrega: str = Field(nullable=False, max_length=200)
    notas: str | None = Field(default=None)
    total: float = Field(default=0.0, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )

    # Relaciones
    usuario: "Usuario" = Relationship(back_populates="pedidos")
    items: List["DetallePedido"] = Relationship(back_populates="pedido", sa_relationship_kwargs={"cascade": "all, delete-orphan"})


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id", nullable=False)
    producto_id: int = Field(foreign_key="producto.id", nullable=False)
    cantidad: int = Field(nullable=False, ge=1)
    nombre_producto: str = Field(nullable=False)  
    precio_unitario: float = Field(nullable=False)
    subtotal: float = Field(nullable=False)

    # Relaciones
    pedido: "Pedido" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="detalles")