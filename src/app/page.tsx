import { NavigationContent } from '@/components/navigation-content'
import { Metadata } from 'next/types'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Container } from '@/components/ui/container'
import type { SiteConfig } from '@/types/site'
import { getProcessedData } from '@/lib/data-loader'

export const dynamic = 'force-dynamic'

async function getData() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const [navRes, siteRes] = await Promise.all([
    fetch(baseUrl + '/api/home/navigation', { cache: 'no-store' }),
    fetch(baseUrl + '/api/home/site', { cache: 'no-store' })
  ])
  const navDataRaw = await navRes.json()
  const siteDataRaw = await siteRes.json()
  return getProcessedData(navDataRaw, siteDataRaw)
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { siteData } = await getData()
    return {
      title: siteData.basic.title,
      description: siteData.basic.description,
      keywords: siteData.basic.keywords,
      icons: { icon: siteData.appearance.favicon },
    }
  } catch {
    return { title: 'NavSphere' }
  }
}

export default async function HomePage() {
  const { navigationData, siteData } = await getData()

  return (
    <Container>
      <NavigationContent navigationData={navigationData} siteData={siteData} />
      <ScrollToTop />
    </Container>
  )
}