# MIYS sign-in setup

The site now includes a navy-and-gold sign-in modal. The interface is integrated, but real accounts remain **disabled until Supabase is configured**.

## 1. Create a Supabase project
1. Create a project at https://supabase.com.
2. In the project dashboard, find the Project URL and the public publishable key (or legacy `anon` key).
3. Open `supabase-config.js` and replace `YOUR_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` with those values.
4. Commit and push the changed files to your website repository.

Never put a `service_role` key or any secret key in this file. Browser code is public.

## 2. Configure authentication
In Supabase Authentication settings:
- Enable email/password sign-in.
- Configure the site URL to your deployed MIYS website URL.
- Add your local development URL if you use one.
- Keep email confirmation enabled for real users and test the confirmation link.
- Use a strong password policy and sensible rate limits.

## 3. Important security note
This initial stage only handles authentication (creating an account, signing in, signing out and maintaining a session). It does not yet create a public profile, store papers, or provide forum/private-group permissions. Those features need database tables and carefully configured Row Level Security (RLS) policies before use. Never collect unnecessary personal details from young contributors; establish appropriate privacy, consent and safeguarding procedures first.

## Files changed
- `index.html` — adds the sign-in button, modal and Supabase script.
- `styles.css` — styles the responsive modal in the existing MIYS design.
- `script.js` — modal behavior and Supabase authentication calls.
- `supabase-config.js` — public project configuration placeholders.

Until configured, the modal displays a setup message instead of pretending to sign users in.
