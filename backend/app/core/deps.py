from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario

def get_db() -> Session:
    """Provee una sesión de base de datos independiente para endpoints generales."""
    with session_factory() as session:
        yield session

def get_current_user(
    session: Session = Depends(get_db),
    access_token: str | None = Cookie(default=None)
) -> Usuario:
    """Lee la cookie HttpOnly, valida el JWT y retorna el usuario autenticado, 401 si falla."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas o ausentes",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not access_token:
        raise credentials_exception
    
    payload = decode_access_token(access_token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    statement = select(Usuario).where(Usuario.username == username)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: Usuario = Depends(get_current_user)
) -> Usuario:
    """Rechaza con codigo 400 a los usuarios con cuenta desactivada."""
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada"
        )
    return current_user

def require_role(allowed_roles: list[str]):
    """Verifica que el usuario activo posea uno de los roles permitidos, 403 si no"""
    def role_verifier(current_user: Usuario = Depends(get_current_active_user)) -> Usuario:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso prohibido para el rol del usuario"
            )
        return current_user
    return role_verifier