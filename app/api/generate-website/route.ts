import { NextRequest, NextResponse } from 'next/server';
import { WebsiteGenerator } from '@/lib/website-generator/generator';
import { WebsiteRequest } from '@/lib/website-generator/types';
import { validateWebsiteRequest } from '@/lib/website-generator/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request structure
    const validation = validateWebsiteRequest(body);
    if (!validation.valid) {
      return NextResponse.json({
        error: 'Invalid request',
        details: validation.errors
      }, { status: 400 });
    }

    // Create website request
    const websiteRequest: WebsiteRequest = {
      description: body.description,
      siteName: body.siteName,
      style: body.style,
      pages: body.pages,
      features: body.features
    };

    // Generate the website
    const generator = new WebsiteGenerator();
    const generatedWebsite = await generator.generateWebsite(websiteRequest);

    // Check if all files are safe
    const unsafeFiles = generatedWebsite.files.filter(file => !file.safe);
    if (unsafeFiles.length > 0) {
      return NextResponse.json({
        error: 'Security validation failed',
        website: generatedWebsite,
        unsafeFiles: unsafeFiles.map(file => ({
          path: file.path,
          issues: 'Security concerns detected'
        }))
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      website: generatedWebsite
    });

  } catch (error) {
    console.error('Website generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate website',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return available templates and capabilities
  return NextResponse.json({
    templates: [
      {
        id: 'modern-landing',
        name: 'Modern Landing Page',
        description: 'Clean, modern landing page with hero section and features',
        category: 'landing'
      },
      {
        id: 'business-portfolio',
        name: 'Business Portfolio',
        description: 'Professional business portfolio with services and about sections',
        category: 'business'
      }
    ],
    supportedFeatures: [
      'Custom colors and themes',
      'Responsive design',
      'Safe component generation',
      'Security validation',
      'Next.js with TypeScript',
      'Tailwind CSS styling',
      'Radix UI components'
    ],
    safetyMeasures: [
      'Template-based generation only',
      'No external API calls',
      'No server-side code generation',
      'Content sanitization',
      'Security pattern scanning',
      'Dependency validation'
    ]
  });
}