import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///../backend/network_inventory.db")
SYNC_INTERVAL_MINUTES = int(os.getenv("SYNC_INTERVAL_MINUTES", "60"))
