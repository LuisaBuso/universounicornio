from fastapi import FastAPI, HTTPException, Depends, status, Form, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from pydantic import BaseModel
from jose import JWTError
from schemas import TokenResponse, UserCreate, UserProfile, ClientData, UserInfo, PreferenceRequest
from pydantic import BaseModel
from datetime import datetime, timedelta
import httpx
import mercadopago
import jwt, requests
from typing import List, Optional
import os
from bson import ObjectId
from dotenv import load_dotenv

# Base de datos simulada y funciones de verificación
# Reemplazar con tus funciones de base de datos reales
from database import (
    collection,
    collection_client,
    collection_transaction,
    collection_pedidos,
    collection_wallet,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)

# Configuración de FastAPI
app = FastAPI()

load_dotenv()

PUBLIC_KEY = os.getenv("PUBLIC_KEY")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
print(ACCESS_TOKEN)
MERCADO_PAGO_API_URL = "https://api.mercadopago.com/v1/payments"

sdk = mercadopago.SDK(ACCESS_TOKEN)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuración de CORS
origins = [
    "https://rizosfelicesmx.unicornio.tech",
    "https://rizosfelicesco.unicornio.tech"
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia que extrae el email del embajador desde el token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")  # El email está en el campo "sub" del payload
        if not user_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar el token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_email  # Devolvemos el email del embajador
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/")
async def read_root():
    return {"message": "Bienvenido a la API de Embajadores"}


# Endpoint para iniciar sesión
@app.post("/token", response_model=TokenResponse)
async def login_user(
    username: str = Form(...),  # Swagger envía "username" en lugar de "email"
    password: str = Form(...)
):
    """
    Endpoint para iniciar sesión y obtener token JWT.
    - Usar el username (email) y password para obtener el token.
    """
    # Buscar el usuario por el email
    user = await collection.find_one({"email": username})
    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado.")

    # Verificar la contraseña
    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta.")

    # Generar el token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "pais": user["pais"]},  # Agregar 'pais' al token
        expires_delta=access_token_expires
    )

    # Retornar el token y el tipo
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Endpoint para crear un usuario
@app.post("/users/", status_code=201)
async def create_user(user: UserCreate):
    # Verificar si el usuario ya existe por correo electrónico
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe.")

    # Encriptar la contraseña antes de guardarla
    hashed_password = pwd_context.hash(user.password)
    
    # Crear el nuevo embajador con la información incluida
    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "whatsapp_number": user.whatsapp_number,
        "pais": user.pais,  # Guardar el país del embajador
        "disabled": False,
    }

    # Insertar el nuevo usuario en la base de datos
    result = await collection.insert_one(new_user)
    
    # Devolver la respuesta con el ID del usuario y su email
    return {"id": str(result.inserted_id), "email": user.email, "pais": user.pais}

# Ejemplo de una ruta protegida
@app.get("/protected-route/")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Acceso permitido para el usuario {current_user}"}

# Endpoint para obtener el perfil de un usuario
class UserProfile(BaseModel):
    full_name: str
    whatsapp_number: str
    email: str
    address: str

@app.get("/ambassadors", response_model=UserProfile)
async def get_user_profile(current_user: str = Depends(get_current_user)):
    # Usa await para obtener el resultado de la consulta
    user = await collection.find_one({"email": current_user})
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    profile_data = {
        "full_name": user.get("full_name"),
        "whatsapp_number": user.get("whatsapp_number"),
        "email": user.get("email"),
        "address": user.get("address", "Sin dirección proporcionada"),
    }

    return profile_data  # Devuelve los datos directamente

@app.get("/clients", response_model=List[ClientData])
async def get_clients(current_user: str = Depends(get_current_user)):
    """
    Obtiene los clientes asociados al embajador autenticado.
    """
    # Verificar si el embajador existe
    ambassador = await collection.find_one({"email": current_user})
    if not ambassador:
        raise HTTPException(status_code=404, detail="Embajador no encontrado")

    # Obtener todos los clientes asociados al email del embajador
    clients_cursor = collection_client.find({"ref": current_user})  # Cambiado a "ref" para coincidir con el campo usado en el endpoint anterior
    clients = await clients_cursor.to_list(length=100)  # Limita la cantidad de clientes a 100 (ajusta según necesidad)

    if not clients:
        raise HTTPException(status_code=404, detail="No hay clientes disponibles")

    # Convertir los resultados en una lista de objetos ClientData
    client_list = []
    for client in clients:
        client_data = ClientData(
            name=client.get("nombre"),
            email=client.get("correo_electronico"),
            whatsapp_phone=client.get("telefono"),
        )
        client_list.append(client_data)

    return client_list

