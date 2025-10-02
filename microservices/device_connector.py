from netmiko import ConnectHandler
from typing import Optional, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DeviceConnector:
    """Handle SSH/Telnet connections to network devices using Netmiko"""
    
    def __init__(self):
        self.connection = None
    
    def connect(self, device_params: Dict[str, Any]) -> bool:
        """
        Establish connection to network device
        
        Args:
            device_params: Dictionary containing device connection parameters
                - device_type: Type of device (cisco_ios, cisco_nxos, juniper, etc)
                - host: IP address or hostname
                - username: SSH username
                - password: SSH password
                - port: SSH port (default 22)
                - secret: Enable password (optional)
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            self.connection = ConnectHandler(**device_params)
            logger.info(f"Successfully connected to {device_params['host']}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to {device_params['host']}: {str(e)}")
            return False
    
    def get_configuration(self, command: str = "show running-config") -> Optional[str]:
        """
        Retrieve device configuration
        
        Args:
            command: Configuration command to execute
        
        Returns:
            Configuration text or None if failed
        """
        if not self.connection:
            logger.error("No active connection")
            return None
        
        try:
            output = self.connection.send_command(command)
            logger.info("Successfully retrieved configuration")
            return output
        except Exception as e:
            logger.error(f"Failed to get configuration: {str(e)}")
            return None
    
    def get_device_info(self) -> Dict[str, Optional[str]]:
        """
        Retrieve device information (version, hostname, etc)
        
        Returns:
            Dictionary with device information
        """
        if not self.connection:
            logger.error("No active connection")
            return {}
        
        info = {}
        try:
            # Try common commands for different platforms
            version_commands = [
                "show version",
                "display version",  # Huawei
            ]
            
            for cmd in version_commands:
                try:
                    info['version'] = self.connection.send_command(cmd)
                    break
                except:
                    continue
            
            # Get hostname
            hostname_commands = [
                "show running-config | include hostname",
                "show hosts",
            ]
            
            for cmd in hostname_commands:
                try:
                    info['hostname'] = self.connection.send_command(cmd)
                    break
                except:
                    continue
            
            logger.info("Successfully retrieved device info")
            return info
        except Exception as e:
            logger.error(f"Failed to get device info: {str(e)}")
            return {}
    
    def disconnect(self):
        """Close connection to device"""
        if self.connection:
            try:
                self.connection.disconnect()
                logger.info("Disconnected from device")
            except Exception as e:
                logger.error(f"Error disconnecting: {str(e)}")
            finally:
                self.connection = None
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
