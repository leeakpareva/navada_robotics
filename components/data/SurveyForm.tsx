'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSurveyQuestions } from '@/lib/surveyQuestions'
import { clientCookies, universalCookies } from '@/lib/cookies'
import { Users, Building, CheckCircle, AlertCircle, Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyFormProps {
  group: 'individual' | 'business'
}

interface FormData {
  [key: string]: string
}

interface ContactInfo {
  userEmail: string
  userPassword: string
  name: string
  email: string
  phoneNumber: string
  stripeEmail: string
  country: string
  age: string
  bankAccount: string
  bankName: string
  businessName: string
  businessRegNumber: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  businessType: string
}

export function SurveyForm({ group }: SurveyFormProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    userEmail: '',
    userPassword: '',
    name: '',
    email: '',
    phoneNumber: '',
    stripeEmail: '',
    country: '',
    age: '',
    bankAccount: '',
    bankName: '',
    businessName: '',
    businessRegNumber: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessType: ''
  })
  const [currentStep, setCurrentStep] = useState<'survey' | 'contact' | 'success'>('survey')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const questions = getSurveyQuestions(group)
  const rewardAmount = group === 'individual' ? '£5 GBP' : '£15 GBP'

  useEffect(() => {
    if (universalCookies.hasAcceptedCookies()) {
      const savedResponses = universalCookies.getSurveyResponses()
      if (savedResponses?.[group]) {
        setFormData(savedResponses[group])
      }

      const savedContactInfo = universalCookies.getContactInfo()
      if (savedContactInfo) {
        setContactInfo(prev => ({
          ...prev,
          name: savedContactInfo.name || '',
          email: savedContactInfo.email || '',
          phoneNumber: savedContactInfo.phoneNumber || '',
          country: savedContactInfo.country || '',
          bankAccount: savedContactInfo.bankAccount || '',
          bankName: savedContactInfo.bankName || '',
          businessName: savedContactInfo.businessName || '',
          businessEmail: savedContactInfo.businessEmail || ''
        }))
      }
    }
  }, [group])

  const handleQuestionChange = (questionId: string, value: string) => {
    const newFormData = {
      ...formData,
      [questionId]: value
    }

    setFormData(newFormData)

    if (universalCookies.hasAcceptedCookies()) {
      clientCookies.setSurveyResponses(group, newFormData)
    }

    setErrors(prev => prev.filter(error => !error.includes(questionId)))
  }

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    const newContactInfo = {
      ...contactInfo,
      [field]: value
    }

    setContactInfo(newContactInfo)

    if (universalCookies.hasAcceptedCookies() && field !== 'userPassword') {
      clientCookies.setContactInfo({
        name: newContactInfo.name,
        email: newContactInfo.email,
        phoneNumber: newContactInfo.phoneNumber,
        country: newContactInfo.country,
        bankAccount: field === 'bankAccount' ? value : contactInfo.bankAccount,
        bankName: field === 'bankName' ? value : contactInfo.bankName,
        businessName: field === 'businessName' ? value : contactInfo.businessName,
        businessEmail: field === 'businessEmail' ? value : contactInfo.businessEmail
      })
    }
  }

  const validateSurvey = (): string[] => {
    const newErrors: string[] = []

    questions.forEach(question => {
      if (question.required && !formData[question.id]) {
        newErrors.push(`Please answer: ${question.text}`)
      }
    })

    return newErrors
  }

  const validateContact = (): string[] => {
    const newErrors: string[] = []

    if (!contactInfo.userEmail.trim()) {
      newErrors.push('Login email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.userEmail)) {
      newErrors.push('Please enter a valid login email address')
    }

    if (!contactInfo.userPassword.trim()) {
      newErrors.push('Password is required')
    } else if (contactInfo.userPassword.length < 6) {
      newErrors.push('Password must be at least 6 characters long')
    }

    if (!contactInfo.name.trim()) {
      newErrors.push('Full name is required')
    }

    if (!contactInfo.email.trim()) {
      newErrors.push('Contact email address is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.push('Please enter a valid contact email address')
    }

    if (!contactInfo.phoneNumber.trim()) {
      newErrors.push('Phone number is required')
    }

    if (!contactInfo.stripeEmail.trim()) {
      newErrors.push('Stripe email is required for payment')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.stripeEmail)) {
      newErrors.push('Please enter a valid Stripe email address')
    }

    if (!contactInfo.country.trim()) {
      newErrors.push('Country is required')
    }

    if (!contactInfo.age.trim()) {
      newErrors.push('Age confirmation is required')
    }

    if (group === 'individual') {
      if (!contactInfo.bankAccount.trim()) {
        newErrors.push('Bank account number is required')
      }
      if (!contactInfo.bankName.trim()) {
        newErrors.push('Bank name is required')
      }
    }

    if (group === 'business') {
      if (!contactInfo.businessName.trim()) {
        newErrors.push('Business name is required')
      }
      if (!contactInfo.businessRegNumber.trim()) {
        newErrors.push('Business registration number is required')
      }
      if (!contactInfo.businessEmail.trim()) {
        newErrors.push('Business email is required')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.businessEmail)) {
        newErrors.push('Please enter a valid business email address')
      }
      if (!contactInfo.businessPhone.trim()) {
        newErrors.push('Business phone is required')
      }
      if (!contactInfo.businessAddress.trim()) {
        newErrors.push('Business address is required')
      }
      if (!contactInfo.businessType.trim()) {
        newErrors.push('Business type is required')
      }
    }

    return newErrors
  }

  const handleNextStep = () => {
    const surveyErrors = validateSurvey()
    if (surveyErrors.length > 0) {
      setErrors(surveyErrors)
      toast.error('Please complete all required questions before proceeding')
      return
    }

    setErrors([])
    setCurrentStep('contact')
  }

  const handleSubmit = async () => {
    const contactErrors = validateContact()
    if (contactErrors.length > 0) {
      setErrors(contactErrors)
      toast.error('Please fill in all required contact information')
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const response = await fetch('/api/data/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group,
          formData,
          contactInfo,
          timestamp: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to submit survey'
        try {
          const error = await response.json()
          errorMessage = error.message || error.error || errorMessage
        } catch (jsonError) {
          // If JSON parsing fails, use response status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Parse successful response
      let responseData = null
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.warn('Could not parse response JSON, but request was successful')
      }

      setCurrentStep('success')
      toast.success('Survey submitted successfully! You will receive payment within 72 hours.')
    } catch (error) {
      console.error('Survey submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedQuestions = Object.keys(formData).length
  const progressPercentage = (completedQuestions / questions.length) * 100

  if (currentStep === 'success') {
    return (
      <Card className="bg-green-900/20 border-green-500/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
            Survey Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-800/30 p-6 rounded-lg">
            <h3 className="text-green-100 font-semibold text-lg mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <p className="text-green-200">Your survey responses have been securely recorded</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <p className="text-green-200">Our team will process your payment within 72 hours</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <p className="text-green-200">You'll receive {rewardAmount} via Stripe to: {contactInfo.stripeEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-800/30 p-4 rounded-lg">
            <p className="text-blue-200 text-sm">
              Thank you for contributing to the future of AI and robotics in Africa. Your insights are valuable
              and will help shape technology adoption across the continent.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              {group === 'individual' ? (
                <Users className="w-6 h-6 mr-3 text-blue-400" />
              ) : (
                <Building className="w-6 h-6 mr-3 text-purple-400" />
              )}
              {group === 'individual' ? 'Individual Survey' : 'Business Survey'}
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">{rewardAmount}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 'survey' && (
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{completedQuestions} of {questions.length} questions</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-white text-base font-medium">
                    {index + 1}. {question.text}
                    {question.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>

                  {question.type === 'multiple-choice' && question.options && (
                    <RadioGroup
                      value={formData[question.id] || ''}
                      onValueChange={(value) => handleQuestionChange(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${optionIndex}`}
                            className="border-gray-500 text-purple-500"
                          />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="text-gray-300 cursor-pointer hover:text-white transition-colors"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === 'textarea' && (
                    <Textarea
                      value={formData[question.id] || ''}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] resize-y"
                      rows={5}
                    />
                  )}

                  {question.type === 'text' && (
                    <Input
                      value={formData[question.id] || ''}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}

              {errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-200 font-semibold mb-2">Please complete the following:</h4>
                      <ul className="text-red-300 text-sm space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Continue to Contact Information
              </Button>
            </div>
          )}

          {currentStep === 'contact' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 p-6 rounded-xl">
                <h3 className="text-blue-200 font-bold text-xl mb-2">Complete Your Registration</h3>
                <p className="text-blue-300 text-sm">
                  Please provide your information to process your {rewardAmount} reward payment and store your survey data securely.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                  🔐 Account Credentials
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-white">
                      Login Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={contactInfo.userEmail}
                      onChange={(e) => handleContactChange('userEmail', e.target.value)}
                      placeholder="your.login@example.com"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-white">
                      Password <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="userPassword"
                      type="password"
                      value={contactInfo.userPassword}
                      onChange={(e) => handleContactChange('userPassword', e.target.value)}
                      placeholder="Create a secure password"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                  👤 Personal Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Contact Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your.contact@example.com"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white">
                      Phone Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={contactInfo.phoneNumber}
                      onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">
                      Country <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="country"
                      value={contactInfo.country}
                      onChange={(e) => handleContactChange('country', e.target.value)}
                      placeholder="e.g., Nigeria"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                  💳 Payment Information
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="stripeEmail" className="text-white">
                    Stripe Payment Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="stripeEmail"
                    type="email"
                    value={contactInfo.stripeEmail}
                    onChange={(e) => handleContactChange('stripeEmail', e.target.value)}
                    placeholder="payment@example.com"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-gray-400 text-xs">
                    This email will receive your {rewardAmount} Stripe payment
                  </p>
                </div>
              </div>

              {group === 'individual' && (
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                    🏦 Banking Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount" className="text-white">
                        Bank Account Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="bankAccount"
                        value={contactInfo.bankAccount}
                        onChange={(e) => handleContactChange('bankAccount', e.target.value)}
                        placeholder="1234567890"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-white">
                        Bank Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="bankName"
                        value={contactInfo.bankName}
                        onChange={(e) => handleContactChange('bankName', e.target.value)}
                        placeholder="e.g., First Bank of Nigeria"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {group === 'business' && (
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                    🏢 Business Registration
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-white">
                        Business Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="businessName"
                        value={contactInfo.businessName}
                        onChange={(e) => handleContactChange('businessName', e.target.value)}
                        placeholder="Your Company Ltd."
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessRegNumber" className="text-white">
                        Registration Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="businessRegNumber"
                        value={contactInfo.businessRegNumber}
                        onChange={(e) => handleContactChange('businessRegNumber', e.target.value)}
                        placeholder="RC123456789"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail" className="text-white">
                        Business Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={contactInfo.businessEmail}
                        onChange={(e) => handleContactChange('businessEmail', e.target.value)}
                        placeholder="info@yourcompany.com"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone" className="text-white">
                        Business Phone <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={contactInfo.businessPhone}
                        onChange={(e) => handleContactChange('businessPhone', e.target.value)}
                        placeholder="+234 1 234 5678"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessAddress" className="text-white">
                        Business Address <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="businessAddress"
                        value={contactInfo.businessAddress}
                        onChange={(e) => handleContactChange('businessAddress', e.target.value)}
                        placeholder="Complete business address"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-white">
                        Business Type <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="businessType"
                        value={contactInfo.businessType}
                        onChange={(e) => handleContactChange('businessType', e.target.value)}
                        placeholder="e.g., Technology, Manufacturing"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg border-b border-gray-600 pb-2">
                  ✅ Confirmation
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">
                    Age Confirmation <span className="text-red-400">*</span>
                  </Label>
                  <RadioGroup
                    value={contactInfo.age}
                    onValueChange={(value) => handleContactChange('age', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="18+" id="age-18" className="border-gray-500 text-purple-500" />
                      <Label htmlFor="age-18" className="text-gray-300">I am 18 or older</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-200 font-semibold mb-2">Please fix the following:</h4>
                      <ul className="text-red-300 text-sm space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={() => setCurrentStep('survey')}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back to Survey
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Submit Survey & Get ${rewardAmount}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}