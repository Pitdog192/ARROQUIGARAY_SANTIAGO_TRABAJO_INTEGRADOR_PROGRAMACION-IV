from typing import Generic, TypeVar, Type, List, Optional
from sqlmodel import Session, SQLModel, select

T = TypeVar("T", bound=SQLModel)

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, id: int) -> Optional[T]:
        """Obtiene un registro por su ID primario."""
        return self.session.get(self.model, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Obtiene una lista paginada de registros."""
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def add(self, entity: T) -> T:
        """Agrega un registro a la sesion pendiente de commit por el Unit of work."""
        self.session.add(entity)
        self.session.flush()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        """Marca un registro para eliminación en la sesión."""
        self.session.delete(entity)
        self.session.flush()