import { Shield, Lock, CreditCard } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export function SecureNotice() {
  return (
    <Card className="bg-green-900/20 border-green-500/50 mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-green-100 font-semibold text-lg mb-2">
              🔒 Your Data is Secure and Protected
            </h3>
            <p className="text-green-200 mb-4">
              We take your privacy seriously. All survey responses and personal information are protected
              with enterprise-grade security measures.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-green-200 text-sm">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                <span className="text-green-200 text-sm">Stripe secure payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-200 text-sm">GDPR compliant</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}