class ClientCreate(BaseModel):
    name: str
    email: str
    whatsapp_phone: str
    instagram: Optional[str] = None
    ref: str  # Referencia al embajador (correo del embajador)

# Endpoint para guardar un cliente
@app.post("/clients", response_model=ClientCreate)
async def create_client(client_data: ClientCreate, current_user: str = Depends(get_current_user)):
    """
    Guarda un nuevo cliente asociado al embajador autenticado.
    """
    # Verificar si el embajador existe
    ambassador = await collection.find_one({"email": current_user})
    if not ambassador:
        raise HTTPException(status_code=404, detail="Embajador no encontrado")

    # Verificar si el cliente ya existe (por correo electrónico)
    existing_client = await collection_client.find_one({"email": client_data.email})
    if existing_client:
        raise HTTPException(status_code=400, detail="El cliente ya existe")

    # Crear el documento del cliente
    client_document = {
        "nombre": client_data.name,
        "correo_electronico": client_data.email,
        "telefono": client_data.whatsapp_phone,
        "instagram": client_data.instagram,
        "ref": client_data.ref,  # Asociar el cliente al embajador
    }

    # Insertar el cliente en la colección
    result = await collection_client.insert_one(client_document)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Error al guardar el cliente")

    # Devolver los datos del cliente guardado
    return {**client_data.dict(), "id": str(result.inserted_id)}

class ProductItem(BaseModel):
    title: str
    quantity: int
    unit_price: float

# Modelo para la solicitud de preferencia (datos de envío + ítems)
class PreferenceRequest(BaseModel):
    cedula: str
    nombre: str
    apellidos: str
    pais_region: str
    direccion_calle: str
    numero_casa: str
    estado_municipio: str
    localidad_ciudad: str
    telefono: str
    correo_electronico: str
    ref: str
    items: List[ProductItem]

# Modelo para guardar los datos en MongoDB
class PedidoMongo(BaseModel):
    cedula: str
    nombre: str
    apellidos: str
    pais_region: str
    direccion_calle: str
    numero_casa: str
    estado_municipio: str
    localidad_ciudad: str
    telefono: str
    correo_electronico: str
    ref: str
    productos: List[ProductItem]
    total: float
    status: Optional[str] = "pending"
    date_created: Optional[str] = datetime.utcnow().isoformat()
    transaction_id: Optional[str] = None

@app.post("/create-preference")
async def create_preference(request: PreferenceRequest):
    try:
        print("Datos recibidos:", request.dict())

        # Calcular el total del pedido
        total = sum(item.unit_price * item.quantity for item in request.items)

        # Crear el documento para MongoDB
        pedido_data = PedidoMongo(
            cedula=request.cedula,
            nombre=request.nombre,
            apellidos=request.apellidos,
            pais_region=request.pais_region,
            direccion_calle=request.direccion_calle,
            numero_casa=request.numero_casa,
            estado_municipio=request.estado_municipio,
            localidad_ciudad=request.localidad_ciudad,
            telefono=request.telefono,
            correo_electronico=request.correo_electronico,
            ref=request.ref,
            productos=request.items,
            total=total,
        )

        # Guardar el pedido en MongoDB
        result = await collection_pedidos.insert_one(pedido_data.dict())
        pedido_id = str(result.inserted_id)  # Obtener el ObjectId generado por MongoDB

        # Crear la preferencia de pago para Mercado Pago
        preference_data = {
            "items": [
                {
                    "title": item.title,
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price),  # Precio unitario
                }
                for item in request.items
            ],
            "external_reference": pedido_id,  # Usar el ObjectId como referencia externa
            "back_urls": {
                "success": f"https://rizosfelicesmx.unicornio.tech/catalog?ref={request.ref}",
                "failure": f"https://rizosfelicesmx.unicornio.tech/catalog?ref={request.ref}",
                "pending": f"https://rizosfelicesmx.unicornio.tech/catalog?ref={request.ref}",
            },
            "auto_return": "approved",
            "notification_url": "https://api.unicornio.tech/webhook",
        }

        # Crear la preferencia en Mercado Pago
        preference_response = sdk.preference().create(preference_data)
        print("Respuesta de Mercado Pago:", preference_response)

        # Verificar si la respuesta contiene 'init_point'
        if "response" in preference_response and "init_point" in preference_response["response"]:
            init_point = preference_response["response"]["init_point"]
        else:
            print("Error en la respuesta de Mercado Pago:", preference_response)
            raise HTTPException(
                status_code=500,
                detail="Error al crear la preferencia en Mercado Pago. Verifica los datos enviados.",
            )

        # Devolver la URL de pago
        return JSONResponse({"init_point": init_point})

    except Exception as e:
        print("Error al crear la preferencia:", str(e))
        raise HTTPException(status_code=422, detail=str(e))


