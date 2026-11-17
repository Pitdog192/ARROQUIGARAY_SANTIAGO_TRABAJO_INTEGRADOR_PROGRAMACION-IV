from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from app.core.deps import require_role
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.productos.service import ProductoService
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate, ProductoStockUpdate, ProductoRead, ProductosPaginados

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())

@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    categoria_id: Optional[int] = None,
    disponible: Optional[bool] = None,
    service: ProductoService = Depends(get_producto_service)
):
    return service.listar_paginados(skip=skip, limit=limit, search=search, categoria_id=categoria_id, disponible=disponible)

@router.get("/{id}", response_model=ProductoRead)
def detalle_producto(id: int, service: ProductoService = Depends(get_producto_service)):
    return service.obtener_por_id(id)

@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, service: ProductoService = Depends(get_producto_service), _ = Depends(require_role(["admin"]))):
    return service.crear(data)

@router.put("/{id}", response_model=ProductoRead)
def actualizar_producto(id: int, data: ProductoUpdate, service: ProductoService = Depends(get_producto_service), _ = Depends(require_role(["admin"]))):
    return service.actualizar(id, data)

@router.patch("/{id}/stock", response_model=ProductoRead)
def actualizar_stock(id: int, data: ProductoStockUpdate, service: ProductoService = Depends(get_producto_service), _ = Depends(require_role(["admin"]))):
    return service.actualizar_stock(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int, service: ProductoService = Depends(get_producto_service), _ = Depends(require_role(["admin"]))):
    service.eliminar_logico(id)