# ouch.world — MetaHuman Three.js + Password Gate (Netlify)

This project is pre-filled with two passwords:

- **"Love is Fear"** → unlocks **Love is Fear** (`tracks/Love-is-Fear.wav`)
- **"Test1"** → unlocks **Test1** (`tracks/Test1.wav`)

## Run locally
```bash
cd ouch-world-three-gate-prefilled
./get_libs.sh
# put your model at:
# assets/metahuman.glb
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to Netlify

1) Create a Netlify account → create a new site → drag this folder in.

2) In **Site settings → Environment variables**, add:
```
S3_REGION=us-east-1              # or your chosen region
S3_BUCKET=ouch-world-music       # or your bucket name
S3_ACCESS_KEY=<AWS Access Key ID>
S3_SECRET=<AWS Secret Access Key>
```

3) Upload your WAVs to S3:
```
s3://ouch-world-music/tracks/Love-is-Fear.wav
s3://ouch-world-music/tracks/Test1.wav
```
(Keep the names exactly as above, or edit `netlify/functions/redeem.js` to match your keys.)

4) Visit your site → enter "Love is Fear" or "Test1" → a signed URL will start the download.

## Change or add passwords
- Generate a SHA‑256 hash:
```bash
node scripts/hash-password.mjs "newpassword"
```
- Edit `netlify/functions/redeem.js` → add a new entry in `PASSWORDS` with your title and S3 key.
- Deploy again.

## Notes
- WAVs stay **private** in S3; users only get a short‑lived signed link via the Netlify function.
- If you later use Draco for your GLB, add decoder files to `libs/draco/` and enable DRACO in `main.module.js` (instructions inline).
