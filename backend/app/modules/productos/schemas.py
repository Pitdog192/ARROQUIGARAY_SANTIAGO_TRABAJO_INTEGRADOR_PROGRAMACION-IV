from typing import Optional
from pydantic import BaseModel, Field
from app.modules.categorias.schemas import CategoriaRead

class ProductoCreate(BaseModel):
    categoria_id: int
    nombre: str = Field(min_length=2, max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(ge=0)
    imagen_url: Optional[str] = None
    stock: int = Field(default=0, ge=0)
    disponible: bool = True

class ProductoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=150)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0)
    imagen_url: Optional[str] = None
    disponible: Optional[bool] = None

class ProductoStockUpdate(BaseModel):
    stock: int = Field(ge=0)
    disponible: bool

class ProductoRead(BaseModel):
    id: int
    categoria_id: int
    nombre: str
    descripcion: Optional[str]
    precio_base: float
    imagen_url: Optional[str]
    stock: int
    disponible: bool
    activo: bool
    categoria: CategoriaRead

    class Config:
        from_attributes = True

class ProductosPaginados(BaseModel):
    total: int
    items: list[ProductoRead]