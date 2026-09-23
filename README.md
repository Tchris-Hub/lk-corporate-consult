# LK Corporate Consult

Premium, responsive corporate advisory site built with Next.js 16, React 19, Tailwind CSS 4, Motion and Lucide.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment on Netlify

Connect this folder to a Netlify site and use the detected Next.js settings. Netlify's Next.js runtime handles the App Router build; use `npm run build` as the build command. No raw video is stored in this project.

The media section uses a local optimized image facade. The privacy-enhanced YouTube player is added only after the visitor presses Play, so neither player scripts nor video bytes are part of the initial page visit. Keep future videos on YouTube rather than adding video files to `public/`.

## Performance decisions

- Static page generation and `next/image` responsive image optimization.
- Motion is limited to composited opacity/transform reveals and respects `prefers-reduced-motion`.
- `LazyMotion` loads the small DOM animation feature set rather than the full engine.
- The YouTube iframe uses `youtube-nocookie.com`, `loading="lazy"`, and only mounts on visitor intent.

## Publishing system: Neon + Prisma

The public knowledge centre is available at `/blog`, with individual SEO-ready articles at `/blog/[slug]`. The owner-only publishing desk is at `/admin`; it supports drafting, publishing, editing and deleting articles. Newsletter subscribers are stored separately and require an explicit opt-in.

1. Create a Neon project and copy its pooled connection string and direct connection string.
2. Copy `.env.example` to `.env`, then supply `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH`.
3. Run `npm run admin:hash -- "a-long-unique-password"` and place the resulting value in `ADMIN_PASSWORD_HASH`.
4. Run `npm run db:migrate -- --name init` to create the tables in Neon.
5. Add the same environment variables to Netlify and deploy.

Use the pooled URL for `DATABASE_URL` in the app and the direct URL for migrations. The project deliberately pins Prisma ORM 7.10.0, the current stable GA version, rather than the Prisma 8 release candidate.


## Newsletter email delivery

The site stores opted-in newsletter subscribers and queues alerts when an article is published. Netlify runs the delivery queue in the background and retries pending deliveries hourly. The sender uses Gmail SMTP through Nodemailer. By default, the existing `ADMIN_EMAIL` is used as the Gmail sender, so the only new secret required for this setup is `GMAIL_APP_PASSWORD` (the 16-character Google App Password for that Gmail account). If the sender account differs from `ADMIN_EMAIL`, set `GMAIL_USER` in Netlify as well. `GMAIL_DAILY_LIMIT` is optional and defaults to 500 as a conservative site safety budget.
