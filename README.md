# Mini Kitchen

Mini Kitchen is a responsive restaurant website and management workspace for a small neighbourhood restaurant. It includes a public menu and restaurant story, opening hours, table reservations, an AI guest assistant, and an authenticated admin area for managing reservations and menu items.

Built with Next.js 16 App Router, React 19, Tailwind CSS 4, Supabase, and TypeScript.

## Features

### Public restaurant site

- Responsive restaurant landing page with:
  - Hero section and navigation
  - Restaurant introduction and story
  - Menu showcase
  - Opening hours and location details
  - Reservation form
  - Newsletter signup presentation
  - Footer and social link
- Mobile navigation menu
- Floating AI assistant for menu questions and reservation requests
- Accessible form labels, status messages, and interactive controls

### Reservations

- Reservation form for:
  - Name
  - Email
  - Date
  - Time
  - Guest count
  - Occasion
  - Notes or dietary requirements
- Server-side validation before saving
- Reservation status workflow:
  - `pending`
  - `confirmed`
  - `cancelled`
- Clear success and error states
- AI-assisted reservation drafting with explicit submission confirmation

An AI-generated reservation is only a request. It is not confirmed until the restaurant confirms it from the admin workspace.

### Admin workspace

- Admin account creation and sign-in
- Cookie-based authenticated sessions
- Dashboard overview
- Reservation management
- Menu item creation and editing
- Menu image uploads through Supabase Storage
- Protected admin routes

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project
- An OpenRouter API key if the AI assistant is enabled

Check your installed versions:

```bash
node --version
npm --version
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase public connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Server-only Supabase access for admin actions
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Secret used to sign admin session tokens.
# Use a long random value of at least 32 characters.
AUTH_SECRET=replace-with-a-long-random-secret

# AI assistant
OPENROUTER_API_KEY=your-openrouter-api-key

# Optional OpenRouter settings
OPENROUTER_API_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
```

The following variables are required for the corresponding features:

