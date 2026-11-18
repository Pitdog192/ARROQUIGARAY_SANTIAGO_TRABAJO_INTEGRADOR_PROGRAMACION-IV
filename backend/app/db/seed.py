from sqlmodel import select
from app.core.database import create_all_tables, session_factory
from app.core.security import get_password_hash
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto

def seed_database():
    create_all_tables()
    with session_factory() as session:
        # usuario admin por defecto si no existe
        admin_user = session.exec(select(Usuario).where(Usuario.username == "admin")).first()
        if not admin_user:
            admin_user = Usuario(
                username="admin",
                full_name="Administrador General",
                email="admin@foodstore.com",
                hashed_password=get_password_hash("Admin1234!"),
                role="admin",
                disabled=False
            )
            session.add(admin_user)
            print("-> Usuario admin creado.")

        # categorias iniciales
        categorias_data = [
            ("Hamburguesas", "Hamburguesas artesanales completas"),
            ("Pizzas", "Pizzas a la piedra de variados gustos"),
            ("Bebidas", "Gaseosas, cervezas y jugos naturales")
        ]
        
        categorias_objs = {}
        for nombre, desc in categorias_data:
            cat = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if not cat:
                cat = Categoria(nombre=nombre, descripcion=desc, activo=True)
                session.add(cat)
                session.commit()
                session.refresh(cat)
                print(f"-> Categoría creada: {nombre}")
            categorias_objs[nombre] = cat

        # productos iniciales con stock
        productos_data = [
            ("Hamburguesa Completa", "Medallón de carne, lechuga, tomate, cheddar y bacon", 4500.0, 20, categorias_data[0][0]),
            ("Hamburguesa Doble", "Doble carne, doble cheddar y salsa especial", 5500.0, 15, categorias_data[0][0]),
            ("Pizza Muzza", "Muzzarella, aceitunas y orégano", 8000.0, 10, categorias_data[1][0]),
            ("Pizza Especial", "Muzzarella, jamón, morrones y aceitunas", 9500.0, 8, categorias_data[1][0]),
            ("Coca Cola 1.5L", "Gaseosa línea Coca Cola retornable", 2200.0, 30, categorias_data[2][0]),
            ("Cerveza Heineken 1L", "Cerveza rubia tirada/retornable", 3000.0, 25, categorias_data[2][0]),
            ("Cerveza Brama 1L", "Cerveza rubia tirada", 3500.0, 25, categorias_data[2][0]),
            ("Cerveza Quilmes 1L", "Cerveza Negra", 1500.0, 25, categorias_data[2][0]),
        ]

        for nombre, desc, precio, stock, cat_nombre in productos_data:
            prod = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if not prod:
                cat_id = categorias_objs[cat_nombre].id
                prod = Producto(
                    nombre=nombre,
                    descripcion=desc,
                    precio_base=precio,
                    stock=stock,
                    disponible=True,
                    activo=True,
                    categoria_id=cat_id
                )
                session.add(prod)
                print(f"-> Producto creado: {nombre}")

        session.commit()
        print("¡Seed ejecutado exitosamente de forma idempotente!")

if __name__ == "__main__":
    seed_database()