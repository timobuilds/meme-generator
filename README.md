# Meme Generator - Full Stack App

A full-stack meme generator built with Next.js 14, TypeScript, Tailwind CSS, and InstantDB.

## Features

- **Meme Creation**: Upload images or choose from samples, add customizable text with drag-and-drop positioning
- **Authentication**: Magic link authentication with six-digit verification code, plus Google OAuth
- **Meme Feed**: Browse and upvote memes posted by other users
- **Real-time Updates**: Memes and upvotes update in real-time using InstantDB

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your InstantDB App ID:
```
NEXT_PUBLIC_INSTANTDB_APP_ID=your-instantdb-app-id-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── layout.tsx          # Root layout with InstantDB provider
├── page.tsx            # Generator page
├── feed/
│   └── page.tsx        # Gallery/feed page
components/
├── MemeGenerator.tsx   # Main generator (client component)
├── MemeCard.tsx        # Individual meme display
├── AuthButton.tsx      # Email auth trigger
├── VerifyCode.tsx      # Six-digit code verification
├── Navigation.tsx       # Site navigation
├── InstantDBProvider.tsx # InstantDB provider wrapper
lib/
├── instant.ts          # InstantDB config
├── types.ts            # TypeScript types
public/
├── samples/            # Sample meme images
```

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **InstantDB** - Real-time database and authentication
- **Canvas API** - Meme rendering

## Features in Detail

### Meme Generator
- Upload custom images or select from samples
- Add top and bottom text with customizable:
  - Font size
  - Text color
  - Border color
  - Position (via sliders or drag-and-drop)
- Download memes as PNG
- Post memes to the feed (requires authentication)

### Authentication
- Magic link authentication with six-digit verification code
- Google OAuth as alternative
- Persistent sessions

### Feed
- View all posted memes
- Sort by recent or most upvoted
- Upvote/unupvote memes
- Real-time updates when new memes are posted

## Build for Production

```bash
npm run build
npm start
```

