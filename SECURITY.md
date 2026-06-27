# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in GlotSync AI, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

Send a detailed report to: **security@glotsync.online**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution**: Within 30 days for critical issues

### Security Practices

GlotSync AI follows these security principles:

- All secrets stored as environment variables, never in code
- Firebase Authentication for all user sessions
- HTTPS enforced everywhere
- Input validation on all API endpoints
- MIME type validation for file uploads
- Rate limiting on all API routes
- CORS configured for known origins only
- Least privilege IAM roles for AWS services
- Signed URLs for S3 object access
- SQL injection prevention via parameterized queries
- XSS protection headers
- CSRF protection
