from typing import List, Optional
from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(session, Producto)

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
        solo_activos: bool = True
    ) -> tuple[List[Producto], int]:
        """Listado paginado de productos con filtros de búsqueda, categoría y disponibilidad."""
        statement = select(Producto)
        count_statement = select(func.count(Producto.id))

        if solo_activos:
            statement = statement.where(Producto.activo == True)
            count_statement = count_statement.where(Producto.activo == True)

        if search:
            filtro_nombre = Producto.nombre.ilike(f"%{search}%")
            statement = statement.where(filtro_nombre)
            count_statement = count_statement.where(filtro_nombre)

        if categoria_id is not None:
            statement = statement.where(Producto.categoria_id == categoria_id)
            count_statement = count_statement.where(Producto.categoria_id == categoria_id)

        if disponible is not None:
            statement = statement.where(Producto.disponible == disponible)
            count_statement = count_statement.where(Producto.disponible == disponible)

        total = self.session.exec(count_statement).first() or 0
        items = list(self.session.exec(statement.offset(skip).limit(limit)).all())
        
        return items, total