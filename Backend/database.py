from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
import jwt

# Conexión a MongoDB Atlas
uri = "mongodb+srv://universe2:htwBOjoJTNAks8EB@cluster0.qs6hs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)
db = client["universe"]
collection_client = db["client"]
collection = db["ambassador"]
collection_transaction = db["transacciones"]
collection_pedidos = db["pedidos"]
collection_wallet = db["wallet"]

# Configuración de JWT y bcrypt
SECRET_KEY = "fcef76643904c159a46a66620f2d21aec3c055369bbb84b6ddbfb33a28bea14d"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Verificar contraseñas
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Crear un token de acceso
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt