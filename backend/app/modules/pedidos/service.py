from typing import Optional, List
from fastapi import HTTPException, status
from sqlmodel import select, func
from datetime import datetime, timezone
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.pedidos.models import Pedido, DetallePedido
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos

class PedidoService:
    TRANSICIONES_VALIDAS = {
        "PENDIENTE": ["EN_PREPARACION", "CANCELADO"],
        "EN_PREPARACION": ["ENTREGADO", "CANCELADO"],
        "ENTREGADO": [],
        "CANCELADO": []
    }

    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear_pedido(self, usuario_id: int, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            # Validar productos repetidos
            ids_productos = [item.producto_id for item in data.items]
            if len(ids_productos) != len(set(ids_productos)):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se permiten productos repetidos en el pedido")

            # Crear el pedido en PENDIENTE con total 0
            nuevo_pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0.0
            )
            uow.pedidos.add(nuevo_pedido)
            uow.session.flush()

            total_calculado = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if not producto or not producto.activo:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Producto con ID {item.producto_id} no encontrado o inactivo")
                if not producto.disponible:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"El producto '{producto.nombre}' no está disponible")
                if producto.stock < item.cantidad:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Stock insuficiente para el producto '{producto.nombre}'")

                # Descontar stock
                producto.stock -= item.cantidad
                uow.productos.add(producto)

                # Crear detalle inmutable
                subtotal = producto.precio_base * item.cantidad
                total_calculado += subtotal

                detalle = DetallePedido(
                    pedido_id=nuevo_pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal
                )
                uow.session.add(detalle)

            nuevo_pedido.total = total_calculado
            uow.pedidos.add(nuevo_pedido)
            uow.session.refresh(nuevo_pedido)
            return PedidoRead.model_validate(nuevo_pedido)

    def listar_pedidos(self, usuario_id: Optional[int], es_admin: bool, skip: int, limit: int, estado: Optional[str]) -> PedidosPaginados:
        with self.uow as uow:
            filtro_usuario = None if es_admin else usuario_id
            items, total = uow.pedidos.list_by_usuario(usuario_id=filtro_usuario, estado=estado, skip=skip, limit=limit)
            return PedidosPaginados(
                total=total,
                items=[PedidoRead.model_validate(p) for p in items]
            )

    def obtener_por_id(self, pedido_id: int, usuario_id: int, es_admin: bool) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
            if not es_admin and pedido.usuario_id != usuario_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tiene permisos para ver este pedido")
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

            validos = self.TRANSICIONES_VALIDAS.get(pedido.estado, [])
            if nuevo_estado not in validos:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Transición de estado inválida desde {pedido.estado} a {nuevo_estado}")

            # Si pasa a CANCELADO, se restituye el stock del producto
            if nuevo_estado == "CANCELADO":
                for item in pedido.items:
                    prod = uow.productos.get_by_id(item.producto_id)
                    if prod:
                        prod.stock += item.cantidad
                        uow.productos.add(prod)

            pedido.estado = nuevo_estado
            uow.pedidos.add(pedido)
            uow.session.refresh(pedido)
            return PedidoRead.model_validate(pedido)

    def cancelar_cliente(self, pedido_id: int, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
            if pedido.usuario_id != usuario_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Este pedido pertenece a otro usuario")
            if pedido.estado != "PENDIENTE":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Solo se pueden cancelar pedidos en estado PENDIENTE")

            # Restituir stock
            for item in pedido.items:
                prod = uow.productos.get_by_id(item.producto_id)
                if prod:
                    prod.stock += item.cantidad
                    uow.productos.add(prod)

            pedido.estado = "CANCELADO"
            uow.pedidos.add(pedido)
            uow.session.refresh(pedido)
            return PedidoRead.model_validate(pedido)

    def obtener_resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            session = uow.session
            pendientes = session.exec(select(func.count(Pedido.id)).where(Pedido.estado == "PENDIENTE")).first() or 0
            en_preparacion = session.exec(select(func.count(Pedido.id)).where(Pedido.estado == "EN_PREPARACION")).first() or 0
            entregados = session.exec(select(func.count(Pedido.id)).where(Pedido.estado == "ENTREGADO")).first() or 0
            cancelados = session.exec(select(func.count(Pedido.id)).where(Pedido.estado == "CANCELADO")).first() or 0
            
            ingresos = session.exec(select(func.sum(Pedido.total)).where(Pedido.estado == "ENTREGADO")).first() or 0.0

            # Pedidos de hoy
            hoy_inicio = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
            pedidos_hoy = session.exec(select(func.count(Pedido.id)).where(Pedido.created_at >= hoy_inicio)).first() or 0

            return ResumenPedidos(
                pendientes=pendientes,
                en_preparacion=en_preparacion,
                entregados=entregados,
                cancelados=cancelados,
                pedidos_hoy=pedidos_hoy,
                ingresos_entregados=float(ingresos)
            )