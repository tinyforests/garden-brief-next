
# Gardener & Son — Garden Brief (Next.js exact-look build)

This Next.js app matches the canvas look & feel and is ready to share as a standalone link.
CSP headers allow Notion embedding too (optional).

## Run locally
```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy (standalone link)
- **Vercel (recommended)**: Import this folder → Deploy → Share the vercel.app URL or add a custom domain like `brief.gardenerandson.com.au`.
- **Netlify**: Supported for Next.js apps as well.

## Customise
- Colours: `tailwind.config.js` (`gsbg`, `gspaper`)
- Questions: `app/page.jsx` (`SEED_QUESTIONS`)
- Email recipient: `emailSummary()`
