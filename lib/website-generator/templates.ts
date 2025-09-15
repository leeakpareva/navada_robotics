import { WebsiteTemplate, TemplateFile } from './types';

export const WEBSITE_TEMPLATES: Record<string, WebsiteTemplate> = {
  'modern-landing': {
    id: 'modern-landing',
    name: 'Modern Landing Page',
    description: 'Clean, modern landing page with hero section and features',
    category: 'landing',
    safetyLevel: 'high',
    requiredPackages: ['react', 'react-dom', 'next', 'tailwindcss', 'lucide-react'],
    files: [
      {
        path: 'app/page.tsx',
        content: `'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-{{primaryColor}}-50 to-{{secondaryColor}}-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white/50 backdrop-blur">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-{{primaryColor}}-600">{{siteName}}</h1>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:text-{{primaryColor}}-600 transition-colors" href="#features">
            Features
          </a>
          <a className="text-sm font-medium hover:text-{{primaryColor}}-600 transition-colors" href="#about">
            About
          </a>
          <a className="text-sm font-medium hover:text-{{primaryColor}}-600 transition-colors" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
                {{heroTitle}}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                {{heroDescription}}
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-{{primaryColor}}-600 hover:bg-{{primaryColor}}-700 text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-{{primaryColor}}-600 text-{{primaryColor}}-600 hover:bg-{{primaryColor}}-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
              Key Features
            </h2>
            <p className="mt-4 text-gray-600 md:text-lg">
              Discover what makes us different
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            {{#features}}
            <Card className="border-{{primaryColor}}-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-{{primaryColor}}-100 rounded-lg flex items-center justify-center mb-4">
                  <{{featureIcon}} className="h-6 w-6 text-{{primaryColor}}-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{{featureTitle}}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {{featureDescription}}
                </CardDescription>
              </CardContent>
            </Card>
            {{/features}}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container px-4 md:px-6 py-6 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © 2024 {{siteName}}. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <a className="text-sm text-gray-600 hover:text-{{primaryColor}}-600 transition-colors" href="#privacy">
                Privacy Policy
              </a>
              <a className="text-sm text-gray-600 hover:text-{{primaryColor}}-600 transition-colors" href="#terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
        variables: [
          {
            name: 'siteName',
            type: 'string',
            description: 'Name of the website',
            default: 'My Website'
          },
          {
            name: 'primaryColor',
            type: 'color',
            description: 'Primary brand color',
            default: 'blue'
          },
          {
            name: 'secondaryColor',
            type: 'color',
            description: 'Secondary brand color',
            default: 'purple'
          },
          {
            name: 'heroTitle',
            type: 'string',
            description: 'Main hero section title',
            default: 'Welcome to Our Platform'
          },
          {
            name: 'heroDescription',
            type: 'string',
            description: 'Hero section description',
            default: 'Transform your business with our innovative solutions.'
          },
          {
            name: 'features',
            type: 'array',
            description: 'List of features to display',
            default: [
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
            ]
          }
        ]
      },
      {
        path: 'components/ui/button.tsx',
        content: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
        variables: []
      },
      {
        path: 'components/ui/card.tsx',
        content: `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`,
        variables: []
      }
    ]
  },

  'business-portfolio': {
    id: 'business-portfolio',
    name: 'Business Portfolio',
    description: 'Professional business portfolio with services and about sections',
    category: 'business',
    safetyLevel: 'high',
    requiredPackages: ['react', 'react-dom', 'next', 'tailwindcss', 'lucide-react'],
    files: [
      {
        path: 'app/page.tsx',
        content: `'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Award, Users, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-{{primaryColor}}-600">{{siteName}}</h1>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-{{primaryColor}}-600 transition-colors">About</a>
              <a href="#services" className="text-gray-600 hover:text-{{primaryColor}}-600 transition-colors">Services</a>
              <a href="#contact" className="text-gray-600 hover:text-{{primaryColor}}-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-{{primaryColor}}-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {{heroTitle}}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {{heroDescription}}
            </p>
            <Button className="bg-{{primaryColor}}-600 hover:bg-{{primaryColor}}-700 text-white px-8 py-3 text-lg">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">About Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Award className="w-12 h-12 text-{{primaryColor}}-600 mx-auto mb-4" />
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Committed to delivering exceptional quality in every project we undertake.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-{{primaryColor}}-600 mx-auto mb-4" />
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our experienced team brings diverse skills and creative solutions to your business.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Target className="w-12 h-12 text-{{primaryColor}}-600 mx-auto mb-4" />
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Focused on achieving measurable results that drive your business forward.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {{#services}}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-{{primaryColor}}-600">{{serviceTitle}}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{{serviceDescription}}</CardDescription>
              </CardContent>
            </Card>
            {{/services}}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-{{primaryColor}}-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">{{email}}</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-{{primaryColor}}-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">{{phone}}</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 text-{{primaryColor}}-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{{location}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{{siteName}}</h3>
            <p className="text-gray-400 mb-4">© 2024 {{siteName}}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
        variables: [
          {
            name: 'siteName',
            type: 'string',
            description: 'Business name',
            default: 'My Business'
          },
          {
            name: 'primaryColor',
            type: 'color',
            description: 'Primary brand color',
            default: 'blue'
          },
          {
            name: 'heroTitle',
            type: 'string',
            description: 'Main headline',
            default: 'Professional Business Solutions'
          },
          {
            name: 'heroDescription',
            type: 'string',
            description: 'Business description',
            default: 'We help businesses grow with innovative strategies and proven expertise.'
          },
          {
            name: 'services',
            type: 'array',
            description: 'Business services offered',
            default: [
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
            ]
          },
          {
            name: 'email',
            type: 'string',
            description: 'Contact email',
            default: 'contact@mybusiness.com'
          },
          {
            name: 'phone',
            type: 'string',
            description: 'Contact phone',
            default: '+1 (555) 123-4567'
          },
          {
            name: 'location',
            type: 'string',
            description: 'Business location',
            default: 'New York, NY'
          }
        ]
      }
    ]
  }
};

export function getTemplate(templateId: string): WebsiteTemplate | null {
  return WEBSITE_TEMPLATES[templateId] || null;
}

export function getAllTemplates(): WebsiteTemplate[] {
  return Object.values(WEBSITE_TEMPLATES);
}

export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return Object.values(WEBSITE_TEMPLATES).filter(template => template.category === category);
}