# Feedback Studio

Full-stack dynamic feedback system with:

- Next.js 14 App Router
- MongoDB + Mongoose
- Tailwind CSS
- JWT cookie authentication (admin only)
- Dynamic feedback form builder
- Public form links
- Response analytics + CSV export

## Features

- Admin login with protected routes via middleware
- Dynamic form builder with field types:
	- text
	- textarea
	- number
	- rating (stars)
	- slider
	- select
	- radio
	- checkbox
- Publish / unpublish forms
- Public form page at `/form/[id]`
- Required-field validation
- Store responses in MongoDB
- Analytics for numeric/rating/slider responses
- CSV export
- Shareable link generation
- Duplicate submission prevention using IP hash
- Responsive UI and dark mode

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure env variables:

```bash
cp .env.example .env.local
```

3. Update `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=feedback_system
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=ChangeMe123!
```

4. Run dev server:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Main Structure

- `app/admin` - admin dashboard and form builder
- `app/form/[id]` - public form render page
- `lib/db.js` - MongoDB connection helper
- `models/Form.js` - form schema
- `models/Response.js` - response schema
- `models/Admin.js` - admin schema
- `app/api` - auth and form APIs

## Notes

- First login works after creating the admin automatically from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if not present.
- Keep `JWT_SECRET` strong in production.
