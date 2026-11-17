from typing import Optional
from sqlmodel import select
from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session):
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        """Busca una categoría por su nombre exacto (clave única)."""
        statement = select(Categoria).where(Categoria.nombre == nombre)
        return self.session.exec(statement).first()