import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Clock, DollarSign, MapPin } from 'lucide-react'

export function SurveyIntro() {
  return (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Info className="w-6 h-6 mr-3 text-blue-400" />
            About the NAVADA Data Initiative
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-lg">
            Welcome to the NAVADA Data Initiative! We're conducting groundbreaking research on AI and robotics
            adoption across Nigeria and Africa. Your participation helps us understand current trends, challenges,
            and opportunities in the rapidly evolving tech landscape.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <Clock className="w-8 h-8 text-blue-400 mb-2" />
              <h4 className="text-white font-semibold">Quick & Easy</h4>
              <p className="text-gray-400 text-sm">5-10 minutes per survey</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-400 mb-2" />
              <h4 className="text-white font-semibold">Get Rewarded</h4>
              <p className="text-gray-400 text-sm">£5-15 GBP via Stripe</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <MapPin className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-white font-semibold">Africa-Focused</h4>
              <p className="text-gray-400 text-sm">Regional insights matter</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <Info className="w-8 h-8 text-yellow-400 mb-2" />
              <h4 className="text-white font-semibold">Research Impact</h4>
              <p className="text-gray-400 text-sm">Shape AI/robotics future</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Choose Survey</h4>
              <p className="text-gray-300 text-sm">Select Individual or Business survey based on your perspective</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Answer Questions</h4>
              <p className="text-gray-300 text-sm">Complete 20 multiple choice questions about AI and robotics</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Submit Details</h4>
              <p className="text-gray-300 text-sm">Provide contact information for secure payment processing</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Get Paid</h4>
              <p className="text-gray-300 text-sm">Receive your reward within 72 hours via Stripe</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/60 via-violet-900/40 to-indigo-900/50 border border-purple-500/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10"></div>
        <CardContent className="relative pt-8 pb-8">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-purple-500/30 rounded-full border border-purple-400/50 mb-4">
              <span className="text-purple-200 text-sm font-semibold tracking-wide uppercase">Essential Guidelines</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Important Information</h4>
            <p className="text-purple-100 text-sm">Please review these key points before participating</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-800/70 to-violet-800/70 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm mb-1">Participation Eligibility</h5>
                    <p className="text-white/90 text-sm">Each participant can complete both surveys (Individual + Business)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800/70 to-violet-800/70 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm mb-1">Submission Policy</h5>
                    <p className="text-white/90 text-sm">Surveys can only be submitted once per email address</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800/70 to-violet-800/70 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm mb-1">Age Requirement</h5>
                    <p className="text-white/90 text-sm">You must be 18+ years old to participate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 rounded-xl p-4 border border-green-500/40">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">💰</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm mb-1">Payment Processing</h5>
                    <p className="text-green-100 text-sm">Payment is processed automatically within 72 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-xl p-4 border border-blue-500/40">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">🔒</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm mb-1">Privacy & Security</h5>
                    <p className="text-blue-100 text-sm">All responses are anonymous and used for research purposes only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/30">
            <div className="bg-gradient-to-r from-purple-600/30 to-violet-600/30 rounded-lg p-4 border border-purple-400/40">
              <p className="text-white text-center text-sm">
                <span className="font-semibold">Ready to get started?</span> Choose your survey type above and help shape the future of AI & robotics in Africa.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}