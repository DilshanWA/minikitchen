Mini Kitchen
Project Documentation
Installation • Environment • Database • Workflows • Deployment • Troubleshooting
1. Project Overview
Mini Kitchen is a responsive restaurant website and management workspace for a small neighbourhood restaurant. It has two sides:
•	A public site where guests can view the menu and restaurant story, see opening hours and location, and book a table.
•	A private admin area where staff manage reservations and menu items.
The site also includes a floating AI guest assistant that answers menu questions and helps guests draft a reservation request.
1.1 Technology stack
Layer	Technology
Framework	Next.js 16 (App Router)
UI	React 19, Tailwind CSS 4
Language	TypeScript
Database and storage	Supabase (Postgres and Storage)
AI assistant	OpenRouter (configurable model and endpoint)
2. Features
2.1 Public restaurant site
•	Responsive landing page with hero section and navigation
•	Restaurant introduction and story
•	Menu showcase
•	Opening hours and location details
•	Reservation form
•	Newsletter signup presentation  (not functional)
•	Footer and social links
•	Mobile navigation menu
•	Floating AI assistant for menu questions and reservation requests
•	Accessible form labels, status messages and interactive controls

2.2 Reservations
Guests provide: name, email, date, time, guest count, occasion, and notes or dietary requirements. Input is validated on the server before saving. Every reservation has one of three statuses:
Status	Meaning
pending	New request, waiting for the restaurant to review it
confirmed	Accepted by the restaurant in the admin workspace
cancelled	Cancelled reservation

Important: An AI-generated reservation is only a request. It is not confirmed until the restaurant confirms it from the admin workspace.
2.3 Admin workspace
•	Admin account creation and sign-in
•	Cookie-based authenticated sessions
•	Dashboard overview
•	Reservation management (view and update status)
•	Menu item creation and editing
•	Menu image uploads through Supabase Storage
•	Protected admin routes
3. Installation
3.1 Requirements
•	Node.js 20.9 or newer
•	npm
•	A Supabase project
•	An OpenRouter API key (only if the AI assistant is enabled)
Check your installed versions:
node --version
npm --version

Step 1 — Get the project
Clone your repository and enter the project folder.
git clone https://github.com/DilshanWA/minikitchen.git
cd minikitchen

Step 2 — Install dependencies
npm install

Step 3 — Configure environment variables
Create a .env.local file in the project root:
# Supabase public connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
 
# Server-only Supabase access for admin actions
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
 
# Secret used to sign admin session tokens (32+ random characters)
AUTH_SECRET=replace-with-a-long-random-secret
 
# AI assistant
OPENROUTER_API_KEY=your-openrouter-api-key
 
# Optional OpenRouter settings
OPENROUTER_API_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free

Variable	Required for	Exposure
NEXT_PUBLIC_SUPABASE_URL	Reservations, menu data, admin workspace	Browser and server
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY	Reservations, menu data, admin workspace	Browser and server
SUPABASE_SERVICE_ROLE_KEY	Admin signup, sign-in and server-side admin operations	Server only
AUTH_SECRET	Admin session token signing	Server only
OPENROUTER_API_KEY	AI assistant	Server only
OPENROUTER_API_BASE_URL	Optional custom OpenRouter-compatible endpoint	Server only
OPENROUTER_MODEL	Optional model override	Server only

Security: Never commit .env.local or expose SUPABASE_SERVICE_ROLE_KEY, AUTH_SECRET or OPENROUTER_API_KEY to the browser.
Step 4 — Set up Supabase
1.	Create or open a Supabase project.
2.	Open the Supabase SQL Editor.
3.	Run supabase/schema.sql from the project.
4.	Confirm that the environment variables point to the same Supabase project.
Step 5 — Run locally
npm run dev

Open http://localhost:3000 in a browser. The admin sign-up page is at /admin/signup and the admin login page is at /admin/login.
3.2 Available scripts
Command	Description
npm run dev	Start the Next.js development server
npm run lint	Run ESLint
npm run build	Create a production build
npm run start	Start the production server after building

Run the standard checks before opening a pull request or deploying:
npm run lint
npm run build

4. Database Setup
Mini Kitchen uses Supabase for application data. The full schema is provided in supabase/schema.sql and is designed to be rerunnable. It also includes the reservation status migration used by the current application. Running it creates:
Object	Purpose
admin_users	Custom admin authentication
reservations	Table reservation requests
menu_items	Public and admin menu
menu-images (Storage bucket)	Menu item images
RLS and storage policies	Access rules used by the application

Reservations
New requests are stored with the pending status. Admins can change the status to confirmed or cancelled from the reservations page.
Menu items
Menu items are shown on the public site and managed in the admin workspace. Items with is_available disabled may not appear publicly. Images are uploaded to the menu-images Storage bucket.
Row Level Security
Review the policies in supabase/schema.sql before production use and narrow them to your organization's authentication model where appropriate. If Supabase reports that a new row violates an RLS policy, review the table's policies. Do not disable RLS as a production workaround.
5. Application Routes
Public routes
Route	Purpose
/	Landing page, menu, hours and reservation form
/api/chat	AI assistant endpoint
/api/chat/reservation	Validates and saves AI-assisted reservation requests
Admin routes
Route	Purpose
/admin/login	Admin sign-in
/admin/signup	Create an admin account
/admin/dashboard	Admin dashboard
/admin/dashboard/reservations	View and update reservation status
/admin/dashboard/menuitems	View menu items
/admin/dashboard/newmenu	Create a menu item
/admin/dashboard/[id]/edit	Edit a menu item

