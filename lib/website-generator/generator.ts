import { WebsiteRequest, GeneratedWebsite, GeneratedFile, WebsiteTemplate } from './types';
import { getTemplate } from './templates';
import { validateWebsiteRequest, scanForSecurityIssues, sanitizeContent } from './security';
import { generateUniqueId } from './utils';

export class WebsiteGenerator {
  private projectsDir = 'generated-websites';

  async generateWebsite(request: WebsiteRequest): Promise<GeneratedWebsite> {
    // Validate the request
    const validation = validateWebsiteRequest(request);
    if (!validation.valid) {
      throw new Error(`Invalid request: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Determine the best template based on request
    const template = this.selectTemplate(request);
    if (!template) {
      throw new Error('No suitable template found for the request');
    }

    // Generate unique project ID
    const projectId = generateUniqueId();
    const projectName = this.sanitizeProjectName(request.siteName);

    // Create the website structure
    const website: GeneratedWebsite = {
      projectId,
      projectName,
      description: request.description,
      files: [],
      status: 'generating',
      createdAt: new Date()
    };

    try {
      // Generate files from template
      const generatedFiles = await this.generateFilesFromTemplate(template, request);

      // Validate all generated files
      const validatedFiles = await this.validateGeneratedFiles(generatedFiles);

      website.files = validatedFiles;
      website.status = 'ready';

      // Generate additional configuration files
      website.files.push(...this.generateConfigFiles(request, template));

      return website;
    } catch (error) {
      website.status = 'error';
      throw error;
    }
  }

  private selectTemplate(request: WebsiteRequest): WebsiteTemplate | null {
    const description = request.description.toLowerCase();

    // Simple keyword-based template selection
    if (description.includes('business') || description.includes('company') || description.includes('professional')) {
      return getTemplate('business-portfolio');
    } else if (description.includes('landing') || description.includes('product') || description.includes('service')) {
      return getTemplate('modern-landing');
    }

    // Default to modern landing page
    return getTemplate('modern-landing');
  }

  private async generateFilesFromTemplate(template: WebsiteTemplate, request: WebsiteRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const templateFile of template.files) {
      const processedContent = this.processTemplate(templateFile.content, templateFile.variables, request);

      const generatedFile: GeneratedFile = {
        path: templateFile.path,
        content: processedContent,
        type: this.determineFileType(templateFile.path),
        safe: true,
        validated: false
      };

      files.push(generatedFile);
    }

    return files;
  }

  private processTemplate(content: string, variables: any[], request: WebsiteRequest): string {
    let processedContent = content;

    // Replace basic variables
    processedContent = processedContent.replace(/\{\{siteName\}\}/g, sanitizeContent(request.siteName));
    processedContent = processedContent.replace(/\{\{primaryColor\}\}/g, request.style?.primaryColor || 'blue');
    processedContent = processedContent.replace(/\{\{secondaryColor\}\}/g, request.style?.secondaryColor || 'purple');

    // Process description-based variables
    const heroData = this.extractHeroData(request.description);
    processedContent = processedContent.replace(/\{\{heroTitle\}\}/g, heroData.title);
    processedContent = processedContent.replace(/\{\{heroDescription\}\}/g, heroData.description);

    // Process features if present
    if (processedContent.includes('{{#features}}')) {
      const features = this.extractFeatures(request.description, request.features);
      processedContent = this.processArrayTemplate(processedContent, 'features', features);
    }

    // Process services if present
    if (processedContent.includes('{{#services}}')) {
      const services = this.extractServices(request.description, request.features);
      processedContent = this.processArrayTemplate(processedContent, 'services', services);
    }

    // Add contact information if requested
    if (processedContent.includes('{{email}}')) {
      processedContent = processedContent.replace(/\{\{email\}\}/g, 'contact@' + this.getDomainFromSiteName(request.siteName));
    }
    if (processedContent.includes('{{phone}}')) {
      processedContent = processedContent.replace(/\{\{phone\}\}/g, '+1 (555) 123-4567');
    }
    if (processedContent.includes('{{location}}')) {
      processedContent = processedContent.replace(/\{\{location\}\}/g, 'Your City, State');
    }

    return processedContent;
  }

  private extractHeroData(description: string): { title: string; description: string } {
    // Extract or generate appropriate hero content based on description
    const words = description.split(' ');
    const title = words.slice(0, 5).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
    const desc = description.length > 100 ? description.substring(0, 97) + '...' : description;

    return {
      title: title || 'Welcome to Our Platform',
      description: sanitizeContent(desc) || 'Transform your business with our innovative solutions.'
    };
  }

  private extractFeatures(description: string, features?: string[]): any[] {
    const defaultFeatures = [
      {
        featureIcon: 'Zap',
        featureTitle: 'Fast Performance',
        featureDescription: 'Lightning-fast loading times and smooth user experience.'
      },
      {
        featureIcon: 'Users',
        featureTitle: 'Team Collaboration',
        featureDescription: 'Work together seamlessly with your team members.'
      },
      {
        featureIcon: 'Star',
        featureTitle: 'Premium Quality',
        featureDescription: 'High-quality solutions built with modern technologies.'
      }
    ];

    if (features && features.length > 0) {
      return features.slice(0, 6).map((feature, index) => ({
        featureIcon: ['Zap', 'Users', 'Star', 'Target', 'Award', 'Shield'][index % 6],
        featureTitle: sanitizeContent(feature),
        featureDescription: `Professional ${feature.toLowerCase()} services tailored to your needs.`
      }));
    }

    return defaultFeatures;
  }

  private extractServices(description: string, features?: string[]): any[] {
    const defaultServices = [
      {
        serviceTitle: 'Consulting',
        serviceDescription: 'Strategic business consulting to help you achieve your goals.'
      },
      {
        serviceTitle: 'Development',
        serviceDescription: 'Custom software and web development solutions.'
      },
      {
        serviceTitle: 'Support',
        serviceDescription: 'Ongoing support and maintenance for your business systems.'
      }
    ];

    if (features && features.length > 0) {
      return features.slice(0, 6).map(feature => ({
        serviceTitle: sanitizeContent(feature),
        serviceDescription: `Professional ${feature.toLowerCase()} services designed to meet your specific requirements.`
      }));
    }

    return defaultServices;
  }

  private processArrayTemplate(content: string, arrayName: string, items: any[]): string {
    const startTag = `{{#${arrayName}}}`;
    const endTag = `{{/${arrayName}}}`;

    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) return content;

    const beforeTemplate = content.substring(0, startIndex);
    const template = content.substring(startIndex + startTag.length, endIndex);
    const afterTemplate = content.substring(endIndex + endTag.length);

    let processedItems = '';

    for (const item of items) {
      let processedTemplate = template;

      // Replace all variables in the template
      for (const [key, value] of Object.entries(item)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        processedTemplate = processedTemplate.replace(regex, String(value));
      }

      processedItems += processedTemplate;
    }

    return beforeTemplate + processedItems + afterTemplate;
  }

  private async validateGeneratedFiles(files: GeneratedFile[]): Promise<GeneratedFile[]> {
    const validatedFiles: GeneratedFile[] = [];

    for (const file of files) {
      // Scan for security issues
      const securityCheck = scanForSecurityIssues(file.content, file.path);

      if (!securityCheck.passed) {
        console.warn(`Security issues found in ${file.path}:`, securityCheck.issues);
        file.safe = false;
      }

      file.validated = true;
      validatedFiles.push(file);
    }

    return validatedFiles;
  }

  private generateConfigFiles(request: WebsiteRequest, template: WebsiteTemplate): GeneratedFile[] {
    const configFiles: GeneratedFile[] = [];

    // Generate package.json
    configFiles.push({
      path: 'package.json',
      content: JSON.stringify({
        name: this.sanitizeProjectName(request.siteName).toLowerCase().replace(/\s+/g, '-'),
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          'react': '^18',
          'react-dom': '^18',
          'next': '^14',
          'tailwindcss': '^3',
          'lucide-react': '^0.400.0',
          '@radix-ui/react-slot': '^1.0.0',
          'class-variance-authority': '^0.7.0',
          'clsx': '^2.0.0',
          'tailwind-merge': '^2.0.0'
        },
        devDependencies: {
          'typescript': '^5',
          '@types/node': '^20',
          '@types/react': '^18',
          '@types/react-dom': '^18',
          'autoprefixer': '^10',
          'postcss': '^8',
          'eslint': '^8',
          'eslint-config-next': '^14'
        }
      }, null, 2),
      type: 'config',
      safe: true,
      validated: true
    });

    // Generate Next.js config
    configFiles.push({
      path: 'next.config.js',
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,
      type: 'config',
      safe: true,
      validated: true
    });

    // Generate Tailwind config
    configFiles.push({
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`,
      type: 'config',
      safe: true,
      validated: true
    });

    // Generate lib/utils.ts
    configFiles.push({
      path: 'lib/utils.ts',
      content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
      type: 'config',
      safe: true,
      validated: true
    });

    // Generate README
    configFiles.push({
      path: 'README.md',
      content: `# ${request.siteName}

${request.description}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icon library

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.`,
      type: 'config',
      safe: true,
      validated: true
    });

    return configFiles;
  }

  private determineFileType(path: string): 'component' | 'page' | 'config' | 'style' {
    if (path.includes('components/')) return 'component';
    if (path.includes('app/') && path.endsWith('.tsx')) return 'page';
    if (path.includes('.css') || path.includes('.scss')) return 'style';
    return 'config';
  }

  private sanitizeProjectName(name: string): string {
    return name.replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
  }

  private getDomainFromSiteName(siteName: string): string {
    return siteName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  }
}