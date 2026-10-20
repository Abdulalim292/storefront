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

3. Copy the example environment file if you want a local `.env` file:

   ```bash
   cp .env.example .env.local
   ```

   The app currently does not read environment variables, so this step is optional and `.env.local` can remain empty.

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

## Environment variables

No environment variables are currently required. `.env.example` is intentionally empty apart from a comment so future configuration can be documented without adding placeholder secrets.
