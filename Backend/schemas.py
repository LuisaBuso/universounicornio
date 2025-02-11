from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional


# Clase para iniciar sesion como embajador
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Clase para traer los clientes por embajador
class ClientData(BaseModel):
    name: str
    email: str
    whatsapp_phone: str

# Clase para crear un nuevo embajador
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    whatsapp_number: str | None = None
    pais: str

# Clase para traer los datos del embajador que inicio sesion
class UserProfile(BaseModel):
    full_name: str
    whatsapp_number: str
    email: str
    address: str
    
# CLASE PARA PARA TOMAR LOS ITEM POR LISTA
class ProductItem(BaseModel):
    title: str
    unit_price: float
    quantity: int

# CLASES PARA LA CREACION DE PEDIDOS Y LA PREFERENCIA DE PAGO CON MERCADO PAGO
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

# Clase para crear un cliente a un embajador
class ClientCreate(BaseModel):
    name: str
    email: str
    whatsapp_phone: str
    instagram: Optional[str] = None
    ref: str  # Referencia al embajador (correo del embajador)

# CLASE PARA TRAER LOS PEDIDOS DE LOS CLIENTES POR EMBAJADOR
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

# CLASE PARA SOLO OBTENER PEDIDOS APPROVED POR EMBAJADOR
class ApprovedOrderResponse(BaseModel):
    status: str
    fecha: str
    id_transaccion: str
    total: float

# CLASE PARA LA PREFERENCIA DE PAGO CON MERCADO PAGO
class Item(BaseModel):
    title: str
    unit_price: float
    quantity: int