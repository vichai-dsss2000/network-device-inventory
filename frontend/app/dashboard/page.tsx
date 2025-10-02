'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavigationBar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getDevices, Device } from '@/lib/api';
import { getCurrentUser, User } from '@/lib/auth';

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesData, userData] = await Promise.all([
          getDevices(),
          getCurrentUser()
        ]);
        setDevices(devicesData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const inactiveDevices = devices.filter(d => d.status === 'inactive').length;
  const pendingDevices = devices.filter(d => d.status === 'pending').length;

  return (
    <ProtectedRoute>
      <NavigationBar />
      <Container>
        <h1 className="mb-4">Dashboard</h1>
        
        {user && (
          <Card className="mb-4">
            <Card.Body>
              <h5>Welcome, {user.full_name || user.username}!</h5>
              <p className="mb-0">Role: <strong>{user.role}</strong></p>
            </Card.Body>
          </Card>
        )}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h6 className="text-muted">Total Devices</h6>
                  <h2>{devices.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3 border-success">
                <Card.Body>
                  <h6 className="text-muted">Active</h6>
                  <h2 className="text-success">{activeDevices}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3 border-danger">
                <Card.Body>
                  <h6 className="text-muted">Inactive</h6>
                  <h2 className="text-danger">{inactiveDevices}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3 border-warning">
                <Card.Body>
                  <h6 className="text-muted">Pending</h6>
                  <h2 className="text-warning">{pendingDevices}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Card>
          <Card.Header>
            <h5 className="mb-0">Recent Devices</h5>
          </Card.Header>
          <Card.Body>
            {devices.length === 0 ? (
              <p className="text-muted">No devices found. Add your first device!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Hostname</th>
                      <th>IP Address</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Last Sync</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.slice(0, 5).map(device => (
                      <tr key={device.id}>
                        <td>{device.hostname}</td>
                        <td>{device.ip_address}</td>
                        <td>{device.device_type}</td>
                        <td>
                          <span className={`badge bg-${
                            device.status === 'active' ? 'success' : 
                            device.status === 'inactive' ? 'danger' : 'warning'
                          }`}>
                            {device.status}
                          </span>
                        </td>
                        <td>{device.last_sync ? new Date(device.last_sync).toLocaleString() : 'Never'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
