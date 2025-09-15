import { SecurityCheck, SecurityIssue, ValidationResult, ValidationError, ValidationWarning } from './types';

// Dangerous patterns that should never be allowed
const SECURITY_PATTERNS = {
  xss: [
    /dangerouslySetInnerHTML/gi,
    /document\.write/gi,
    /eval\s*\(/gi,
    /new\s+Function/gi,
    /innerHTML\s*=/gi,
    /outerHTML\s*=/gi,
  ],
  injection: [
    /\$\{.*\}/g, // Template literals in suspicious contexts
    /process\.env/gi, // Environment variables
    /require\s*\(/gi, // Node.js requires
    /import\s*\(/gi, // Dynamic imports
  ],
  maliciousCode: [
    /window\.location/gi,
    /document\.cookie/gi,
    /localStorage/gi,
    /sessionStorage/gi,
    /fetch\s*\(/gi,
    /XMLHttpRequest/gi,
    /WebSocket/gi,
  ],
};

// Allowed safe packages only
const SAFE_PACKAGES = [
  'react',
  'react-dom',
  'next',
  'tailwindcss',
  'lucide-react',
  '@radix-ui/react-*',
  'framer-motion',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
];

export function validateWebsiteRequest(request: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate basic structure
  if (!request.description || typeof request.description !== 'string') {
    errors.push({
      file: 'request',
      line: 0,
      message: 'Description is required and must be a string',
      type: 'syntax'
    });
  }

  if (!request.siteName || typeof request.siteName !== 'string') {
    errors.push({
      file: 'request',
      line: 0,
      message: 'Site name is required and must be a string',
      type: 'syntax'
    });
  }

  // Validate description content for security
  if (request.description) {
    const securityCheck = scanForSecurityIssues(request.description, 'description');
    if (!securityCheck.passed) {
      errors.push(...securityCheck.issues.map(issue => ({
        file: 'request',
        line: 0,
        message: `Security issue in description: ${issue.message}`,
        type: 'security' as const
      })));
    }
  }

  // Validate color values
  if (request.style?.primaryColor && !isValidColor(request.style.primaryColor)) {
    errors.push({
      file: 'request',
      line: 0,
      message: 'Invalid primary color format',
      type: 'syntax'
    });
  }

  if (request.style?.secondaryColor && !isValidColor(request.style.secondaryColor)) {
    errors.push({
      file: 'request',
      line: 0,
      message: 'Invalid secondary color format',
      type: 'syntax'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function scanForSecurityIssues(content: string, filename: string): SecurityCheck {
  const issues: SecurityIssue[] = [];
  let score = 100;

  // Check for XSS patterns
  for (const pattern of SECURITY_PATTERNS.xss) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        severity: 'high',
        type: 'xss',
        message: `Potential XSS vulnerability: ${pattern.source}`,
        file: filename
      });
      score -= 30;
    }
  }

  // Check for injection patterns
  for (const pattern of SECURITY_PATTERNS.injection) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        severity: 'high',
        type: 'injection',
        message: `Potential injection vulnerability: ${pattern.source}`,
        file: filename
      });
      score -= 25;
    }
  }

  // Check for malicious code patterns
  for (const pattern of SECURITY_PATTERNS.maliciousCode) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        severity: 'medium',
        type: 'malicious-code',
        message: `Potentially unsafe code: ${pattern.source}`,
        file: filename
      });
      score -= 20;
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}

export function validatePackageDependencies(packages: string[]): SecurityCheck {
  const issues: SecurityIssue[] = [];
  let score = 100;

  for (const pkg of packages) {
    const isSafe = SAFE_PACKAGES.some(safePkg => {
      if (safePkg.endsWith('*')) {
        return pkg.startsWith(safePkg.slice(0, -1));
      }
      return pkg === safePkg;
    });

    if (!isSafe) {
      issues.push({
        severity: 'high',
        type: 'unsafe-dependency',
        message: `Unsafe package dependency: ${pkg}`,
      });
      score -= 40;
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}

export function sanitizeContent(content: string): string {
  // Remove any potentially dangerous content
  let sanitized = content;

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized;
}

function isValidColor(color: string): boolean {
  // Validate hex colors
  if (color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
    return true;
  }

  // Validate CSS color names (basic list)
  const cssColors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown',
    'black', 'white', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy'
  ];

  if (cssColors.includes(color.toLowerCase())) {
    return true;
  }

  // Validate rgb/rgba
  if (color.match(/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*[01]?\.?\d*)?\s*\)$/)) {
    return true;
  }

  return false;
}