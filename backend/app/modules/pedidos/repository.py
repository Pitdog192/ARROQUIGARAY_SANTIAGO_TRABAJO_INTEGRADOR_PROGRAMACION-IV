from typing import List, Optional
from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido

class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session):
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: Optional[int] = None,
        estado: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Pedido], int]:
        """Lista pedidos filtrando opcionalmente por usuario y/o estado, con paginación."""
        statement = select(Pedido)
        count_statement = select(func.count(Pedido.id))

        if usuario_id is not None:
            statement = statement.where(Pedido.usuario_id == usuario_id)
            count_statement = count_statement.where(Pedido.usuario_id == usuario_id)

        if estado is not None:
            statement = statement.where(Pedido.estado == estado)
            count_statement = count_statement.where(Pedido.estado == estado)

        total = self.session.exec(count_statement).first() or 0
        items = list(self.session.exec(statement.offset(skip).limit(limit).order_by(Pedido.created_at.desc())).all())
        
        return items, total