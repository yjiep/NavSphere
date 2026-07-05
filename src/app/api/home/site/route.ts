import { NextResponse } from 'next/server'
import { getFileContent } from '@/lib/github'

export const runtime = 'edge'

export async function GET() {
  try {
    const data = await getFileContent('src/navsphere/content/site.json')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in site API:', error)
    return NextResponse.json(
      { error: '获取站点数据失败' },
      { status: 500 }
    )
  }
}