Admin pages other than login and signup require a valid auth_token session cookie. Unauthenticated users are redirected to /admin/login.
6. Authentication and Security
•	Admin access uses custom authentication with cookie-based sessions; session tokens are signed with AUTH_SECRET.
•	Passwords are stored as secure hashes (lib/password.ts), never as plaintext.
•	Admin routes are protected by proxy.ts, and admin operations run on the server.
•	Keep SUPABASE_SERVICE_ROLE_KEY server-only. It bypasses Row Level Security and must never be used in client components.
•	Rotate AUTH_SECRET if it is exposed.
•	Use separate Supabase projects or credentials for development and production.
•	Configure backups, database access and Storage policies in the Supabase dashboard for production.
•	Add .env.local to .gitignore and use the hosting platform's secret-variable settings in production.


7. AI Assistant
7.1 Setup
1.	Visit https://openrouter.ai and create an account or sign in.
2.	Open the API Keys section and generate a new API key.
3.	Copy the key and keep it secure.
4.	Add OPENROUTER_API_KEY to .env.local. Optionally set OPENROUTER_API_BASE_URL and OPENROUTER_MODEL to use another endpoint or a model available to your account.
API usage may require credits depending on the selected model and OpenRouter's current pricing.
7.2 How it works
The floating assistant sends the latest conversation messages to /api/chat. The server:
1.	Validates the incoming message payload.
2.	Loads current menu items from Supabase.
3.	Sends the menu context and reservation rules to the configured OpenRouter model.
4.	Validates and normalizes the model response.
5.	Returns a reply and, when complete, a reservation draft.
When the guest confirms the draft, the browser sends it to /api/chat/reservation. That route validates the reservation again, checks the date, and inserts it into Supabase with pending status. The assistant is instructed not to invent menu items, prices, availability, hours, contact details or reservation confirmations.
8. Key Workflows
Reservation (form and AI)
The regular form uses a Next.js Server Action and saves to public.reservations. The AI flow uses the /api/chat/reservation route and the same table. Both flows:
•	Require guest name, email, date, time and guest count.
•	Validate dates and reservation values on the server.
•	Return an explicit error instead of a false success when configuration or database access fails.
•	Store new requests as pending.
Reservation status update
•	An admin opens the reservations page.
•	The application loads reservation records.
•	The admin changes a reservation's status.
•	The application updates the record in Supabase.
Menu management
•	An admin opens the menu items page.
•	The application loads menu records from Supabase.
•	The admin creates or edits an item and optionally uploads an image to Storage.
•	The application saves the change and the public menu reflects it.
Authentication
•	A user signs up or submits login credentials.
•	The server verifies the credentials against admin_users.
•	A signed auth_token cookie is issued.
•	Protected admin routes allow access only with a valid session; otherwise the user is redirected to /admin/login.
9. Production Deployment
The project can be deployed to a Next.js-compatible host such as Vercel.
1.	Push the repository to your Git provider.
2.	Import the repository into your hosting provider.
3.	Configure every required environment variable from Section 3.
4.	Run supabase/schema.sql against the production Supabase project.
5.	Deploy. For a manual deployment run npm run build then npm run start. Managed hosts normally run the build automatically.
Pre-launch checklist
•	The homepage loads without missing assets.
•	Menu items load from the intended Supabase project.
•	A test reservation reaches the admin workspace.
•	Admin sign-in and sign-out work.
•	Menu image upload and editing work.
•	The AI assistant is either configured or intentionally disabled.
•	Production environment variables are not exposed in client-side code.
10. Project Structure
app/
  actions/       Server Actions for auth, menu items, reservations
  admin/         Admin authentication and dashboard pages
  api/chat/      AI assistant and AI reservation endpoints
  components/    Shared public UI components
  globals.css    Global theme and responsive styles
  layout.tsx     Root metadata, fonts, global CSS
  page.tsx       Public restaurant homepage
lib/
  auth.ts            Admin session and authorization helpers
  password.ts        Password hashing and verification
  supabase.ts        Server-side Supabase client
  supabase-browser.ts  Browser-side Supabase client
  token.ts           Admin session token helpers
schemas/
  reservation.ts     Reservation input schema
supabase/
  schema.sql         Database, policies, Storage setup
public/images/       Restaurant and assistant imagery
proxy.ts             Admin route redirect protection

11. Troubleshooting
Problem	What to check
"Reservations are temporarily unavailable"	Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are in .env.local, then restart the dev server.
Admin sign-up or login fails	Confirm SUPABASE_SERVICE_ROLE_KEY is set, AUTH_SECRET is set with at least 32 characters, schema.sql has been run, and all credentials belong to the same Supabase project.
The AI assistant is unavailable	Confirm OPENROUTER_API_KEY is set. You can also set OPENROUTER_MODEL to a model available to your OpenRouter account.
Menu items or images do not appear	Confirm the schema ran successfully, the menu-images bucket and policies exist, and the item's is_available value is enabled.

