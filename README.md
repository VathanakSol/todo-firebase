This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI task suggestions

Firebase AI Logic can suggest steps for the task currently in the input. The task text is sent to Gemini when the user clicks the AI button. Suggestions are saved only when the user adds them individually.

1. Enable Firebase AI Logic with the Gemini Developer API in the Firebase console, and register the web app with App Check using reCAPTCHA Enterprise.
2. Add `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=your_site_key` to `.env.local` and restart the development server. Use the site key registered with App Check; this key is public and is bundled into the browser app.
3. In local development, click the AI button once and look for the App Check debug token in the browser developer console. In Firebase Console, open **Security > App Check > Apps**, select the web app's menu, and register the token under **Manage debug tokens**. Retry the request.
4. Keep the debug token private and never deploy a debug build. For production, configure the same environment variable in the hosting provider, register the deployed domain on the reCAPTCHA key, and rebuild the app. Do not add localhost to the reCAPTCHA domain list.

App Check must be enforced for Firebase AI Logic. Verify model availability, quota and billing for the configured `gemini-3.8-flash` model before use. See the [Firebase AI Logic setup guide](https://firebase.google.com/docs/ai-logic/get-started?platform=web) and [App Check debug guide](https://firebase.google.com/docs/app-check/web/debug-provider).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
