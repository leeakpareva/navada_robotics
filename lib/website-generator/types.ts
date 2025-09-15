export interface WebsiteRequest {
  description: string;
  siteName: string;
  style?: {
    primaryColor?: string;
    secondaryColor?: string;
    theme?: 'modern' | 'classic' | 'minimal' | 'bold';
  };
  pages?: string[];
  features?: string[];
}

export interface GeneratedWebsite {
  projectId: string;
  projectName: string;
  description: string;
  files: GeneratedFile[];
  previewUrl?: string;
  createdAt: Date;
  status: 'generating' | 'ready' | 'error';
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'config' | 'style';
  safe: boolean;
  validated: boolean;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'portfolio' | 'blog' | 'landing';
  files: TemplateFile[];
  requiredPackages: string[];
  safetyLevel: 'high' | 'medium';
}

export interface TemplateFile {
  path: string;
  content: string;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'color' | 'boolean' | 'array';
  description: string;
  default: any;
  validation?: {
    pattern?: string;
    maxLength?: number;
    allowedValues?: any[];
  };
}

export interface SecurityCheck {
  passed: boolean;
  issues: SecurityIssue[];
  score: number;
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'xss' | 'injection' | 'malicious-code' | 'unsafe-dependency';
  message: string;
  line?: number;
  file?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  file: string;
  line: number;
  message: string;
  type: 'syntax' | 'type' | 'security' | 'style';
}

export interface ValidationWarning {
  file: string;
  line: number;
  message: string;
  type: 'style' | 'performance' | 'accessibility';
}