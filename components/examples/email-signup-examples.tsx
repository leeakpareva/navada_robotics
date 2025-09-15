// Example usage of EmailSignup component

import { EmailSignup } from '@/components/ui/email-signup'

export function EmailSignupExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Email Signup Component Examples</h2>

      {/* Default Style */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Style</h3>
        <EmailSignup
          source="homepage"
          placeholder="Get updates about our robotics courses"
          buttonText="Get Updates"
        />
      </div>

      {/* Purple Theme (matches Agent Lee) */}
      <div className="bg-black p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Purple Theme (Agent Lee Style)</h3>
        <EmailSignup
          variant="purple"
          source="agent-lee"
          placeholder="Stay updated with AI innovations"
          buttonText="Join Now"
        />
      </div>

      {/* Minimal Style */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Minimal Style</h3>
        <EmailSignup
          variant="minimal"
          source="newsletter"
          placeholder="Subscribe to our newsletter"
          buttonText="Subscribe"
        />
      </div>

      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Styling</h3>
        <EmailSignup
          source="footer"
          placeholder="Your email here..."
          buttonText="Sign Up"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  )
}

// Usage in any page:
/*
import { EmailSignup } from '@/components/ui/email-signup'

// In your component:
<EmailSignup
  source="homepage"
  variant="purple"
  placeholder="Enter your email for updates"
  buttonText="Subscribe"
/>
*/