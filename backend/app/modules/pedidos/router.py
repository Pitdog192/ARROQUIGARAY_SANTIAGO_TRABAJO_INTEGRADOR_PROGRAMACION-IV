from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.pedidos.service import PedidoService
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, PedidosPaginados, CambioEstado, ResumenPedidos

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())

@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(data: PedidoCreate, current_user: Usuario = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return service.crear_pedido(current_user.id, data)

@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(service: PedidoService = Depends(get_pedido_service), _ = Depends(require_role(["admin"]))):
    return service.obtener_resumen()

@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    estado: Optional[str] = None,
    current_user: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service)
):
    es_admin = current_user.role == "admin"
    return service.listar_pedidos(current_user.id, es_admin, skip, limit, estado)

@router.get("/{id}", response_model=PedidoRead)
def detalle_pedido(id: int, current_user: Usuario = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    es_admin = current_user.role == "admin"
    return service.obtener_por_id(id, current_user.id, es_admin)

@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado_admin(id: int, data: CambioEstado, service: PedidoService = Depends(get_pedido_service), _ = Depends(require_role(["admin"]))):
    return service.cambiar_estado(id, data.estado)

@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar_pedido_cliente(id: int, current_user: Usuario = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return service.cancelar_cliente(id, current_user.id)