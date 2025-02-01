from pydantic import BaseModel, EmailStr, Field
from typing import List

# Esquema para la creación de usuario
class UserLogin(BaseModel):
    email: str
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Esquema para la respuesta del usuario
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    
class ClientData(BaseModel):
    name: str
    email: str
    whatsapp_phone: str
    
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    whatsapp_number: str | None = None
    pais: str
    
class UserProfile(BaseModel):
    name: str
    whatsapp: str
    email: str
    address: str | None = None
    
class ProductItem(BaseModel):
    name: str
    quantity: int
    price: float

class UserInfo(BaseModel):
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
    ref: str = Field(..., description="Correo del embajador")
    productos: List[ProductItem]
    total: float
    
class ProductItem(BaseModel):
    name: str
    quantity: int
    price: float

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

class Item(BaseModel):
    title: str  # Cambié 'name' a 'title'
    unit_price: float  # Cambié 'price' a 'unit_price'
    quantity: int

class PreferenceRequest(BaseModel):
    items: List[Item]
    external_reference: str
