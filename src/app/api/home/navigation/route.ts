import { NextResponse } from 'next/server'
import { getFileContent } from '@/lib/github'

export const runtime = 'edge'

export async function GET() {
  try {
    const data = await getFileContent('src/navsphere/content/navigation.json')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in navigation API:', error)
    return NextResponse.json(
      { error: '获取导航数据失败' },
      { status: 500 }
    )
  }
}