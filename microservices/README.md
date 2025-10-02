# Microservices

Python-based microservice for network device configuration synchronization.

## Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file from `.env.example`

4. Run the sync service:
   ```bash
   python sync_service.py
   ```

## Components

- **device_connector.py**: Netmiko wrapper for SSH/Telnet connections
- **sync_service.py**: Main service for scheduled configuration sync

## Supported Device Types

- Cisco IOS
- Cisco NX-OS
- Cisco IOS-XE
- Juniper
- Arista EOS
- HP ProCurve
- Linux

## Configuration

Set sync interval in `.env`:
```env
SYNC_INTERVAL_MINUTES=60
```

## Usage

The service will:
1. Query database for active devices
2. Connect to each device via SSH/Telnet
3. Retrieve running configuration
4. Store configuration in database
5. Update last_sync timestamp
