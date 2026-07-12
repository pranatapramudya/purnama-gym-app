import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma as db } from '@/lib/prisma'

export async function POST(req: Request) {
  // Dapatkan WEBHOOK_SECRET dari Clerk Dashboard
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return new Response('Error: Missing secret', { status: 500 });
  }

  // Dapatkan headers untuk verifikasi svix
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // Pastikan headers lengkap
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  // Ambil payload body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Buat instance Webhook svix dengan secret key
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Lakukan verifikasi payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Webhook verification failed:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Tangani event webhook dari Clerk
  const eventType = evt.type
  const { id, email_addresses, first_name, last_name } = evt.data as any;

  // Pembersihan Nama 
  const cleanPart = (part: any) => {
    if (!part || String(part).toLowerCase() === "null" || String(part).trim() === "") {
      return "";
    }
    return String(part).trim();
  };

  const fName = cleanPart(first_name);
  const lName = cleanPart(last_name);
  const fullName = `${fName} ${lName}`.trim() || "Member Gym";
  const email = (email_addresses?.[0]?.email_address || "no-email@gym.com").toLowerCase();

  // 1. CREATE (user.created)
  if (eventType === 'user.created') {
    try {
      const shortId = `PRN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const superAdminEmailsString = process.env.SUPER_ADMIN_EMAILS || "";
      const superAdminEmails = superAdminEmailsString
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
        
      const isSuperAdmin = superAdminEmails.includes(email);
      const role = isSuperAdmin ? 'SUPER_ADMIN' : 'MEMBER';

      console.log(`[WEBHOOK] Incoming Email:`, email);
      console.log(`[WEBHOOK] Parsed VIP List:`, superAdminEmails);
      console.log(`[WEBHOOK] Assigned Role:`, role);

      // Sinkronisasi insert user baru ke Database PostgreSQL (Prisma)
      await db.user.create({
        data: {
          clerkUserId: id, // Mapping `id` dari Clerk ke `clerkUserId` database kita
          email: email,
          name: fullName,
          role: role,
          shortId: shortId,
        },
      });
      console.log(`✅ [${eventType}] Sync Success: User ${id} ditambahkan ke DB dengan shortId ${shortId}.`);
      return new Response('Sync Success', { status: 200 });
    } catch (dbError) {
      console.error('❌ Database Ops Error:', dbError);
      return new Response('Database Error', { status: 500 });
    }
  }

  // 2. UPDATE (user.updated)
  if (eventType === 'user.updated') {
    try {
      await db.user.update({
        where: { clerkUserId: id },
        data: {
          email: email,
          name: fullName,
        },
      });
      console.log(`✅ [${eventType}] Update Success: User ${id} diperbarui.`);
      return new Response('Update Success', { status: 200 });
    } catch (dbError) {
      console.error('❌ Database Ops Error during update:', dbError);
      return new Response('Database Error', { status: 500 });
    }
  }

  return new Response('Event ignored', { status: 200 })
}