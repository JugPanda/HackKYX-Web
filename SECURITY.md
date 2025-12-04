# Security Guidelines

This document outlines the security measures implemented in the JG Engine platform and guidelines for maintaining security.

## Implemented Security Measures

### 1. **Input Validation & Sanitization**

All user inputs are validated and sanitized:
- **Title & Description**: Limited to 100 and 500 characters respectively
- **Content Filtering**: Automatic detection of spam, profanity, and suspicious patterns
- **Schema Validation**: Using Zod for type-safe request validation
- **SQL Injection Prevention**: Using Supabase's parameterized queries

### 2. **Rate Limiting**

API endpoints are protected with rate limiting:
- **Builds**: 5 per hour per user
- **Game Creation**: 10 per hour per user
- **Comments**: 30 per hour per user
- **Reports**: 5 per hour per user
- **General API**: 100 requests per minute per user

### 3. **Authentication & Authorization**

- **Supabase Auth**: Secure authentication with email/password and OAuth
- **Row Level Security (RLS)**: Database-level access control
- **Ownership Verification**: All operations verify user ownership before execution
- **Protected Routes**: Middleware ensures authentication on protected pages

### 4. **Security Headers**

The following security headers are automatically added to all responses:
- `Strict-Transport-Security`: Enforces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: Browser XSS protection
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

### 5. **Data Protection**

- **Environment Variables**: Validated and type-checked
- **Sensitive Data**: API keys and secrets stored in environment variables only
- **Error Messages**: Sanitized to prevent information leakage
- **Request Size Limits**: Maximum 500KB per API request

### 6. **Content Security**

- **Content Filtering**: Automatic detection of:
  - Blocked words and phrases
  - URLs and email addresses
  - Phone numbers
  - Excessive capitalization
  - Spam patterns
- **Text Sanitization**: Removal of control characters
- **Length Limits**: Enforced on all user-generated content

## Security Best Practices

### For Developers

1. **Never commit secrets**: Always use environment variables
2. **Validate all inputs**: Use Zod schemas for validation
3. **Sanitize outputs**: Prevent XSS by sanitizing data before rendering
4. **Use parameterized queries**: Prevent SQL injection
5. **Implement rate limiting**: Protect endpoints from abuse
6. **Log security events**: Monitor suspicious activity

### For Deployment

1. **Use HTTPS**: Always serve the application over HTTPS
2. **Rotate secrets**: Regularly rotate API keys and secrets
3. **Monitor logs**: Set up alerting for unusual activity
4. **Keep dependencies updated**: Regularly update npm packages
5. **Use environment-specific configs**: Separate dev/prod configurations
6. **Enable Supabase RLS**: Ensure Row Level Security is active

## Environment Variables Security

Required environment variables are validated on startup:

```typescript
// Required
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL

// Optional (feature-dependent)
OPENAI_API_KEY
BUILD_SERVICE_URL
BUILD_SERVICE_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

## Reporting Security Issues

If you discover a security vulnerability, please email [security@yourdomain.com](mailto:security@yourdomain.com) instead of opening a public issue.

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Supabase RLS policies are active
- [ ] Error messages don't leak sensitive information
- [ ] Content filtering is enabled
- [ ] Security headers are configured
- [ ] Dependencies are up to date
- [ ] Build service authentication is configured
- [ ] Stripe webhook signature verification is enabled

## Known Limitations

1. **In-Memory Rate Limiting**: Current rate limiting uses in-memory storage. For production with multiple instances, use Redis or a similar distributed cache.

2. **Basic Content Filter**: The content filter is basic. For production, integrate with a professional service like:
   - AWS Comprehend
   - Google Cloud Natural Language API
   - WebPurify

3. **No DDoS Protection**: Implement CloudFlare or AWS Shield for DDoS protection in production.

## Future Security Improvements

- [ ] Implement Redis-based rate limiting for distributed deployments
- [ ] Add CAPTCHA for public endpoints
- [ ] Integrate professional content moderation API
- [ ] Add IP-based rate limiting
- [ ] Implement audit logging
- [ ] Add automated security scanning in CI/CD
- [ ] Set up Web Application Firewall (WAF)
- [ ] Implement Content Security Policy (CSP) headers

## Compliance

This application follows security best practices as outlined by:
- OWASP Top 10
- OWASP API Security Top 10
- CWE/SANS Top 25

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
