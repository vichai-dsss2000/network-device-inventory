import sys
import os
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

# Add backend to path to import models
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from models import Device, Base
from device_connector import DeviceConnector
from config import DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class DeviceSyncService:
    """Service to sync device configurations from network devices to database"""
    
    def __init__(self):
        self.db = SessionLocal()
    
    def sync_device(self, device: Device) -> bool:
        """
        Sync a single device configuration
        
        Args:
            device: Device model instance
        
        Returns:
            True if sync successful, False otherwise
        """
        logger.info(f"Starting sync for device: {device.hostname} ({device.ip_address})")
        
        # Prepare connection parameters
        device_params = {
            'device_type': device.device_type,
            'host': device.ip_address,
            'username': device.username,
            'password': device.password,
            'port': device.ssh_port,
        }
        
        if device.enable_password:
            device_params['secret'] = device.enable_password
        
        # Connect and retrieve configuration
        connector = DeviceConnector()
        
        try:
            if not connector.connect(device_params):
                logger.error(f"Failed to connect to {device.hostname}")
                return False
            
            # Get configuration
            config = connector.get_configuration()
            if config:
                device.configuration = config
                device.last_sync = datetime.utcnow()
                
                # Get additional device info
                info = connector.get_device_info()
                if info.get('version'):
                    # Parse version info to update platform/model if needed
                    # This is platform-specific and could be enhanced
                    pass
                
                self.db.commit()
                logger.info(f"Successfully synced {device.hostname}")
                return True
            else:
                logger.error(f"Failed to get configuration from {device.hostname}")
                return False
        
        except Exception as e:
            logger.error(f"Error syncing {device.hostname}: {str(e)}")
            self.db.rollback()
            return False
        
        finally:
            connector.disconnect()
    
    def sync_all_active_devices(self):
        """Sync all active devices in the database"""
        logger.info("Starting sync for all active devices")
        
        devices = self.db.query(Device).filter(Device.status == 'active').all()
        
        if not devices:
            logger.info("No active devices found")
            return
        
        success_count = 0
        fail_count = 0
        
        for device in devices:
            # Skip devices without credentials
            if not device.username or not device.password:
                logger.warning(f"Skipping {device.hostname}: missing credentials")
                continue
            
            if self.sync_device(device):
                success_count += 1
            else:
                fail_count += 1
        
        logger.info(f"Sync completed. Success: {success_count}, Failed: {fail_count}")
    
    def sync_device_by_id(self, device_id: int) -> bool:
        """Sync a specific device by ID"""
        device = self.db.query(Device).filter(Device.id == device_id).first()
        
        if not device:
            logger.error(f"Device with ID {device_id} not found")
            return False
        
        if not device.username or not device.password:
            logger.error(f"Device {device.hostname} missing credentials")
            return False
        
        return self.sync_device(device)
    
    def close(self):
        """Close database connection"""
        self.db.close()

if __name__ == "__main__":
    import schedule
    import time
    from config import SYNC_INTERVAL_MINUTES
    
    logger.info(f"Starting Device Sync Service (interval: {SYNC_INTERVAL_MINUTES} minutes)")
    
    service = DeviceSyncService()
    
    # Run immediately on startup
    service.sync_all_active_devices()
    
    # Schedule periodic sync
    schedule.every(SYNC_INTERVAL_MINUTES).minutes.do(service.sync_all_active_devices)
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Shutting down Device Sync Service")
        service.close()
