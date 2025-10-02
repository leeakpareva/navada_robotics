export interface SurveyQuestion {
  id: string
  text: string
  options?: string[]  // Optional for text-based questions
  type: 'multiple-choice' | 'text' | 'textarea'
  required: boolean
  placeholder?: string  // For text inputs
}

export const individualSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'age_group',
    text: 'What is your age group?',
    options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'location',
    text: 'Which country are you currently based in?',
    options: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Other African Country', 'Outside Africa'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_familiarity',
    text: 'How familiar are you with artificial intelligence (AI) technology?',
    options: ['Very familiar', 'Somewhat familiar', 'Basic understanding', 'Limited knowledge', 'Not familiar at all'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_usage',
    text: 'Which AI tools or services do you currently use? (Select the most relevant)',
    options: ['ChatGPT/GPT-based tools', 'Voice assistants (Siri, Alexa)', 'Social media recommendations', 'Navigation apps', 'None of the above'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'robotics_familiarity',
    text: 'How familiar are you with robotics technology?',
    options: ['Very familiar', 'Somewhat familiar', 'Basic understanding', 'Limited knowledge', 'Not familiar at all'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'robotics_exposure',
    text: 'Where have you encountered robotics technology?',
    options: ['Manufacturing/factories', 'Healthcare facilities', 'Educational institutions', 'Entertainment/media', 'I haven\'t encountered robotics'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_impact',
    text: 'How do you think AI will impact your daily life in the next 5 years?',
    options: ['Very positive impact', 'Somewhat positive', 'Neutral/no change', 'Somewhat negative', 'Very negative impact'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'education_preference',
    text: 'What would be your preferred way to learn about AI and robotics?',
    options: ['Online courses', 'Hands-on workshops', 'University programs', 'YouTube/social media', 'Books and articles'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'concern_level',
    text: 'What is your biggest concern about AI and robotics adoption in Africa?',
    options: ['Job displacement', 'Privacy and security', 'Cost and accessibility', 'Lack of local expertise', 'Cultural resistance'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'investment_priority',
    text: 'Which area should Africa prioritize for AI/robotics investment?',
    options: ['Healthcare', 'Agriculture', 'Education', 'Financial services', 'Manufacturing'],
    type: 'multiple-choice',
    required: true
  },
  // Additional multiple choice questions (11-14)
  {
    id: 'ai_trust_level',
    text: 'How much do you trust AI systems to make important decisions?',
    options: ['Complete trust', 'High trust', 'Moderate trust', 'Low trust', 'No trust at all'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'robotics_workplace',
    text: 'How comfortable would you be working alongside robots in your workplace?',
    options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Somewhat uncomfortable', 'Very uncomfortable'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_data_privacy',
    text: 'How concerned are you about AI systems collecting and using your personal data?',
    options: ['Not concerned at all', 'Slightly concerned', 'Moderately concerned', 'Very concerned', 'Extremely concerned'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'tech_accessibility',
    text: 'How accessible is advanced technology (smartphones, internet, computers) in your community?',
    options: ['Widely available', 'Mostly available', 'Somewhat available', 'Limited availability', 'Very limited'],
    type: 'multiple-choice',
    required: true
  },
  // Qualitative questions (15-20)
  {
    id: 'ai_experience_story',
    text: 'Please describe a specific experience you\'ve had with AI technology (positive or negative). How did it impact you?',
    type: 'textarea',
    placeholder: 'Share your personal experience with AI technology, how you used it, and what you learned from it...',
    required: true
  },
  {
    id: 'africa_ai_vision',
    text: 'In your opinion, what would an ideal AI-powered future look like for Africa? What challenges should we solve first?',
    type: 'textarea',
    placeholder: 'Describe your vision for how AI could transform Africa and what problems it should address...',
    required: true
  },
  {
    id: 'learning_barriers',
    text: 'What are the main barriers that prevent you or people in your community from learning about AI/robotics? How can we overcome them?',
    type: 'textarea',
    placeholder: 'Explain the challenges you face in accessing AI/robotics education and your suggestions for solutions...',
    required: true
  },
  {
    id: 'daily_ai_integration',
    text: 'Describe how you envision AI being integrated into your daily life in 10 years. What specific tasks would you want AI to help you with?',
    type: 'textarea',
    placeholder: 'Explain your vision of AI in your future daily routine and what specific help you would want from AI...',
    required: true
  },
  {
    id: 'community_ai_impact',
    text: 'How do you think AI could specifically benefit your local community or region? What local problems could it solve?',
    type: 'textarea',
    placeholder: 'Describe specific ways AI could improve life in your community and address local challenges...',
    required: true
  },
  {
    id: 'ai_fear_hope',
    text: 'What is your biggest hope and your biggest fear about AI development in Africa? Explain both in detail.',
    type: 'textarea',
    placeholder: 'Share both your most optimistic vision and your biggest concern about AI in Africa...',
    required: true
  }
]

export const businessSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'company_size',
    text: 'What is the size of your organization?',
    options: ['1-10 employees', '11-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'industry',
    text: 'Which industry does your organization primarily operate in?',
    options: ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Agriculture', 'Education', 'Other'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_adoption_stage',
    text: 'What stage is your organization at regarding AI adoption?',
    options: ['Already implementing AI solutions', 'Piloting AI projects', 'Exploring AI possibilities', 'Planning to explore AI', 'No current AI plans'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_applications',
    text: 'Which AI applications is your organization most interested in or already using?',
    options: ['Customer service automation', 'Data analytics and insights', 'Process automation', 'Cybersecurity', 'Marketing and sales'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'robotics_adoption',
    text: 'Does your organization use or plan to use robotics technology?',
    options: ['Currently using robotics', 'Planning to implement robotics', 'Considering robotics solutions', 'Not applicable to our business', 'Not interested in robotics'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'implementation_challenges',
    text: 'What is the biggest challenge your organization faces in adopting AI/robotics?',
    options: ['High implementation costs', 'Lack of skilled personnel', 'Uncertain ROI', 'Regulatory compliance', 'Technical infrastructure limitations'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'investment_budget',
    text: 'What percentage of your annual budget is allocated to technology innovation (AI/robotics)?',
    options: ['Less than 5%', '5-10%', '11-20%', '21-30%', 'More than 30%'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'decision_factors',
    text: 'What factor most influences your organization\'s technology adoption decisions?',
    options: ['Cost reduction potential', 'Competitive advantage', 'Customer demand', 'Operational efficiency', 'Regulatory requirements'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'partnership_interest',
    text: 'Would your organization be interested in partnering with African AI/robotics companies?',
    options: ['Very interested', 'Somewhat interested', 'Neutral', 'Not very interested', 'Not interested at all'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'future_outlook',
    text: 'How do you see AI/robotics impacting your industry in Africa over the next 5 years?',
    options: ['Revolutionary transformation', 'Significant positive change', 'Gradual improvement', 'Minimal impact', 'Potential negative disruption'],
    type: 'multiple-choice',
    required: true
  },
  // Additional multiple choice questions (11-14)
  {
    id: 'ai_business_trust',
    text: 'How much does your organization trust AI systems for critical business decisions?',
    options: ['Complete trust', 'High trust', 'Moderate trust', 'Low trust', 'No trust at all'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'employee_ai_readiness',
    text: 'How ready are your employees for working with AI/robotics technology?',
    options: ['Very ready', 'Somewhat ready', 'Neutral', 'Somewhat unprepared', 'Very unprepared'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'competitive_pressure',
    text: 'How much competitive pressure does your organization feel to adopt AI/robotics?',
    options: ['Extreme pressure', 'High pressure', 'Moderate pressure', 'Low pressure', 'No pressure'],
    type: 'multiple-choice',
    required: true
  },
  {
    id: 'ai_business_ethics',
    text: 'How important is ethical AI development to your organization\'s strategy?',
    options: ['Extremely important', 'Very important', 'Moderately important', 'Slightly important', 'Not important'],
    type: 'multiple-choice',
    required: true
  },
  // Qualitative questions for business (15-20)
  {
    id: 'ai_business_case',
    text: 'Describe a specific business problem in your organization that AI/robotics could solve. What would success look like?',
    type: 'textarea',
    placeholder: 'Explain a real business challenge you face and how AI/robotics could address it, including expected outcomes...',
    required: true
  },
  {
    id: 'african_business_innovation',
    text: 'What unique opportunities do you see for AI/robotics innovation specifically within the African business context?',
    type: 'textarea',
    placeholder: 'Share your thoughts on how African businesses can leverage AI/robotics differently from other regions...',
    required: true
  },
  {
    id: 'implementation_roadmap',
    text: 'If you had unlimited resources, what would be your step-by-step plan to implement AI/robotics in your organization over the next 3 years?',
    type: 'textarea',
    placeholder: 'Outline your ideal implementation strategy, timeline, and key milestones for AI/robotics adoption...',
    required: true
  },
  {
    id: 'customer_ai_expectations',
    text: 'How do you think your customers\' expectations regarding AI-powered services will change in the next 5 years? How will you adapt?',
    type: 'textarea',
    placeholder: 'Describe evolving customer expectations for AI services and your adaptation strategy...',
    required: true
  },
  {
    id: 'ai_workforce_transformation',
    text: 'Describe how you envision AI transforming your workforce. What new roles will emerge and which might become obsolete?',
    type: 'textarea',
    placeholder: 'Explain your vision of workforce changes, new job roles, and how you\'ll manage transitions...',
    required: true
  },
  {
    id: 'african_ai_ecosystem',
    text: 'What role should your organization play in building a stronger AI ecosystem across Africa? What partnerships or initiatives would you support?',
    type: 'textarea',
    placeholder: 'Describe your organization\'s potential contribution to Africa\'s AI development and desired collaborations...',
    required: true
  }
]

export function getSurveyQuestions(group: 'individual' | 'business'): SurveyQuestion[] {
  return group === 'individual' ? individualSurveyQuestions : businessSurveyQuestions
}