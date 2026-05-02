import { pdf } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function downloadPDF(element: ReactElement<any>, filename: string) {
  // pdf() accepts any react-pdf Document element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(element as any).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
