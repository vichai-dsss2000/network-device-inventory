from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Device Schemas
class DeviceBase(BaseModel):
    hostname: str
    ip_address: str
    device_type: str
    platform: Optional[str] = None
    vendor: Optional[str] = None
    model: Optional[str] = None
    ssh_port: int = 22
    username: Optional[str] = None
    password: Optional[str] = None
    enable_password: Optional[str] = None
    status: str = "active"
    description: Optional[str] = None
    location: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    device_type: Optional[str] = None
    platform: Optional[str] = None
    vendor: Optional[str] = None
    model: Optional[str] = None
    ssh_port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    enable_password: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None

class Device(DeviceBase):
    id: int
    last_sync: Optional[datetime] = None
    configuration: Optional[str] = None
    owner_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str
