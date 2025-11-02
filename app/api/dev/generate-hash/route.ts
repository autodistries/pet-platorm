import { NextResponse } from "next/server"
import * as bcrypt from "bcrypt"

export async function GET() {
  const password = "Admin123!"
  const hash = await bcrypt.hash(password, 10)
  
  return NextResponse.json({
    password,
    hash,
    sql: `UPDATE customers SET password_hash = '${hash}' WHERE email = 'admin@petshop.com';`
  })
}