@app.get("/payments")
async def get_all_payments(begin_date: str, end_date: str, limit: int = 50, offset: int = 0):
    """
    Endpoint para obtener todas las compras realizadas en Mercado Pago.
    
    Parámetros:
    - begin_date: Fecha de inicio en formato ISO 8601 (e.g., "2025-01-01T00:00:00Z").
    - end_date: Fecha de fin en formato ISO 8601 (e.g., "2025-01-09T23:59:59Z").
    - limit: Número máximo de resultados por página.
    - offset: Offset para la paginación.
    """
    filters = {
        "range": "date_created",
        "begin_date": begin_date,
        "end_date": end_date,
        "limit": limit,
        "offset": offset
    }

    try:
        # Realizar la búsqueda en Mercado Pago
        response = sdk.payment().search(filters)

        # Validar la respuesta
        if response["status"] != 200:
            raise HTTPException(status_code=response["status"], detail=response.get("message", "Error en Mercado Pago"))

        # Extraer los resultados de pagos
        payments = response["response"]["results"]

        # Extraer y guardar solo los datos necesarios en MongoDB
        for payment in payments:
            payment_data = {
                "product_name": payment["additional_info"]["items"][0]["title"] if "items" in payment["additional_info"] else None,
                "quantity": payment["additional_info"]["items"][0]["quantity"] if "items" in payment["additional_info"] else None,
                "payer_phone": payment["payer"]["phone"]["number"] if "phone" in payment["payer"] else None,
                "payer_email": payment["payer"]["email"] if "email" in payment["payer"] else None,
                "transaction_amount": payment["transaction_amount"],
                "currency_id": payment["currency_id"],
                "status": payment["status"],
                "status_detail": payment["status_detail"],
                "date_created": payment["date_created"]
            }

            # Insertar el pago en la colección "transacciones"
            collection_transaction.insert_one(payment_data)

        return {"payments": payments}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/shipping-information")
async def create_shipping_info(user_info: UserInfo):
    """
    Crea información de envío y registra un cliente si no existe.
    """
    try:
        # Verificar si el embajador existe
        ambassador = await collection.find_one({"email": user_info.ref})
        if not ambassador:
            raise HTTPException(status_code=404, detail="Embajador no encontrado.")

        # Verificar si el cliente ya existe en la base de datos
        existing_client = await collection_client.find_one({"email": user_info.correo_electronico})
        
        if not existing_client:
            # Crear un nuevo cliente asociado al embajador
            new_client = {
                "name": user_info.nombre + " " + user_info.apellidos,
                "email": user_info.correo_electronico,
                "whatsapp_phone": user_info.telefono,
                "embajador_email": user_info.ref,
            }
            await collection_client.insert_one(new_client)

        # Guardar la información de envío
        user_data = user_info.dict()
        await collection_pedidos.insert_one(user_data)

        return {"message": "Información de envío y cliente guardados correctamente."}

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


class ProductItem(BaseModel):
    title: str
    unit_price: float
    quantity: int

class Order(BaseModel):
    cedula: str
    nombre: str
    apellidos: str
    pais_region: str
    direccion_calle: str
    numero_casa: str
    estado_municipio: str
    localidad_ciudad: str
    telefono: str
    correo_electronico: str
    ref: str
    productos: List[ProductItem]
    total: float
    status: Optional[str] = None
    date_created: Optional[datetime] = None
    transaction_id: Optional[str] = None

