#!/usr/bin/env python3
"""
Initialize database with default admin user
"""
from database import Base, engine, SessionLocal
from models import User
from auth import get_password_hash

def init_database():
    """Create tables and add default admin user"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            # Create default admin user
            admin = User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrator",
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("✓ Created default admin user")
            print("  Username: admin")
            print("  Password: admin123")
            print("  Please change the password after first login!")
        else:
            print("✓ Admin user already exists")
        
        print("\n✓ Database initialized successfully!")
        
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
