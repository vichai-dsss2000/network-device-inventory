# Contributing to Network Device Inventory

Thank you for your interest in contributing to Network Device Inventory! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/network-device-inventory.git
   cd network-device-inventory
   ```
3. Set up the development environment (see QUICKSTART.md)

## Development Workflow

### 1. Create a Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bugfix-name
```

### 2. Make Changes

- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

#### Backend Tests
```bash
cd backend
source venv/bin/activate
pytest
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "Brief description of changes"
```

Use clear commit messages:
- `feat: Add device import functionality`
- `fix: Resolve login authentication issue`
- `docs: Update installation instructions`
- `style: Format code according to style guide`
- `refactor: Simplify device sync logic`

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub.

## Code Style Guidelines

### Python (Backend/Microservices)

- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions and classes
- Keep functions small and focused
- Use meaningful variable names

Example:
```python
def get_device_configuration(device_id: int) -> Optional[str]:
    """
    Retrieve device configuration by ID.
    
    Args:
        device_id: Unique identifier of the device
        
    Returns:
        Configuration string or None if not found
    """
    # Implementation
```

### TypeScript/JavaScript (Frontend)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful component and variable names

Example:
```typescript
interface DeviceProps {
  device: Device;
  onUpdate: (device: Device) => void;
}

export default function DeviceCard({ device, onUpdate }: DeviceProps) {
  // Implementation
}
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### Pull Request Template

When creating a PR, include:

1. **Description**: What does this PR do?
2. **Motivation**: Why is this change needed?
3. **Testing**: How was this tested?
4. **Screenshots**: (if applicable)
5. **Related Issues**: Link any related issues

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node version)
- Error messages or logs
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternatives considered (optional)

## Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

## Areas for Contribution

We welcome contributions in these areas:

### Features
- Additional device type support
- Enhanced reporting and analytics
- Multi-tenancy support
- Advanced search and filtering
- Bulk operations
- Configuration diff and backup
- Integration with monitoring tools

### Improvements
- Performance optimization
- Better error handling
- Enhanced UI/UX
- Improved documentation
- More comprehensive tests
- Better logging

### Bug Fixes
- Fix reported issues
- Improve error messages
- Handle edge cases

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!
