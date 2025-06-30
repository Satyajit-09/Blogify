
Blogify is a full-stack blog application that allows users to securely sign up, sign in, create blog posts, edit them, and view them. It's built with modern serverless technologies and a smooth React + Tailwind frontend.

⚙️ Tech Stack
🖥️ Frontend
React with Vite

TypeScript

Tailwind CSS

React Router DOM

🌐 Backend
Hono (Web framework for Cloudflare Workers)

Cloudflare Workers (Edge runtime)

Prisma ORM with Accelerate for edge performance

JWT for authentication

Zod for schema validation

🚀 Features
🔐 JWT Authentication (Sign Up / Sign In)

🧾 Create, Edit, and View Posts

🧪 Zod Validations for clean input handling

⚡ Edge-first Deployment using Cloudflare Workers and Prisma Accelerate

💡 Type-safe APIs with shared types across frontend and backend

🎨 Responsive UI built with Tailwind CSS

🗂️ Project Structure
bash
Copy
Edit
blogify/
├── backend/           # Hono + Cloudflare Workers backend
│   ├── src/
│   │   ├── routes/    # /user and /blog routes
│   │   └── index.ts   # Entry point
│   └── wrangler.toml  # Cloudflare config
│
├── common/            # Shared zod types used in both backend & frontend
│   └── src/
│       └── index.ts
│
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/     # Signin, Signup, Dashboard
│   │   ├── App.tsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── postcss.config.cjs
└── README.md
📦 Installation
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Satyajit-09/Blogify.git
cd Blogify
2️⃣ Setup common (shared types)
bash
Copy
Edit
cd common
npm install
3️⃣ Setup Backend
bash
Copy
Edit
cd ../backend
npm install
npx prisma generate
npx prisma db push
Start the dev server:

bash
Copy
Edit
npm run dev
Ensure you set environment variables in wrangler.toml:

toml
Copy
Edit
[vars]
DATABASE_URL = "prisma://your-url"
JWT_SECRET = "your-secret-key"
4️⃣ Setup Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
Tailwind & Vite will launch the frontend on http://localhost:5173
