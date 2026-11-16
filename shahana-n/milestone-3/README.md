# MediBook

MediBook is a React/Vite healthcare booking demo with patient, doctor, and admin workspaces. It uses fictional profiles and browser storage; it is not a medical service.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. Preview the build with `npm run preview`.

## Demo accounts

Patients can register a new demo account from **Sign in**. Doctor accounts use the listed email address and the shared password `doctor-demo`:

- `sarah@medibook.demo`
- `james@medibook.demo`
- `maya@medibook.demo`
- `oliver@medibook.demo`
- `nina@medibook.demo`
- `ethan@medibook.demo`

Admin account: `admin@medibook.demo` / `admin-demo`.

These credentials are intentionally public demo credentials. Never use a real password or real patient information.

## Demo limitations

Doctors, patient accounts, appointments, and the signed-in demo session are stored in the current browser's `localStorage`. They are not synchronized across users, browsers, or devices. Passwords are hashed for this demonstration, but client-side role checks and browser storage are not secure authentication or authorization. A real healthcare service needs a backend, database, secure authentication, server-side authorization and booking validation, and appropriate privacy and security controls.

## GitHub

Before publishing, check the project and generated output:

```sh
npm run build
git status --short
```

Create an empty GitHub repository, then run these commands from the project directory (replace the placeholders):

```sh
git init
git add .
git commit -m "Build MediBook demo"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPOSITORY>.git
git push -u origin main
```

The `.gitignore` excludes `node_modules`, `dist`, and local environment files.

## Deploy

For a static frontend host such as Netlify or Vercel, use `npm run build` as the build command and `dist` as the output directory. The `public/_redirects` file configures Netlify to serve the SPA entry point for client-side routes. For other hosts, configure an equivalent rewrite of unknown paths to `/index.html` so direct visits and refreshes on routes such as `/doctor/profile` work.
