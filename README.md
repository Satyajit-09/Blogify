# 📝 Blogify

**Blogify** is a full-stack blog application that allows users to securely sign up, sign in, create blog posts, edit them, and view them. It's built with modern serverless technologies and a smooth React + Tailwind frontend.

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React with Vite  
- TypeScript  
- Tailwind CSS  
- React Router DOM  

### 🌐 Backend
- Hono (Web framework for Cloudflare Workers)  
- Cloudflare Workers (Edge runtime)  
- Prisma ORM with Accelerate for edge performance  
- JWT for authentication  
- Zod for schema validation  

---

## 🚀 Features

- 🔐 JWT Authentication (Sign Up / Sign In)
- 🧾 Create, Edit, and View Posts
- 🧪 Zod Validations for clean input handling
- ⚡ Edge-first Deployment using Cloudflare Workers and Prisma Accelerate
- 💡 Type-safe APIs with shared types across frontend and backend
- 🎨 Responsive UI built with Tailwind CSS

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Satyajit-09/Blogify.git
cd Blogify
2️⃣ Setup common (shared types)
cd common
npm install

3️⃣ Setup Backend
bash
cd ../backend
npm install
npx prisma generate
npx prisma db push
Start the dev server:

bash
npm run dev
Ensure you set environment variables in wrangler.toml:
[vars]
DATABASE_URL = "prisma://your-url"
JWT_SECRET = "your-secret-key"

4️⃣ Setup Frontend
bash
cd ../frontend
npm install
npm run dev
Tailwind & Vite will launch the frontend on:
http://localhost:5173