@app.get("/orders-by-client/{client_email}", response_model=List[Order])
async def get_orders_by_client(client_email: str, current_user: str = Depends(get_current_user)):
    """
    Endpoint protegido para obtener los pedidos de un cliente específico.
    Valida que el embajador autenticado sea el propietario del cliente.
    Solo retorna los pedidos con estado "approved".
    """
    try:
        # Verificar si el cliente pertenece al embajador autenticado
        client = await collection_client.find_one({"correo_electronico": client_email, "ref": current_user})
        if not client:
            raise HTTPException(
                status_code=404,
                detail="Cliente no encontrado o no pertenece al embajador autenticado"
            )

        # Recuperar los pedidos del cliente
        orders_cursor = collection_pedidos.find({"correo_electronico": client_email})
        orders = await orders_cursor.to_list(length=100)

        if not orders:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron pedidos para este cliente"
            )

        order_list = []
        for order in orders:
            order_id = order.get('_id')
            transaction = await collection_transaction.find_one({"external_reference": str(order_id)})

            if transaction:
                status = transaction.get('status')
                date_created = transaction.get('date_created')
                transaction_id = str(transaction.get('id'))
            else:
                status = None
                date_created = None
                transaction_id = None

            # Solo agregar el pedido si el estado es "approved"
            if status != "approved":
                continue

            # Combinar nombre y apellidos para el campo `nombre`
            full_name = " ".join(filter(None, [order.get('nombre', '').strip(), order.get('apellidos', '').strip()]))

            # Validar y guardar o actualizar el cliente en collection_client
            cliente_data = {
                "nombre": full_name,  # Aquí se guarda el nombre completo
                "correo_electronico": order.get('correo_electronico'),
                "telefono": order.get('telefono'),
                "ref": order.get('ref')
            }

            existing_client = await collection_client.find_one(
                {"correo_electronico": order.get('correo_electronico'), "telefono": order.get('telefono')}
            )

            if existing_client:
                # Verificar diferencias, incluyendo la actualización del nombre completo
                differences = {
                    key: value for key, value in cliente_data.items()
                    if existing_client.get(key) != value
                }
                if differences:
                    await collection_client.update_one(
                        {"_id": existing_client["_id"]},
                        {"$set": differences}
                    )
            else:
                # Si no existe, inserta el cliente con nombre completo
                await collection_client.insert_one(cliente_data)

            # Construir la lista de pedidos
            order_list.append(Order(
                cedula=order.get('cedula'),
                nombre=order.get('nombre'),
                apellidos=order.get('apellidos'),
                pais_region=order.get('pais_region'),
                direccion_calle=order.get('direccion_calle'),
                numero_casa=order.get('numero_casa'),
                estado_municipio=order.get('estado_municipio'),
                localidad_ciudad=order.get('localidad_ciudad'),
                telefono=order.get('telefono'),
                correo_electronico=order.get('correo_electronico'),
                ref=order.get('ref'),
                productos=[ProductItem(**item) for item in order.get('productos', [])],
                total=order.get('total'),
                status=status,
                date_created=date_created,
                transaction_id=transaction_id
            ))

        return order_list

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener los pedidos del cliente"
        ) from e

    
