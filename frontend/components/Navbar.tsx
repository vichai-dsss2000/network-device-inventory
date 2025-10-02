'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout, getCurrentUser, User } from '@/lib/auth';

export default function NavigationBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} href="/dashboard">
          Network Device Inventory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} href="/devices">Devices</Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} href="/users">Users</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={user.username} id="user-dropdown">
                <NavDropdown.Item disabled>
                  Role: {user.role}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
