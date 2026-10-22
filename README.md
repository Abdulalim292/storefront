# Noor Alam Machineries Storefront

A product and equipment storefront built with Next.js App Router, React, and Tailwind CSS. Product and branch information is maintained in the `data/` directory, and brand and product artwork lives in `public/`.

## Requirements

- Node.js 20.9 or newer (required by Next.js 16)
- npm (the repository includes `package-lock.json`)
- Internet access to load the externally hosted equipment and product images, and the embedded Google Maps view

## Setup

1. Clone or copy this repository to your computer.
2. Install dependencies from the lockfile:

   ```bash
   npm ci
   ```

3. Copy the example environment file if you want to configure local photo uploads:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values as described under [Photo uploads](#photo-uploads). The storefront works without them, but the photo manager does not.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run ESLint |

## Project structure

- `app/` — routes, layouts, and page metadata
- `components/` — storefront, product, cart, and chat UI
- `context/` — client-side cart state (saved in browser local storage)
- `data/` — product, equipment, and branch data
- `lib/` — shared utilities
- `public/` — logos, icons, and locally stored product images

To update the catalog, edit `data/catalog.json`; products, equipment models, categories, and their prices are kept there as data. Add an item to the `products` array with a unique `id`, `name`, `description`, `category`, `images`, and image attribution fields. Set `price` to a number when you want to publish a price, or `null` while the item remains quote-only. Add category labels and URL values to the `categories` array. Equipment entries use the `equipment` category and can include a `specifications` array. Remote image hosts must also be allowed in `next.config.ts` for Next.js image optimization.

## Photo uploads

Product photos can be changed from the deployed site using the protected photo manager at `/admin/products`. Uploaded photos are stored in Supabase Storage and the product-to-photo mapping is saved in Supabase, so changes remain after a redeploy.

### One-time setup

1. Create a Supabase project.
2. In Supabase, open **SQL Editor**, create a query, paste in the contents of [`scripts/product-photo-storage.sql`](scripts/product-photo-storage.sql), and run it. This creates the photo mapping table and the public bucket used to display photos.
3. In your Supabase project's API settings, copy the project URL and **service role** key. The service role key is secret: use it only as a server-side environment variable and never add it to client-side code.
4. Set these four environment variables in your hosting provider's project settings:

   | Variable | Value |
   | --- | --- |
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `ADMIN_PASSWORD` | A strong, unique password for the photo manager |
   | `ADMIN_SESSION_SECRET` | A random secret with at least 32 characters |

   For example, generate a session secret locally with `openssl rand -base64 32`.

5. Make sure the variables are available to the production deployment, then redeploy the site. For local development, put them in `.env.local` instead.

### Replace a product photo

1. Open `https://your-site-address/admin/products` in a browser.
2. Sign in with the `ADMIN_PASSWORD` you configured above.
3. Search for the product by name, then select it from the catalog list. Equipment models are listed there too.
4. Choose a JPG, PNG, or WebP photo that is no larger than 4 MB. The preview shows the selected file before upload.
5. Select **Save new photo** and wait for the success message. The new photo appears on the product card, product detail page, cart, and relevant equipment sections.

Sign out when finished. The photo manager does not change product names, descriptions, prices, or other catalog details. If Supabase or the four environment variables are not configured, the storefront keeps showing its existing catalog photos and uploads will not work.

### Change photos in the project instead

You can also add a photo under `public/` and edit the item's `images` array in `data/catalog.json`. For example, a file at `public/images/products/new-part.webp` is referenced as `/images/products/new-part.webp`. Commit and redeploy the project for that change to reach the site. A photo uploaded through the admin page takes precedence over this catalog image for that item.