@app.post("/webhook")
async def webhook(request: Request):
    """
    Webhook para recibir notificaciones de Mercado Pago, consultar detalles del pago y guardarlos en MongoDB.
    """
    try:
        # Leer los datos enviados por Mercado Pago
        payment = await request.json()
        print("Notificación recibida:", payment)

        # Obtener el payment_id desde los datos recibidos
        payment_id = payment.get("data", {}).get("id")  # Esto es para cuando el id está dentro de "data"
        if not payment_id:
            payment_id = payment.get("id")  # Esto es para cuando el id está a nivel superior

        # Consultar los detalles del pago usando la API de Mercado Pago
        url = f"https://api.mercadopago.com/v1/payments/{payment_id}"
        headers = {
            "Authorization": f"Bearer {ACCESS_TOKEN}"
        }
        response = requests.get(url, headers=headers)

        # Manejo de la respuesta de la API de Mercado Pago
        if response.status_code == 200:
            payment_data = response.json()

            # Extraer solo los campos necesarios
            filtered_data = {
                "id": payment_data.get("id"),
                "status": payment_data.get("status"),
                "date_created": payment_data.get("date_created"),
                "date_approved": payment_data.get("date_approved"),
                "external_reference": payment_data.get("external_reference"),
                "timestamp": datetime.utcnow()  # Agregar un timestamp para saber cuándo se guardó
            }

            print("Detalles del pago filtrados:", filtered_data)

            # Guardar los datos en MongoDB (usando motor)
            result = await collection_transaction.insert_one(filtered_data)
            if result.inserted_id:
                print("Datos guardados en MongoDB con ID:", result.inserted_id)

                # Convertir el ObjectId a una cadena para la respuesta
                filtered_data["_id"] = str(result.inserted_id)

                return {"status": "success", "message": "Datos guardados en MongoDB", "payment_data": filtered_data}
            else:
                print("Error al guardar los datos en MongoDB")
                raise HTTPException(status_code=500, detail="Error al guardar los datos en MongoDB")
        else:
            print(f"Error al consultar el pago: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error consultando detalles del pago: {response.text}"
            )
    except Exception as e:
        print("Error procesando el webhook:", e)
        raise HTTPException(status_code=500, detail="Error procesando el webhook")
    
@app.post("/calcular-comision", summary="Calcular comisión para el embajador autenticado")
async def calcular_comision(current_user: str = Depends(get_current_user)):
    """
    Endpoint protegido para calcular la comisión del embajador autenticado.
    Solo se calcula la comisión para pedidos con estado "approved".
    """
    try:
        # Buscar al embajador autenticado en la colección ambassador
        embajador = await collection.find_one({"email": current_user})
        if not embajador:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Embajador no encontrado"
            )

        # Obtener el ObjectId del embajador autenticado
        embajador_id = str(embajador["_id"])

        # Obtener todos los pedidos asociados al embajador con estado "approved"
        pedidos_cursor = collection_pedidos.find({
            "ref": embajador["email"],
            "status": "approved"  # Filtrar solo pedidos con estado "approved"
        })
        pedidos_aprobados = await pedidos_cursor.to_list(length=100)

        # Calcular el total de ventas solo para pedidos aprobados
        total_ventas = sum(pedido["total"] for pedido in pedidos_aprobados)

        # Calcular la comisión (25% del total de ventas)
        comision = total_ventas * 0.25

        # Crear o actualizar la wallet del embajador
        wallet = {
            "embajador_id": embajador_id,
            "total_ventas": total_ventas,
            "comision": comision,
            "fecha_actualizacion": datetime.utcnow()
        }

        # Insertar o actualizar en la colección wallet
        await collection_wallet.update_one(
            {"embajador_id": embajador_id},
            {"$set": wallet},
            upsert=True
        )

        return {
            "message": "Comisión calculada y wallet actualizada",
            "wallet": wallet
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al calcular la comisión"
        ) from e

class ProductItem(BaseModel):
    title: str
    unit_price: float
    quantity: int

class Order(BaseModel):
    cedula: str
    nombre: str
    apellidos: str
    pais_region: str
    direccion_calle: str
    numero_casa: str
    estado_municipio: str
    localidad_ciudad: str
    telefono: str
    correo_electronico: str
    ref: str
    productos: List[ProductItem]
    total: float
    status: Optional[str] = None
    date_created: Optional[datetime] = None
    transaction_id: Optional[str] = None

class ClientCreate(BaseModel):
    name: str
    email: str
    whatsapp_phone: str
    instagram: Optional[str] = None
    ref: str  # Referencia al embajador (correo del embajador)

class UserProfile(BaseModel):
    full_name: str
    whatsapp_number: str
    email: str
    address: str

