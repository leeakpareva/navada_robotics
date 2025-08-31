# NAVADA Robotics

**Navigating Artistic Vision with Advanced Digital Assistance**

A Next.js web application showcasing NAVADA's innovations at the intersection of AI, robotics, and creative technology.

## Features

- **Company Website**: Professional pages for Solutions, Services, About, and Contact
- **Agent Lee AI Assistant**: Interactive AI chat with text-to-speech capabilities
- **Modern UI/UX**: Dark theme with purple accents, fully responsive design
- **Animations**: Smooth transitions and interactive elements
- **Mobile Optimized**: Bottom navigation and hamburger menu for mobile devices

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **AI Integration**: OpenAI API
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd navada_robotics
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
VOICE_PROMPT_ID=your_voice_prompt_id
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
navada_robotics/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── solutions/         # Solutions page
│   ├── contact/           # Contact page
│   ├── agent-lee/         # AI Assistant interface
│   └── api/               # API routes
│       └── agent-lee/     # AI Assistant endpoints
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/              # Static assets
└── styles/              # Global styles

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages

- **Home** (`/`) - Landing page with company overview
- **Solutions** (`/solutions`) - AI and robotics solutions
- **Services** (`/services`) - Service offerings
- **About** (`/about`) - Company information and vision
- **Contact** (`/contact`) - Contact information
- **Agent Lee** (`/agent-lee`) - AI assistant chat interface

## API Endpoints

- `POST /api/agent-lee` - Main AI assistant endpoint
- `POST /api/agent-lee/tts` - Text-to-speech conversion

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `OPENAI_ASSISTANT_ID` | OpenAI Assistant ID for Agent Lee | Yes |
| `VOICE_PROMPT_ID` | Voice prompt configuration ID | Yes |

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

© 2024 NAVADA. All rights reserved.

## Support

For support or inquiries, please visit the Contact page or reach out through the website.