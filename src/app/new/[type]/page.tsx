import type { Metadata } from 'next'
import NewDocClient from './NewDocClient'

const docMeta: Record<string, { title: string; description: string }> = {
  invoice: {
    title: 'Create Invoice',
    description: 'Build a professional invoice with line items, tax, and due date. Download as PDF or share a link.',
  },
  receipt: {
    title: 'Create Receipt',
    description: 'Generate a payment receipt instantly. Download as PDF or share a link.',
  },
  quote: {
    title: 'Create Quote',
    description: 'Send professional quotes and estimates to win more clients. Download as PDF or share a link.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const meta = docMeta[type]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function NewDocPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  return <NewDocClient type={type} />
}
