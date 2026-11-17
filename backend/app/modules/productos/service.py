from typing import Optional
from fastapi import HTTPException, status
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate, ProductoStockUpdate, ProductoRead, ProductosPaginados

class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def listar_paginados(
        self, skip: int = 0, limit: int = 20, search: Optional[str] = None, categoria_id: Optional[int] = None, disponible: Optional[bool] = None
    ) -> ProductosPaginados:
        with self.uow as uow:
            items, total = uow.productos.search(skip=skip, limit=limit, search=search, categoria_id=categoria_id, disponible=disponible, solo_activos=True)
            return ProductosPaginados(
                total=total,
                items=[ProductoRead.model_validate(p) for p in items]
            )

    def obtener_por_id(self, id: int) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(id)
            if not p or not p.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
            return ProductoRead.model_validate(p)

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            cat = uow.session.get(uow.productos.model, data.categoria_id) if hasattr(uow.session, "get") else None
            # Validación simple de categoría existente y activa
            from app.modules.categorias.models import Categoria
            categoria = uow.session.exec(uow.session.query(Categoria).where(Categoria.id == data.categoria_id)).first() if not hasattr(uow.productos, 'session') else uow.session.get(Categoria, data.categoria_id)
            
            if not categoria or not categoria.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría inexistente o dada de baja")

            from app.modules.productos.models import Producto
            nuevo = Producto(**data.model_dump(), activo=True)
            uow.productos.add(nuevo)
            uow.session.refresh(nuevo)
            return ProductoRead.model_validate(nuevo)

    def actualizar(self, id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(id)
            if not p or not p.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

            if data.categoria_id is not None:
                from app.modules.categorias.models import Categoria
                cat = uow.session.get(Categoria, data.categoria_id)
                if not cat or not cat.activo:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="La nueva categoría no existe o está dada de baja")

            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(p, key, value)
            
            uow.productos.add(p)
            return ProductoRead.model_validate(p)

    def actualizar_stock(self, id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(id)
            if not p or not p.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
            p.stock = data.stock
            p.disponible = data.disponible
            uow.productos.add(p)
            return ProductoRead.model_validate(p)

    def eliminar_logico(self, id: int) -> None:
        with self.uow as uow:
            p = uow.productos.get_by_id(id)
            if not p or not p.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
            p.activo = False
            uow.productos.add(p)