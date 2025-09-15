# Website Generation Safety Documentation

## Overview
Agent Lee now includes a secure website generation feature that allows users to create NextJS websites through natural language requests. This feature is built with multiple layers of security and safety measures.

## Safety Features

### 1. Template-Based Generation Only
- **No arbitrary code generation**: All websites are built from pre-approved, security-audited templates
- **Limited scope**: Only specific website types are supported (landing pages, business portfolios)
- **Fixed architecture**: All generated sites use the same secure NextJS + Tailwind CSS structure

### 2. Security Validation Pipeline
```
User Request → Input Validation → Template Selection → Code Generation → Security Scanning → Output Validation
```

#### Input Validation
- Request structure validation
- Content sanitization
- Color value validation
- Length limits on all user inputs

#### Security Scanning
- **XSS Prevention**: Scans for dangerous HTML injection patterns
- **Code Injection**: Detects potential script injection attempts
- **Malicious Patterns**: Identifies suspicious code patterns
- **Dependency Validation**: Only allows pre-approved safe packages

### 3. Content Sanitization
- All user-provided content is sanitized before insertion
- HTML tags are stripped or escaped
- Special characters are properly handled
- Length limits prevent excessive content

### 4. Restricted Dependencies
Only these safe packages are allowed:
- `react`, `react-dom`, `next`
- `tailwindcss`, `lucide-react`
- `@radix-ui/react-*` components
- `framer-motion`, `class-variance-authority`
- `clsx`, `tailwind-merge`

## What is NOT Generated

### Prohibited Features
- ❌ Server-side code (API routes, middleware)
- ❌ Database connections or integrations
- ❌ External API calls or third-party integrations
- ❌ User authentication or login systems
- ❌ File upload functionality
- ❌ Dynamic content management
- ❌ E-commerce or payment processing
- ❌ User-generated content features

### Security Restrictions
- ❌ No `dangerouslySetInnerHTML` usage
- ❌ No `eval()` or dynamic code execution
- ❌ No direct DOM manipulation
- ❌ No external script loading
- ❌ No inline event handlers
- ❌ No localStorage or cookie access

## Supported Website Types

### 1. Modern Landing Page
- Hero section with call-to-action
- Features showcase
- Clean, responsive design
- Contact information section

### 2. Business Portfolio
- Professional layout
- Services/offerings section
- About section
- Contact details

### Customization Options
- ✅ Site name and branding
- ✅ Primary and secondary colors
- ✅ Theme selection (modern, classic, minimal, bold)
- ✅ Feature/service descriptions
- ✅ Contact information

## Usage Guidelines

### Safe Usage Examples
```
✅ "Create a modern website for my tech startup"
✅ "Build a business portfolio with blue colors"
✅ "Make a landing page for my consulting company"
✅ "Design a website for my photography business"
```

### Unsafe Requests (Will be Rejected)
```
❌ "Create a website with user login functionality"
❌ "Build an e-commerce site with payments"
❌ "Make a website that connects to my database"
❌ "Create a site that can upload files"
```

## Security Monitoring

### Automatic Validation
- Every generated file is scanned for security issues
- Files failing validation are marked as unsafe
- Users are warned about any security concerns
- Unsafe projects are not delivered to users

### Error Handling
- Invalid requests are rejected with clear error messages
- Security violations prevent code generation
- Failed validations are logged for monitoring
- Users receive guidance on safe alternatives

## Technical Implementation

### File Structure
```
generated-website/
├── app/
│   └── page.tsx          # Main page component
├── components/
│   └── ui/               # Safe UI components
├── lib/
│   └── utils.ts          # Utility functions
├── package.json          # Safe dependencies only
├── next.config.js        # Basic Next.js config
├── tailwind.config.js    # Styling configuration
└── README.md             # Setup instructions
```

### Security Validation Process
1. **Input Validation**: Check request format and content
2. **Template Selection**: Choose appropriate safe template
3. **Content Processing**: Sanitize and validate all user content
4. **File Generation**: Create files from secure templates
5. **Security Scanning**: Scan all generated files for issues
6. **Final Validation**: Ensure all files pass security checks

## Deployment Considerations

### Safe Deployment
- Generated websites are static and safe to deploy
- No server-side vulnerabilities
- No database connections required
- Standard NextJS hosting compatible

### Recommended Platforms
- Vercel (recommended for NextJS)
- Netlify
- GitHub Pages (for static export)
- Any static hosting service

## Monitoring and Updates

### Continuous Improvement
- Security patterns are regularly updated
- New safe templates may be added
- User feedback helps improve safety measures
- Regular security audits of the generation process

### Incident Response
- Any security issues are immediately addressed
- Templates are updated if vulnerabilities are found
- Users are notified of important security updates

## Conclusion

The website generation feature provides a safe, controlled way for users to create professional websites without security risks. By restricting generation to pre-approved templates and implementing comprehensive validation, we ensure that all generated code is safe for deployment while still providing meaningful functionality to users.

For technical questions or security concerns, please review this documentation and test the feature in a controlled environment before production use.