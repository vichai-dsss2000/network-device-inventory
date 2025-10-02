'use client';
import { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import NavigationBar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getDevices, createDevice, updateDevice, deleteDevice, Device } from '@/lib/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Device>>({
    hostname: '',
    ip_address: '',
    device_type: 'cisco_ios',
    platform: '',
    vendor: '',
    model: '',
    ssh_port: 22,
    username: '',
    password: '',
    enable_password: '',
    status: 'active',
    description: '',
    location: '',
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (device?: Device) => {
    if (device) {
      setEditMode(true);
      setCurrentDevice(device);
      setFormData(device);
    } else {
      setEditMode(false);
      setCurrentDevice(null);
      setFormData({
        hostname: '',
        ip_address: '',
        device_type: 'cisco_ios',
        platform: '',
        vendor: '',
        model: '',
        ssh_port: 22,
        username: '',
        password: '',
        enable_password: '',
        status: 'active',
        description: '',
        location: '',
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentDevice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editMode && currentDevice) {
        await updateDevice(currentDevice.id!, formData);
      } else {
        await createDevice(formData as Device);
      }
      fetchDevices();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this device?')) {
      try {
        await deleteDevice(id);
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <NavigationBar />
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Devices</h1>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Add Device
          </Button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Hostname</th>
                  <th>IP Address</th>
                  <th>Device Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Sync</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No devices found
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
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
                      <td>{device.location || '-'}</td>
                      <td>{device.last_sync ? new Date(device.last_sync).toLocaleString() : 'Never'}</td>
                      <td>
                        <Button
                          variant="sm btn-outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(device)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="sm btn-outline-danger"
                          size="sm"
                          onClick={() => handleDelete(device.id!)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Device' : 'Add Device'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label>Hostname *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>IP Address *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Device Type *</Form.Label>
                <Form.Select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  required
                >
                  <option value="cisco_ios">Cisco IOS</option>
                  <option value="cisco_nxos">Cisco NX-OS</option>
                  <option value="cisco_xe">Cisco IOS-XE</option>
                  <option value="juniper">Juniper</option>
                  <option value="arista_eos">Arista EOS</option>
                  <option value="hp_procurve">HP ProCurve</option>
                  <option value="linux">Linux</option>
                </Form.Select>
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Vendor</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>SSH Port</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.ssh_port}
                  onChange={(e) => setFormData({ ...formData, ssh_port: parseInt(e.target.value) })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editMode ? 'Leave blank to keep current password' : ''}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Enable Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.enable_password}
                  onChange={(e) => setFormData({ ...formData, enable_password: e.target.value })}
                  placeholder={editMode ? 'Leave blank to keep current password' : ''}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
}
