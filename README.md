# SyncDraw - Real-time Collaborative Whiteboard

A real-time collaborative whiteboard application built with Next.js, Konva.js, and Yjs.

## Features

- Real-time collaborative drawing
- Multiple drawing tools (pen, eraser, shapes)
- Color picker and stroke width adjustment
- User authentication
- Dark/Light mode support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Konva.js for canvas manipulation
- Yjs for real-time collaboration
- NextAuth.js for authentication
- Prisma for database management

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/syncdraw.git
cd syncdraw
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/client` - Next.js frontend application
- `/server` - Backend server
- `/prisma` - Database schema and migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 