| Variable | Required for | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Reservations, menu data, admin workspace | Browser and server |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Reservations, menu data, admin workspace | Browser and server |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin signup, sign-in, and server-side admin operations | Server only |
| `AUTH_SECRET` | Admin session token signing | Server only |
| `OPENROUTER_API_KEY` | AI assistant | Server only |
| `OPENROUTER_API_BASE_URL` | Optional custom OpenRouter-compatible endpoint | Server only |
| `OPENROUTER_MODEL` | Optional model override | Server only |

Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`, or `OPENROUTER_API_KEY` to the browser.

### 3. Set up Supabase

1. Create or open a Supabase project.
2. Open the Supabase SQL Editor.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).
4. Confirm that the environment variables point to the same Supabase project.

The schema creates:

- `admin_users` for custom admin authentication
- `reservations` for table requests
- `menu_items` for the public and admin menu
- `menu-images` Storage bucket for menu images
- Row-level security and storage policies used by the application

The SQL file is designed to be rerunnable and includes the reservation status migration used by the current application.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The public restaurant page is available at `/`. The admin sign-up page is available at `/admin/signup`, and the admin login page is available at `/admin/login`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after building |

Run the standard checks before opening a pull request or deploying:

```bash
npm run lint
npm run build
```

## Application routes

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Restaurant landing page, menu, hours, and reservation form |
| `/api/chat` | AI assistant endpoint |
| `/api/chat/reservation` | Validates and saves AI-assisted reservation requests |

### Admin routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Admin sign-in |
| `/admin/signup` | Create an admin account |
| `/admin/dashboard` | Admin dashboard |
| `/admin/dashboard/reservations` | View and update reservation status |
| `/admin/dashboard/menuitems` | View menu items |
| `/admin/dashboard/newmenu` | Create a menu item |
| `/admin/dashboard/[id]/edit` | Edit a menu item |

Admin pages other than login and signup require a valid `auth_token` session cookie. Unauthenticated users are redirected to `/admin/login`.

## How the AI assistant works

The floating assistant sends the latest conversation messages to `/api/chat`. The server:

1. Validates the incoming message payload.
2. Loads current menu items from Supabase.
3. Sends the menu context and reservation rules to the configured OpenRouter model.
4. Validates and normalizes the model response.
5. Returns a reply and, when complete, a reservation draft.

When the guest confirms the draft, the browser sends it to `/api/chat/reservation`. That route validates the reservation again, checks the date, and inserts it into Supabase with `pending` status.

The assistant is intentionally instructed not to invent menu items, prices, availability, hours, contact details, or reservation confirmations.

## Reservation behavior

The regular reservation form uses a Next.js Server Action and saves to `public.reservations`. The AI reservation flow uses the `/api/chat/reservation` route and the same database table.

Both flows:

- Require the guest name, email, date, time, and guest count.
- Validate dates and reservation values server-side.
- Return an explicit error instead of showing a false success state when configuration or database access fails.
- Store new requests as `pending`.

The restaurant team can update reservation status from the authenticated admin reservations page.

## Supabase security notes

- Keep the service-role key server-only. It bypasses normal Row Level Security and must never be used in client components.
- Keep `AUTH_SECRET` server-only and rotate it if it is exposed.
- Use separate Supabase projects or credentials for development and production.
- Review the policies in [`supabase/schema.sql`](./supabase/schema.sql) before production use and narrow them to your organization’s authentication model where appropriate.
- Configure backups, database access, and Storage policies in the Supabase dashboard for production.

## Production deployment

The project can be deployed to a Next.js-compatible host such as Vercel.

1. Push the repository to your Git provider.
2. Import the repository into your hosting provider.
3. Configure every required environment variable from the table above.
4. Run [`supabase/schema.sql`](./supabase/schema.sql) against the production Supabase project.
5. Deploy using:

```bash
npm run build
npm run start
```

For a managed deployment, the host normally runs the build command automatically and starts the generated Next.js application.

Before announcing the site, verify:

- The homepage loads without missing assets.
- Menu items load from the intended Supabase project.
- A test reservation reaches the admin workspace.
- Admin sign-in and sign-out work.
- Menu image upload and editing work.
- The AI assistant is either configured or intentionally disabled.
- Production environment variables are not exposed in client-side code.

## Project structure

```text
app/
  actions/                 Server Actions for auth, menu items, and reservations
  admin/                   Admin authentication and dashboard pages
  api/chat/                AI assistant and AI reservation endpoints
  components/              Shared public UI components
  globals.css              Global theme and responsive styles
  layout.tsx               Root metadata, fonts, and global CSS
  page.tsx                 Public restaurant homepage
lib/
  auth.ts                  Admin session and authorization helpers
  password.ts              Password hashing and verification
  supabase.ts              Server-side Supabase client
  supabase-browser.ts      Browser-side Supabase client
  token.ts                 Admin session token helpers
schemas/
  reservation.ts           Reservation input schema
supabase/
  schema.sql               Database, policies, and Storage setup
public/images/             Restaurant and assistant imagery
proxy.ts                   Admin route redirect protection
```

## Troubleshooting

### “Reservations are temporarily unavailable”

Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are present in `.env.local`, then restart the development server.

### Admin sign-up or login fails

Check that:

- `SUPABASE_SERVICE_ROLE_KEY` is configured.
- `AUTH_SECRET` is configured and has at least 32 characters.
- [`supabase/schema.sql`](./supabase/schema.sql) has been run.
- The Supabase credentials belong to the same project as the public credentials.

### The AI assistant is unavailable

Check that `OPENROUTER_API_KEY` is configured. You can also set `OPENROUTER_MODEL` to a model available to your OpenRouter account.

### Menu items or images do not appear

Check that the Supabase schema ran successfully and that the `menu-images` Storage bucket and policies exist. Also verify that the menu item’s `is_available` value is enabled where appropriate.

## License

This project does not currently declare a license. Add a license before distributing or reusing the source outside the project.