# Endpoint para obtener las métricas
@app.get("/dashboard/metrics")
async def get_dashboard_metrics(current_user: str = Depends(get_current_user)):
    # Obtener el correo electrónico del embajador que inició sesión
    embajador_email = current_user

    # Obtener todos los correos electrónicos únicos de clientes que tienen pedidos asociados con el embajador
    total_clientes_con_pedido = await collection_pedidos.distinct("correo_electronico", {"ref": embajador_email})

    # Total de clientes que tienen al menos un pedido asociado con el embajador
    total_clientes_con_pedido_count = len(total_clientes_con_pedido)

    # Total de contactos que no tienen un pedido afiliado con el embajador
    total_contactos_sin_pedido = await collection_client.count_documents({
        "correo_electronico": {"$nin": total_clientes_con_pedido},
        "ref": embajador_email
    })

    # Ventas totales de pedidos asociados con el embajador y que tienen el status "approved"
    ventas_totales_cursor = collection_pedidos.aggregate([
        {"$match": {"ref": embajador_email, "status": "approved"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ])
    ventas_totales_result = await ventas_totales_cursor.to_list(length=1)
    ventas_totales = ventas_totales_result[0]["total"] if ventas_totales_result else 0

    # Total de clientes asociados con el embajador independientemente de si tienen un pedido o no
    total_clientes = await collection_client.count_documents({"ref": embajador_email})

    return {
        "total_clientes_con_pedido": total_clientes_con_pedido_count,
        "total_contactos_sin_pedido": total_contactos_sin_pedido,
        "ventas_totales_approved": ventas_totales,  # Cambiado a "ventas_totales_approved" para reflejar que son solo las ventas aprobadas
        "total_clientes": total_clientes
    }
    
class WalletResponse(BaseModel):
    _id: str
    embajador_id: str
    comision: float
    fecha_actualizacion: datetime
    total_ventas: float

@app.get("/wallet/comision-actualizada", summary="Obtener la comisión de la cartera")
async def obtener_comision_actualizada(current_user: str = Depends(get_current_user)):
    """
    Endpoint protegido para obtener la comisión del embajador autenticado.
    """
    try:
        # Buscar al embajador autenticado
        embajador = await collection.find_one({"email": current_user})
        if not embajador:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Embajador no encontrado"
            )

        # Obtener la wallet asociada al embajador
        wallet = await collection_wallet.find_one({"embajador_id": str(embajador["_id"])})
        if not wallet:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Wallet no encontrada"
            )

        return {
            "comision": wallet.get("comision", 0.0),
            "total_ventas": wallet.get("total_ventas", 0.0),
            "fecha_actualizacion": wallet.get("fecha_actualizacion", "No disponible")
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la información de la cartera"
        ) from e

    except Exception as e:
        print(f"Error en el endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la información de la cartera"
        ) from e
        
class ProductItem(BaseModel):
    title: str
    unit_price: float
    quantity: int

# Modelo Pydantic para los pedidos
class Order(BaseModel):
    cedula: str
    nombre: str
    apellidos: str
    pais_region: str
    direccion_calle: str
    numero_casa: str
    estado_municipio: str
    localidad_ciudad: str
    telefono: str
    correo_electronico: str
    ref: str
    productos: List[ProductItem]
    total: float
    status: Optional[str] = None
    date_created: Optional[datetime] = None
    transaction_id: Optional[str] = None

