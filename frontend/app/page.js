import Link from 'next/link'
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Truck, 
  Shield,
  Leaf,
  BarChart3,
  Clock,
  Store,
  CheckCircle,
  Award,
  Package,
  FileText,
  CreditCard
} from 'lucide-react'
import DigiFarmLogo from '@/components/ui/DigiFarmLogo'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <DigiFarmLogo size="lg" />
            <div className="flex items-center gap-4">
              <Link href="/signin" className="btn-outline">
                Sign In
              </Link>
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#e8f5e9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#2d2d2d] leading-tight mb-6">
                Turn Market Data Into{' '}
                <span className="text-[#2d7d46]">Better Farm Decisions</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                DigiFarm connects farmers and FPOs with market intelligence, 
                AI-powered selling recommendations and verified buyers — 
                from price discovery to payment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="btn-primary flex items-center gap-2">
                  Explore DigiFarm <ArrowRight size={20} />
                </Link>
                <Link href="/login" className="btn-secondary">
                  Join as Farmer
                </Link>
                <Link href="/login?role=buyer" className="btn-outline">
                  I&apos;m a Buyer
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="space-y-4">
                {[
                  { icon: Leaf, label: 'Farmer/FPO', color: 'text-[#2d7d46]' },
                  { icon: BarChart3, label: 'Market Intelligence', color: 'text-blue-600' },
                  { icon: TrendingUp, label: 'AI Decision Engine', color: 'text-purple-600' },
                  { icon: Store, label: 'Best Market', color: 'text-orange-600' },
                  { icon: Users, label: 'Best Buyer', color: 'text-pink-600' },
                  { icon: Truck, label: 'Logistics', color: 'text-cyan-600' },
                  { icon: CheckCircle, label: 'Payment', color: 'text-green-600' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                    <div className={`p-2 rounded-lg bg-[#e8f5e9] ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {index < 6 && (
                      <ArrowRight size={16} className="text-gray-400 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#2d2d2d] mb-12">
            The Challenges Farmers Face
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Fragmented Information',
                description: 'Farmers cannot easily compare prices across markets.'
              },
              {
                icon: Shield,
                title: 'Weak Bargaining Power',
                description: 'Small farmers struggle to access large buyers.'
              },
              {
                icon: Users,
                title: 'Buyer Discovery',
                description: 'Farmers often lack access to verified buyers.'
              },
              {
                icon: Truck,
                title: 'Logistics & Storage',
                description: 'Transport and storage can reduce actual earnings.'
              },
              {
                icon: Award,
                title: 'Quality Uncertainty',
                description: 'Quality differences create disputes.'
              },
              {
                icon: Clock,
                title: 'Payment Uncertainty',
                description: 'Farmers need reliable and transparent payments.'
              }
            ].map((problem, index) => {
              const Icon = problem.icon
              return (
                <div key={index} className="card hover:border-[#2d7d46] border-2 border-transparent">
                  <div className="bg-[#e8f5e9] p-3 rounded-lg inline-block mb-4">
                    <Icon size={24} className="text-[#2d7d46]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">{problem.title}</h3>
                  <p className="text-gray-600">{problem.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#e8f5e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#2d2d2d] mb-12">
            The DigiFarm Solution
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { icon: Store, title: 'WHERE?', subtitle: 'Best Market' },
              { icon: Clock, title: 'WHEN?', subtitle: 'Best Selling Window' },
              { icon: Users, title: 'WHOM?', subtitle: 'Best Buyer' },
              { icon: Truck, title: 'HOW?', subtitle: 'Optimized Logistics' }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-[#1a4d3e] text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a4d3e]">{item.title}</h3>
                  <p className="text-gray-600">{item.subtitle}</p>
                </div>
              )
            })}
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">
              Expected Net Realization
            </h3>
            <p className="text-xl text-gray-600">
              Selling Price − Transport − Storage − Risk
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#2d2d2d] mb-12">
            How DigiFarm Works
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Add Produce', icon: Package },
              { step: '2', title: 'Collect Market Data', icon: TrendingUp },
              { step: '3', title: 'Analyze Prices', icon: BarChart3 },
              { step: '4', title: 'AI Forecast', icon: TrendingUp },
              { step: '5', title: 'Sale Window', icon: Clock },
              { step: '6', title: 'Buyer Matching', icon: Users },
              { step: '7', title: 'Quality Assessment', icon: Award },
              { step: '8', title: 'Digital Lot', icon: Package },
              { step: '9', title: 'Offers', icon: FileText },
              { step: '10', title: 'Logistics', icon: Truck },
              { step: '11', title: 'Delivery', icon: CheckCircle },
              { step: '12', title: 'Payment', icon: CreditCard },
              { step: '13', title: 'Trusted Record', icon: Shield }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="bg-[#e8f5e9] rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-[#1a4d3e] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {item.step}
                  </div>
                  <Icon size={20} className="mx-auto mb-2 text-[#2d7d46]" />
                  <p className="text-sm font-medium text-[#2d2d2d]">{item.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#1a4d3e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <DigiFarmLogo className="text-white" />
            <p className="text-sm text-white/70 mt-4 md:mt-0">
              © 2026 DigiFarm. Smart India Hackathon Project
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}