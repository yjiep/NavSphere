import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/admin')) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    newUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/admin/:path*']
}
