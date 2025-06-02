# Security Configuration for CRM Application

## Environment Variables (.env)

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/crm_db

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-chars
JWT_EXPIRES_IN=24h

# Application Configuration
NODE_ENV=production
VITE_APP_VERSION=1.0.0
VITE_BUILD_DATE=2025-06-02

# Security Configuration
VITE_ENABLE_DEBUG=false
VITE_API_BASE_URL=https://your-api-domain.com/api

# Content Security Policy
VITE_CSP_ENABLED=true
```

## Security Headers Configuration

### For Nginx (nginx.conf)

```nginx
server {
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;

    # Additional Security
    server_tokens off;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### For Apache (.htaccess)

```apache
# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"

# Hide Server Information
ServerTokens Prod
ServerSignature Off

# Prevent access to sensitive files
<FilesMatch "\.(env|md|txt|log)$">
    Require all denied
</FilesMatch>
```

## TypeScript Security Configuration

### Update tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Input Validation Schema (Zod)

```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["admin", "manager", "salesperson"]),
});
```

## Security Middleware Configuration

```typescript
// auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

// Rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// JWT Validation
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
```

## Package.json Security Scripts

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:check": "npm audit && npm outdated",
    "security:update": "npm update",
    "lint:security": "eslint --ext .ts,.tsx src/ --fix"
  }
}
```

## ESLint Security Rules

```json
{
  "extends": ["@typescript-eslint/recommended", "plugin:security/recommended"],
  "plugins": ["security"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error"
  }
}
```

## Deployment Security Checklist

### Before Production Deployment:

- [ ] Remove all console.log statements
- [ ] Set NODE_ENV=production
- [ ] Disable debug mode
- [ ] Configure HTTPS only
- [ ] Implement proper authentication
- [ ] Add rate limiting
- [ ] Configure security headers
- [ ] Run security audit
- [ ] Update all dependencies
- [ ] Enable error monitoring
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts

### Infrastructure Security:

- [ ] Use HTTPS/TLS 1.3
- [ ] Configure firewall rules
- [ ] Enable DDoS protection
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure database encryption
- [ ] Enable audit logging
- [ ] Set up intrusion detection
- [ ] Configure automated backups

This configuration provides a foundation for securing the CRM application. Implement these changes progressively, testing each modification thoroughly.
