# 🎬 Flick.id — Back-End Documentation

Welcome to **Flick.id Back-End** — a powerful API server for the movie-streaming platform.

---

## 🧩 Technologies Used

1. Node.js  
2. Express.js  
3. Nest.js  
4. TypeScript  
5. Prisma  
6. PostgreSQL  
7. Passport
8. JWT

---

## 🔗 Front-End Repository

The [front-end](https://github.com/dBerezuk/flick-id-front-end) application is available at:  

---

# 🛠 Installation & Setup Instructions

Below is the complete guide to running Flick.id backend locally.

---

## 📌 Prerequisites

Make sure you have installed:

- **Node.js**
- **npm** or **Yarn**
- **PostgreSQL**

Check versions:

```bash
node -v
npm -v
# or
yarn -v
postgres --version
```

🚀 **Setup Steps**

### Step 1 — Clone the repository

```bash
git clone https://github.com/dBerezuk/flick-id-back-end.git
cd flick-id-back-end
```

### Step 2 — Install dependencies

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn
```

### Step 3 — Configure environment variables
Create a `.env` file in the root directory and add:

```env
PORT = 4201

DATABASE_URL="postgresql://postgres:root@localhost:5432/flick-id?schema=public"

AUTH_SECRET = '123)'
AUTH_ISSUER = 'localhost::4201'
AUTH_AUDIENCE = 'localhost::3000'
AUTH_EXPIRES = '14d'

CLIENT_URL = 'http://localhost:3000'
CLIENT_DOMAIN = 'localhost'
```

### Step 4 — Setup database

1. Start PostgreSQL
2. Create database (if not exists)
3. Run migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma client:
```bash
npx prisma generate
```

### Step 5 - Run the development server

Using npm:

```bash
npm run dev
# or
npm start
```

Using Yarn:

```bash
yarn dev
# or
yarn start
```

Open the application
Once the server is running, it's available at:
http://localhost:4201

API endpoints start with:
http://localhost:4201/api
