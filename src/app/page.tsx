'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText, Receipt, MessageSquareQuote,
  Zap, Share2, Download, CheckCircle2,
  Star, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'

const templates = [
  {
    type: 'invoice',
    icon: FileText,
    title: 'Invoice',
    description: 'Bill clients professionally with line items, tax, and due dates',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    type: 'receipt',
    icon: Receipt,
    title: 'Receipt',
    description: 'Generate payment receipts instantly for any transaction',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    type: 'quote',
    icon: MessageSquareQuote,
    title: 'Quote',
    description: 'Send professional quotes and estimates to win more clients',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

const features = [
  { icon: Zap, text: 'Ready in 60 seconds' },
  { icon: Download, text: 'Download as PDF' },
  { icon: Share2, text: 'Share via link' },
]

const steps = [
  {
    number: '01',
    title: 'Pick a template',
    description: 'Choose from Invoice, Receipt, or Quote. No account needed to get started.',
  },
  {
    number: '02',
    title: 'Fill in your details',
    description: 'Enter your info, client details, and line items. Preview updates in real time.',
  },
  {
    number: '03',
    title: 'Download or share',
    description: 'Export a clean PDF instantly, or share a link your client can view in their browser.',
  },
]

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Freelance Designer',
    avatar: 'SK',
    content: 'I used to spend 20 minutes wrestling with Word every time I needed an invoice. Paperly takes me 60 seconds. My clients love how professional it looks.',
    rating: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Independent Contractor',
    avatar: 'MT',
    content: 'The shareable link feature is a game changer — I just send the URL and my clients can view it on any device. No more "I can\'t open the attachment" emails.',
    rating: 5,
  },
  {
    name: 'Priya M.',
    role: 'Consultant',
    avatar: 'PM',
    content: "Finally a tool that doesn't require a 30-minute onboarding and a credit card just to make a quote. Clean, fast, does exactly what I need.",
    rating: 5,
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for occasional use',
    features: [
      '3 document downloads / month',
      'All 3 templates',
      'Shareable links',
      'PDF export',
      'Paperly watermark',
    ],
    cta: 'Get started free',
    ctaHref: '/new/invoice',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For freelancers who bill regularly',
    features: [
      'Unlimited downloads',
      'No watermark',
      'Saved documents',
      'Custom logo upload',
      'Shareable links',
      'Priority support',
    ],
    cta: 'Start Pro',
    ctaHref: '/login',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Business',
    price: '$29',
    period: 'per month',
    description: 'For teams and growing businesses',
    features: [
      'Everything in Pro',
      'Team seats (up to 5)',
      'Client portal',
      'Custom link domain',
      'Email delivery to clients',
      'Stripe payment links',
    ],
    cta: 'Start Business',
    ctaHref: '/login',
    highlighted: false,
  },
]

const faqs = [
  {
    question: 'Do I need an account to use Paperly?',
    answer: 'No. You can create and download documents without signing up. An account lets you save documents, access them later, and unlock Pro features.',
  },
  {
    question: 'What file formats can I export?',
    answer: 'PDF is the primary export format — print-ready and professional. Shareable links let anyone view the document in their browser without downloading anything.',
  },
  {
    question: 'Can I add my company logo?',
    answer: 'Yes — logo upload is available on Pro and Business plans. Your logo appears on the live preview and in the exported PDF.',
  },
  {
    question: 'Is my data stored securely?',
    answer: 'Documents are stored in Supabase (hosted Postgres) with row-level security. Anonymous documents are not linked to any account unless you sign in.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes. Cancel any time from your dashboard — no lock-in, no cancellation fees. You keep access until the end of your billing period.',
  },
  {
    question: "What's the difference between a quote and an invoice?",
    answer: 'A quote is sent before work begins — it estimates the cost. An invoice is sent after work is done requesting payment. Paperly supports both.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        className="w-full flex items-center justify-between text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <p className="mt-3 text-gray-500 text-sm leading-relaxed">{answer}</p>
      )}
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Paperly</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Pricing
          </a>
          <Badge variant="secondary">Free to use</Badge>
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" variant="outline">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">Sign in</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
          No signup required
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Professional documents
          <br />
          <span className="text-blue-600">in under 60 seconds</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
          Create invoices, receipts, and quotes. Download as PDF or share a link. No account needed.
        </p>

        <div className="flex items-center justify-center gap-6 mb-16">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-gray-600">
              <Icon className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {templates.map(({ type, icon: Icon, title, description, color, iconColor }) => (
            <Link key={type} href={`/new/${type}`}>
              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${color}`}>
                <Icon className={`h-8 w-8 mb-3 ${iconColor}`} />
                <h2 className="font-semibold text-gray-900 text-lg mb-1">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
                <Button className="w-full mt-4" size="sm">
                  Create {title} →
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 mt-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 max-w-md mx-auto">Three steps from zero to a professional document, no learning curve required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Loved by freelancers</h2>
            <p className="text-gray-500">Thousands of invoices created. Here's what people say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, honest pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-6 border-2 relative flex flex-col ${
                  tier.highlighted
                    ? 'border-blue-500 bg-white shadow-lg'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-xs">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-sm text-gray-400">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-gray-500">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.ctaHref}>
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? 'default' : 'outline'}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
            <p className="text-gray-500">Everything you need to know about Paperly.</p>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start creating documents now</h2>
          <p className="text-blue-100 mb-8">No account. No credit card. Just a clean document in 60 seconds.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/new/invoice">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Create Invoice →
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Sign up free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900">Paperly</span>
            <span className="text-gray-400 text-sm ml-2">Professional documents, instantly.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#pricing" className="hover:text-gray-600 transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-gray-600 transition-colors">Sign in</Link>
            <span>© 2026 Paperly</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
