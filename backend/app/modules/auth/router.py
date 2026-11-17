from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app.core.database import session_factory
from app.core.security import create_access_token
from app.core.deps import get_current_active_user, get_db
from app.modules.auth.schemas import UserCreate, UserPublic
from app.modules.auth.service import AuthService
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: Session = Depends(get_db)):
    return AuthService.register_user(session, data)

@router.post("/token")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(session, form_data.username, form_data.password)
    access_token = create_access_token(data={"sub": user.username})
    
    # Cookie HttpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # En prod pasar a true si se usa HTTPS
        samesite="lax",
        max_age=1800  # Esto son 30min
    )
    return {"message": "Login exitoso"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logout exitoso"}

@router.get("/me", response_model=UserPublic)
def read_users_me(current_user: Usuario = Depends(get_current_active_user)):
    return current_user