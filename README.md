# BillZestPOS

Billing and point-of-sale software for shops, restaurants, pharmacies and wholesalers in Saudi Arabia.
Website in English and Arabic: https://www.billzestpos.com

## Files

| File | What it is |
| --- | --- |
| `index.html` | Public website (single page, English and Arabic) |
| `billzestpos-admin.html` | Admin panel (customers, leads, offers, prices). Needs a login |
| `supabase-setup.sql` | Database tables and security rules (run once in Supabase) |
| `sitemap.xml`, `robots.txt` | For Google Search Console |
| `CNAME` | Custom domain for GitHub Pages |

## Setup

1. Create a free project at supabase.com.
2. Run `supabase-setup.sql` in the SQL Editor.
3. Add your admin user (Authentication > Users), then run the last line of the SQL file with your email.
4. Copy the Project URL and the **anon public key** (Project Settings > API).
5. Paste them into `CFG` at the top of the script in `billzestpos-admin.html`, and into `db` in `index.html`.
6. Publish with GitHub Pages (Settings > Pages > Deploy from branch `main`, folder `/root`).

## Security

- Use only the `anon` key in these files. Never commit the `service_role` key or any password.
- Data is protected by Row Level Security in the database, not by hiding the admin page.
- The website can only add new leads. Only signed-in admins can read or change data.
