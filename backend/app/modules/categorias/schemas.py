from pydantic import BaseModel, Field

class CategoriaCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = None

class CategoriaUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None
    activo: bool | None = None

class CategoriaRead(BaseModel):
    id: int
    nombre: str
    descripcion: str | None
    activo: bool

    class Config:
        from_attributes = True