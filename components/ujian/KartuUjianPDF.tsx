'use client'

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import { KartuUjianData } from '@/types/kartu'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89

const MARGIN_TOP = 20
const MARGIN_BOTTOM = 20
const MARGIN_LEFT = 15
const MARGIN_RIGHT = 15

const COLS = 2
const ROWS = 5
const CARDS_PER_PAGE = COLS * ROWS

const availableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const availableHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM

const GAP = 5
const CARD_WIDTH = (availableWidth - GAP * (COLS - 1)) / COLS
const CARD_HEIGHT = (availableHeight - GAP * (ROWS - 1)) / ROWS

const styles = StyleSheet.create({
  page: {
    paddingTop: MARGIN_TOP,
    paddingBottom: MARGIN_BOTTOM,
    paddingLeft: MARGIN_LEFT,
    paddingRight: MARGIN_RIGHT,
    fontFamily: 'Helvetica',
  },
  row: {
    flexDirection: 'row',
    marginBottom: GAP,
  },
  lastRow: {
    flexDirection: 'row',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'solid',
    padding: 8,
    marginRight: GAP,
    backgroundColor: '#FFFFFF',
  },
  lastCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'solid',
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 4,
  },
  schoolName: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  logo: {
    width: 30,
    height: 30,
    marginBottom: 3,
    objectFit: 'contain',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  infoSection: {
    flex: 1,
    paddingRight: 6,
  },
  qrSection: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 60,
    height: 60,
  },
  qrLabel: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
    color: '#666666',
  },
  infoRow: {
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  examInfoSection: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#999999',
  },
  examTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  examDetail: {
    fontSize: 7,
    color: '#333333',
    marginBottom: 1,
  },
  cardFooter: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 6,
    color: '#999999',
    textAlign: 'center',
  },
  emptyPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
})

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours} jam`
  return `${hours} jam ${mins} menit`
}

function ExamCard({
  data,
  isLastCard,
}: {
  data: KartuUjianData
  isLastCard: boolean
}) {
  const { siswa, ujian, sekolah, qrData } = data

  return (
    <View style={isLastCard ? styles.lastCard : styles.card}>
      <View style={styles.cardHeader}>
        {sekolah.logo_url && (
          <Image
            src={sekolah.logo_url}
            style={styles.logo}
          />
        )}
        <Text style={styles.schoolName}>
          {truncateText(sekolah.nama_sekolah, 40)}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NISN</Text>
            <Text style={styles.infoValue}>{siswa.nisn}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama</Text>
            <Text style={styles.infoValue}>{truncateText(siswa.nama, 25)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kelas</Text>
            <Text style={styles.infoValue}>
              {siswa.kelas?.nama_kelas || '-'}
            </Text>
          </View>

          <View style={styles.examInfoSection}>
            <Text style={styles.examTitle}>{truncateText(ujian.judul, 30)}</Text>
            <Text style={styles.examDetail}>Kode: {ujian.kode_ujian}</Text>
            <Text style={styles.examDetail}>Durasi: {formatDuration(ujian.durasi)}</Text>
          </View>
        </View>

        <View style={styles.qrSection}>
          {qrData && qrData.startsWith('data:image') ? (
            <Image src={qrData} style={styles.qrImage} />
          ) : (
            <View style={[styles.qrImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 6, color: '#999' }}>QR</Text>
            </View>
          )}
          <Text style={styles.qrLabel}>Scan untuk login</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Cerdas-CBT by EAS Creative Studio</Text>
      </View>
    </View>
  )
}

export function KartuUjianPDF({ data }: { data: KartuUjianData[] }) {
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.emptyPage}>
            <Text style={styles.emptyText}>Tidak ada data kartu ujian</Text>
          </View>
        </Page>
      </Document>
    )
  }

  const pages = chunkArray(data, CARDS_PER_PAGE)

  return (
    <Document
      title="Kartu Ujian"
      author="Cerdas-CBT"
      subject="Kartu Ujian Siswa"
      creator="Cerdas-CBT by EAS Creative Studio"
    >
      {pages.map((pageCards, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {Array.from({ length: ROWS }).map((_, rowIndex) => {
            const startIdx = rowIndex * COLS
            const rowCards = pageCards.slice(startIdx, startIdx + COLS)

            if (rowCards.length === 0) return null

            const isLastRow = rowIndex === ROWS - 1

            return (
              <View key={rowIndex} style={isLastRow ? styles.lastRow : styles.row}>
                {rowCards.map((cardData, colIndex) => (
                  <ExamCard
                    key={startIdx + colIndex}
                    data={cardData}
                    isLastCard={colIndex === rowCards.length - 1}
                  />
                ))}
              </View>
            )
          })}
        </Page>
      ))}
    </Document>
  )
}

export default KartuUjianPDF
