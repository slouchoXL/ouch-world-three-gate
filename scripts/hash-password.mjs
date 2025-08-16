// scripts/hash-password.mjs
import crypto from 'node:crypto';

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash-password.mjs "yourpassword"');
  process.exit(1);
}
const hash = crypto.createHash('sha256').update(pwd).digest('hex');
console.log(hash);
