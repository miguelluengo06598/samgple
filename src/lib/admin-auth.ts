import { NextRequest } from 'next/server'

export function verifyAdminSecret(request: NextRequest): boolean {
  const secret = request.cookies.get('admin_secret')?.value
  return secret === process.env.ADMIN_SECRET
}

export function verifyAdminSecretFromHeader(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET
}