# Endpoint para obtener los pedidos por cliente
@app.get("/orders-by-client/{client_email}", response_model=List[Order])
async def get_orders_by_client(client_email: str, current_user: str = Depends(get_current_user)):
    """
    Endpoint protegido para obtener los pedidos de un cliente específico.
    Valida que el embajador autenticado sea el propietario del cliente.
    """
    try:
        # Verificar si el cliente pertenece al embajador autenticado
        client = await collection_client.find_one({"correo_electronico": client_email, "ref": current_user})
        if not client:
            raise HTTPException(
                status_code=404,
                detail="Cliente no encontrado o no pertenece al embajador autenticado"
            )

        # Recuperar los pedidos del cliente
        orders_cursor = collection_pedidos.find({"correo_electronico": client_email})
        orders = await orders_cursor.to_list(length=100)

        if not orders:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron pedidos para este cliente"
            )

        order_list = []
        for order in orders:
            order_id = order.get('_id')
            transaction = await collection_transaction.find_one({"external_reference": str(order_id)})

            if transaction:
                status = transaction.get('status')
                date_created = transaction.get('date_created')
                transaction_id = str(transaction.get('id'))
            else:
                status = None
                date_created = None
                transaction_id = None

            updated_order = {
                **order,
                "status": status,
                "date_created": date_created,
                "transaction_id": transaction_id
            }
            await collection_pedidos.update_one({"_id": order_id}, {"$set": updated_order})

            # Combinar nombre y apellidos para el campo `nombre`
            full_name = " ".join(filter(None, [order.get('nombre', '').strip(), order.get('apellidos', '').strip()]))

            # Validar y guardar o actualizar el cliente en collection_client
            cliente_data = {
                "nombre": full_name,  # Aquí se guarda el nombre completo
                "correo_electronico": order.get('correo_electronico'),
                "telefono": order.get('telefono'),
                "ref": order.get('ref')
            }

            existing_client = await collection_client.find_one(
                {"correo_electronico": order.get('correo_electronico'), "telefono": order.get('telefono')}
            )

            if existing_client:
                # Verificar diferencias, incluyendo la actualización del nombre completo
                differences = {
                    key: value for key, value in cliente_data.items()
                    if existing_client.get(key) != value
                }
                if differences:
                    await collection_client.update_one(
                        {"_id": existing_client["_id"]},
                        {"$set": differences}
                    )
            else:
                # Si no existe, inserta el cliente con nombre completo
                await collection_client.insert_one(cliente_data)

            # Construir la lista de pedidos
            order_list.append(Order(
                cedula=order.get('cedula'),
                nombre=order.get('nombre'),
                apellidos=order.get('apellidos'),
                pais_region=order.get('pais_region'),
                direccion_calle=order.get('direccion_calle'),
                numero_casa=order.get('numero_casa'),
                estado_municipio=order.get('estado_municipio'),
                localidad_ciudad=order.get('localidad_ciudad'),
                telefono=order.get('telefono'),
                correo_electronico=order.get('correo_electronico'),
                ref=order.get('ref'),
                productos=[ProductItem(**item) for item in order.get('productos', [])],
                total=order.get('total'),
                status=status,
                date_created=date_created,
                transaction_id=transaction_id
            ))

        return order_list

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener los pedidos del cliente"
        ) from e

class ApprovedOrderResponse(BaseModel):
    status: str
    fecha: str
    id_transaccion: str
    total: float

@app.get("/approved-orders", response_model=List[ApprovedOrderResponse])
async def get_approved_orders(current_user: str = Depends(get_current_user)):
    """
    Endpoint protegido para obtener los pedidos con estado "approved" asociados al embajador autenticado.
    Solo se muestran los pedidos con estado "approved" y los campos: status, fecha, id_transaccion y total.
    """
    try:
        # Busca el embajador usando el correo actual
        ambassador = await collection.find_one({"email": current_user})
        if not ambassador:
            raise HTTPException(status_code=404, detail="Embajador no encontrado")

        # Recupera los pedidos donde el campo 'ref' coincide con el correo del embajador
        orders_cursor = collection_pedidos.find({"ref": current_user, "status": "approved"})
        orders = await orders_cursor.to_list(length=100)

        if not orders:
            raise HTTPException(status_code=404, detail="No se encontraron pedidos aprobados para este embajador")

        approved_orders = []
        for order in orders:
            # Obtener la fecha del pedido
            fecha = order.get("date_created")

            # Verificar si la fecha existe y es un objeto datetime
            if fecha and isinstance(fecha, datetime):
                fecha_formateada = fecha.strftime("%d/%m/%Y, %I:%M:%S %p")
            else:
                # Si no es un datetime, intentar convertirla desde un string o asignar "No disponible"
                if isinstance(fecha, str):
                    try:
                        # Intentar convertir la cadena a datetime
                        fecha_dt = datetime.fromisoformat(fecha)  # Ajusta el formato según corresponda
                        fecha_formateada = fecha_dt.strftime("%d/%m/%Y, %I:%M:%S %p")
                    except ValueError:
                        fecha_formateada = "No disponible"
                else:
                    fecha_formateada = "No disponible"

            # Agregar el pedido aprobado a la lista
            approved_orders.append({
                "status": order.get("status", "approved"),
                "fecha": fecha_formateada,
                "id_transaccion": order.get("transaction_id", "No disponible"),
                "total": order.get("total", 0.0)
            })

        return approved_orders

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener los pedidos aprobados: {str(e)}"
        )
