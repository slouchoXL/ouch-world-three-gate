// netlify/functions/redeem.js
import crypto from 'node:crypto';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/** Pre-filled password hashes */
const PASSWORDS = {
  "825685087a94db9bca216ccd5aadea6ee7bb97559d3b6ee2e2dad7d33b29d18c": { title: "Love is Fear", bucket: process.env.S3_BUCKET, key: "tracks/Love-is-Fear.wav" },
  "8a863b145dc6e4ed7ac41c08f7536c476ebac7509e028ed2b49f8bd5a3562b9f": { title: "Test1",        bucket: process.env.S3_BUCKET, key: "tracks/Test1.wav" }
};

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
});

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  let body = {};
  try { body = await req.json(); } catch { return new Response('Bad Request', { status: 400 }); }
  const password = (body?.password || '').toString();
  if (!password) return new Response('Bad Request', { status: 400 });

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const entry = PASSWORDS[hash];
  if (!entry) return new Response('Unauthorized', { status: 401 });

  const cmd = new GetObjectCommand({ Bucket: entry.bucket, Key: entry.key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 120 }); // 2 minutes

  return new Response(JSON.stringify({ url, title: entry.title }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
};
