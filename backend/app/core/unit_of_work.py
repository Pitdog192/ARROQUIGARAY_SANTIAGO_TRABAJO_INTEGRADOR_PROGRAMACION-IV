from types import TracebackType
from typing import Type
from sqlmodel import Session
from app.core.database import session_factory

class UnitOfWork:
    def __init__(self):
        self.session_factory = session_factory

    def __enter__(self) -> "UnitOfWork":
        self.session: Session = self.session_factory()
        return self

    def __exit__(
        self,
        exc_type: Type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                self.session.commit()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()