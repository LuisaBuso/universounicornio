from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional
from pydantic.networks import EmailStr
from pydantic.types import SecretStr

# Clase para iniciar sesion como embajador
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: str  # Nuevo campo para el rol
    nombre: Optional[str] = None
    pais: Optional[str] = None
    
# Clase para traer los clientes por embajador
class ClientData(BaseModel):
    name: str
    email: str
    whatsapp_phone: str

# Clase para traer los datos del embajador que inicio sesion
class UserProfile(BaseModel):
    full_name: str
    whatsapp_number: str
    email: str
    address: str
    rol: str  # Nuevo campo para el rol
    
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
    costo_envio: float  # Nuevo campo para el costo de envío

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
    costo_envio: float  # Nuevo campo para el costo de envío
    status: Optional[str] = "pending"
    date_created: Optional[str] = datetime.utcnow().isoformat()
    transaction_id: Optional[str] = None

# Clase para crear un cliente a un embajador
class ClientCreate(BaseModel):
    name: str
    email: str
    whatsapp_phone: str
    instagram: Optional[str] = None

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
    
# CLASE PARA CREAR NEGOCIO
class Bussiness(BaseModel):
    nombre: str
    pais: str
    whatsapp: str
    correo_electronico: EmailStr
    password: str
    rol: str  # Nuevo campo para el rol

# Esquema para el login del negocio
class BussinessLogin(BaseModel):
    correo_electronico: EmailStr
    password: str

# Esquema base para el distribuidor
class DistribuidorBase(BaseModel):
    nombre: str
    telefono: str
    correo_electronico: EmailStr
    pais: str
    
# Esquema para crear un distribuidor (sin negocio_id)
class DistribuidorCreate(BaseModel):
    name: str
    pais: str
    phone: str
    correo_electronico: str
    password: str

# Esquema para devolver un distribuidor (con negocio_id)
class Distribuidor(BaseModel):
    nombre: str
    telefono: str
    correo_electronico: str
    pais: str
    id: str
    negocio_id: str
    rol: str

# ESQUEMA PARA MOSTRAR LOS DISTRIBUIDORES AL NEGOCIO
class DistribuidorResponse(BaseModel):
    id: str
    nombre: str
    telefono: str
    correo_electronico: EmailStr
    pais: str
    rol: str

# ESQUEMA PARA PODER ACTUALIZAR O ELIMINAR UN DISTRIBUIDOR
class DistribuidorUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    correo_electronico: Optional[EmailStr] = None
    pais: Optional[str] = None
    password: Optional[str] = None  # Nueva contraseña (opcional)

# ESQUEMA PARA CREAR EMBAJADOR POR DISTRIBUIDOR
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    whatsapp_number: str | None = None
    pais: str
    
# ESQUEMA PARA EDITAR UN EMBAJADOR POR DISTRIBUIDOR
class EmbajadorUpdate(BaseModel):
    full_name: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email: Optional[str] = None
    pais: Optional[str] = None
    
    