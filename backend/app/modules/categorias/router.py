from fastapi import APIRouter, Depends, status
from app.core.deps import require_role
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.categorias.service import CategoriaService
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead

router = APIRouter(prefix="/categorias", tags=["Categorías"])

def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())

@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar_activas()

@router.get("/{id}", response_model=CategoriaRead)
def detalle_categoria(id: int, service: CategoriaService = Depends(get_categoria_service)):
    return service.obtener_por_id(id)

@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, service: CategoriaService = Depends(get_categoria_service), _ = Depends(require_role(["admin"]))):
    return service.crear(data)

@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(id: int, data: CategoriaUpdate, service: CategoriaService = Depends(get_categoria_service), _ = Depends(require_role(["admin"]))):
    return service.actualizar(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int, service: CategoriaService = Depends(get_categoria_service), _ = Depends(require_role(["admin"]))):
    service.eliminar_logico(id)