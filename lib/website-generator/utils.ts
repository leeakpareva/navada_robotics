export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

export function parseUserRequest(message: string): {
  isWebsiteRequest: boolean;
  siteName?: string;
  description?: string;
  style?: {
    primaryColor?: string;
    secondaryColor?: string;
    theme?: string;
  };
  pages?: string[];
  features?: string[];
} {
  const lowerMessage = message.toLowerCase();

  // Check if this is a website creation request
  const websiteKeywords = [
    'create website', 'build website', 'make website', 'design website',
    'create site', 'build site', 'make site', 'design site',
    'create a website', 'build a website', 'make a website',
    'website for', 'site for', 'landing page', 'homepage'
  ];

  const isWebsiteRequest = websiteKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  if (!isWebsiteRequest) {
    return { isWebsiteRequest: false };
  }

  // Extract site name
  let siteName = 'My Website';
  const siteNamePatterns = [
    /(?:website|site)\s+(?:for|called|named)\s+["']?([^"'\n.]+)["']?/i,
    /["']([^"'\n]+)["']\s+(?:website|site)/i,
    /(?:company|business)\s+(?:called|named)\s+["']?([^"'\n.]+)["']?/i
  ];

  for (const pattern of siteNamePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      siteName = match[1].trim();
      break;
    }
  }

  // Extract colors
  const colorPattern = /(?:color|theme).*?(?:blue|red|green|purple|orange|pink|cyan|yellow|gray|black|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})/gi;
  const colorMatches = message.match(colorPattern);
  let primaryColor = 'blue';
  let secondaryColor = 'purple';

  if (colorMatches && colorMatches.length > 0) {
    const extractedColors = colorMatches.map(match => {
      const colorMatch = match.match(/(blue|red|green|purple|orange|pink|cyan|yellow|gray|black|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})/i);
      return colorMatch ? colorMatch[1] : null;
    }).filter(Boolean);

    if (extractedColors.length > 0) {
      primaryColor = extractedColors[0]!;
      if (extractedColors.length > 1) {
        secondaryColor = extractedColors[1]!;
      }
    }
  }

  // Extract theme style
  let theme: string | undefined;
  const themeKeywords = {
    modern: ['modern', 'contemporary', 'sleek', 'clean'],
    classic: ['classic', 'traditional', 'elegant', 'formal'],
    minimal: ['minimal', 'minimalist', 'simple', 'clean'],
    bold: ['bold', 'vibrant', 'colorful', 'dynamic']
  };

  for (const [themeKey, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      theme = themeKey;
      break;
    }
  }

  // Extract pages
  const pages: string[] = [];
  const pageKeywords = ['home', 'about', 'services', 'contact', 'portfolio', 'blog', 'products'];
  for (const page of pageKeywords) {
    if (lowerMessage.includes(page)) {
      pages.push(page);
    }
  }

  // Extract features/services
  const features: string[] = [];
  const featurePatterns = [
    /(?:features?|services?|offers?)\s*:?\s*([^.!?]+)/gi,
    /(?:including|with|offer)\s+([^.!?]+)/gi
  ];

  for (const pattern of featurePatterns) {
    const matches = [...message.matchAll(pattern)];
    for (const match of matches) {
      if (match[1]) {
        const featureList = match[1]
          .split(/[,&]/)
          .map(f => f.trim())
          .filter(f => f.length > 0 && f.length < 50);
        features.push(...featureList);
      }
    }
  }

  return {
    isWebsiteRequest: true,
    siteName,
    description: message,
    style: {
      primaryColor,
      secondaryColor,
      theme
    },
    pages: pages.length > 0 ? pages : undefined,
    features: features.length > 0 ? features.slice(0, 6) : undefined
  };
}

export function formatWebsitePreview(website: any): string {
  return `
## Website Preview: ${website.projectName}

**Project ID:** ${website.projectId}
**Status:** ${website.status}
**Created:** ${website.createdAt.toLocaleString()}

### Generated Files:
${website.files.map((file: any) =>
  `- **${file.path}** (${file.type}${file.safe ? ' ✅' : ' ⚠️'})`
).join('\n')}

### Next Steps:
1. Review the generated code files
2. Download the project files
3. Run \`npm install\` to install dependencies
4. Run \`npm run dev\` to start the development server

${website.files.some((f: any) => !f.safe) ?
  '⚠️ **Warning:** Some files contain potential security issues. Please review carefully before use.' :
  '✅ All files passed security validation.'
}
  `.trim();
}

export function createProjectStructure(website: any): string {
  const structure = [
    `${website.projectName}/`,
    '├── app/',
    '│   └── page.tsx',
    '├── components/',
    '│   └── ui/',
    '├── lib/',
    '│   └── utils.ts',
    '├── package.json',
    '├── next.config.js',
    '├── tailwind.config.js',
    '└── README.md'
  ];

  return structure.join('\n');
}