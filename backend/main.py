from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from database import engine, get_db, Base
from models import User, Device
from schemas import (
    User as UserSchema, UserCreate, UserUpdate,
    Device as DeviceSchema, DeviceCreate, DeviceUpdate,
    Token, LoginRequest
)
from auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_active_user, require_role
)
from config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Network Device Inventory API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/register", response_model=UserSchema)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/auth/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# User endpoints
@app.get("/api/users", response_model=List[UserSchema])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/api/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@app.delete("/api/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Device endpoints
@app.get("/api/devices", response_model=List[DeviceSchema])
async def list_devices(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role == "admin":
        devices = db.query(Device).offset(skip).limit(limit).all()
    else:
        devices = db.query(Device).filter(Device.owner_id == current_user.id).offset(skip).limit(limit).all()
    return devices

@app.get("/api/devices/{device_id}", response_model=DeviceSchema)
async def get_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if current_user.role != "admin" and device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return device

@app.post("/api/devices", response_model=DeviceSchema)
async def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if device with hostname exists
    db_device = db.query(Device).filter(Device.hostname == device.hostname).first()
    if db_device:
        raise HTTPException(status_code=400, detail="Device hostname already exists")
    
    db_device = Device(**device.model_dump(), owner_id=current_user.id)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@app.put("/api/devices/{device_id}", response_model=DeviceSchema)
async def update_device(
    device_id: int,
    device_update: DeviceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if current_user.role != "admin" and device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = device_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(device, field, value)
    
    db.commit()
    db.refresh(device)
    return device

@app.delete("/api/devices/{device_id}")
async def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if current_user.role != "admin" and device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(device)
    db.commit()
    return {"message": "Device deleted successfully"}

@app.get("/")
async def root():
    return {"message": "Network Device Inventory API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
