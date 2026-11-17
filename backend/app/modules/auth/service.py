from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.auth.schemas import UserCreate

class AuthService:
    @staticmethod
    def register_user(session: Session, data: UserCreate) -> Usuario:
        # Verificar duplicados por username o email
        existing_user = session.exec(
            select(Usuario).where(
                (Usuario.username == data.username) | (Usuario.email == data.email)
            )
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre de usuario o correo electrónico ya se encuentran registrados"
            )
        
        db_user = Usuario(
            username=data.username,
            full_name=data.full_name,
            email=data.email,
            hashed_password=get_password_hash(data.password),
            role="user",
            disabled=False
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(session: Session, username: str, password: str) -> Usuario:
        user = session.exec(select(Usuario).where(Usuario.username == username)).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        if user.disabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cuenta de usuario desactivada"
            )
        return user