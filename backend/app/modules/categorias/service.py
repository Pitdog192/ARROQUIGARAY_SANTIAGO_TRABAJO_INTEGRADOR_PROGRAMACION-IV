from fastapi import HTTPException, status
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead

class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar_activas(self) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_all(skip=0, limit=100)
            activas = [c for c in categorias if c.activo]
            return [CategoriaRead.model_validate(c) for c in activas]

    def obtener_por_id(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(id)
            if not cat or not cat.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
            return CategoriaRead.model_validate(cat)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            existente = uow.categorias.get_by_nombre(data.nombre)
            if existente:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Nombre de categoría duplicado")
            
            from app.modules.categorias.models import Categoria
            nueva = Categoria(**data.model_dump(), activo=True)
            uow.categorias.add(nueva)
            return CategoriaRead.model_validate(nueva)

    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(id)
            if not cat or not cat.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
            
            if data.nombre and data.nombre != cat.nombre:
                duplicada = uow.categorias.get_by_nombre(data.nombre)
                if duplicada:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Nombre de categoría duplicado")

            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(cat, key, value)
            
            uow.categorias.add(cat)
            return CategoriaRead.model_validate(cat)

    def eliminar_logico(self, id: int) -> None:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(id)
            if not cat or not cat.activo:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
            cat.activo = False
            uow.categorias.add(cat)