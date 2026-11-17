from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.deps import get_db, require_role
from app.modules.usuarios.models import Usuario
from app.modules.auth.schemas import UserPublic

router = APIRouter(prefix="/admin/usuarios", tags=["Gestión de Usuarios (Admin)"])

@router.get("", response_model=list[UserPublic])
def listar_usuarios(
    session: Session = Depends(get_db),
    admin: Usuario = Depends(require_role(["admin"]))
):
    return list(session.exec(select(Usuario)).all())

@router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(
    id: int,
    session: Session = Depends(get_db),
    admin: Usuario = Depends(require_role(["admin"]))
):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.disabled = False
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int,
    session: Session = Depends(get_db),
    admin: Usuario = Depends(require_role(["admin"]))
):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="El administrador no puede desactivarse a si mismo")
    user.disabled = True
    session.add(user)
    session.commit()
    session.refresh(user)
    return user