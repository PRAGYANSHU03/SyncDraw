```markdown
# 🎨 SyncDraw
**SyncDraw** is a high-performance, real-time collaborative whiteboard application. It combines the power of **Konva.js** for high-speed canvas rendering with **Yjs** for seamless, conflict-free data synchronization.

---

## ✨ Features

- 🤝 **Real-time Collaboration**: Multiple users can draw simultaneously with near-zero latency.
- 🖌️ **Advanced Drawing Tools**:
  - Pen & Eraser with adjustable pressure/width.
  - Shape tools: Rectangles, Circles, and Lines.
- 🎨 **Dynamic Customization**: Full hex color picker and stroke width adjustment.
- 🔐 **Secure Authentication**: Built-in user accounts via NextAuth.js.
- 🌗 **Adaptive UI**: Full support for Dark and Light modes using Tailwind CSS.
- 📱 **Responsive Design**: Works seamlessly across desktops and tablets.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Canvas Engine** | [Konva.js](https://konvajs.org/) & [React-Konva](https://konvajs.org/docs/react/index.html) |
| **Real-time Sync** | [Yjs](https://docs.yjs.dev/) (CRDTs) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Database/ORM** | [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: A local instance or a cloud provider (e.g., Supabase/Neon)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/PRAGYANSHU03/SyncDraw.git](https://github.com/PRAGYANSHU03/SyncDraw.git)
   cd syncdraw

```

2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/syncdraw"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

```


4. **Initialize Database:**
```bash
npx prisma generate
npx prisma db push

```


5. **Start the Development Server:**
```bash
npm run dev

```



Access the app at `http://localhost:3000`.

---

## 📂 Project Structure

```text
├── client/           # Frontend Next.js application
│   ├── components/   # React components (Canvas, Toolbar, UserAvatar)
│   ├── hooks/        # Custom Yjs & Konva hooks for sync logic
│   └── lib/          # Yjs provider and utility configurations
├── server/           # WebSocket/Signaling server for Yjs
├── prisma/           # Database schema and migration files
└── public/           # Static assets and icons

```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.


Would you like me to help you create a **"How it works"** section explaining the logic between Yjs and Konva for your documentation?

```
