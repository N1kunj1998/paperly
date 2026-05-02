import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Receipt, MessageSquareQuote, Zap, Share2, Download } from 'lucide-react'

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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Paperly</span>
        </div>
        <Badge variant="secondary">Free to use</Badge>
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

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-6 mb-16">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-gray-600">
              <Icon className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Template cards */}
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

      {/* Footer */}
      <footer className="border-t mt-20 py-8 text-center text-sm text-gray-400">
        Made with ❤️ by Paperly · Free forever for basic use
      </footer>
    </main>
  )
}
