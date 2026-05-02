import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 11, padding: 48, color: '#111827', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 },
  title: { fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: 3, color: '#111827' },
  docNumber: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  dateBlock: { textAlign: 'right', color: '#6b7280', fontSize: 10 },
  section: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  partyBlock: { flex: 1 },
  partyLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  partyName: { fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 2 },
  partyDetail: { color: '#6b7280', fontSize: 10, marginBottom: 1 },
  table: { marginBottom: 24 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 6, marginBottom: 4 },
  tableHeaderText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalsBlock: { alignItems: 'flex-end', marginBottom: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3 },
  totalLabel: { color: '#6b7280', width: 100, textAlign: 'right', marginRight: 16 },
  totalValue: { width: 80, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  divider: { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginBottom: 6, width: 196 },
  grandTotal: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#111827' },
  notes: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 16, marginTop: 8 },
  notesLabel: { fontFamily: 'Helvetica-Bold', fontSize: 10, marginBottom: 4, color: '#374151' },
  notesText: { color: '#6b7280', fontSize: 10, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', color: '#d1d5db', fontSize: 9 },
})

interface LineItem { description: string; qty: number; rate: number }
interface ReceiptPDFProps {
  from: { name: string; email: string }
  to: { name: string; email: string }
  receipt_number: string
  date: string
  line_items: LineItem[]
  notes: string
}

export default function ReceiptPDF({ from, to, receipt_number, date, line_items, notes }: ReceiptPDFProps) {
  const total = line_items.reduce((s, i) => s + i.qty * i.rate, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>RECEIPT</Text>
            <Text style={styles.docNumber}>#{receipt_number}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text>{date}</Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.section}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{from.name || '—'}</Text>
            <Text style={styles.partyDetail}>{from.email}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Issued To</Text>
            <Text style={styles.partyName}>{to.name || '—'}</Text>
            <Text style={styles.partyDetail}>{to.email}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {line_items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>${Number(item.rate).toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.qty * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalsBlock}>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>Total Paid</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>Made with Paperly · paperly.app</Text>
      </Page>
    </Document>
  )
}
