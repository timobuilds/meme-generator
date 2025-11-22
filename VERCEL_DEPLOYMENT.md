# Vercel Deployment Checklist

## ✅ Pre-Deployment Fixes Completed

1. **Fixed InstantDB Schema** - Replaced unsupported nested objects and arrays with JSON strings
   - `textState`: Now stored as JSON string
   - `upvoteUserIds`: Now stored as JSON string
   - Added parsing logic in `app/page.tsx` and `app/feed/page.tsx`

2. **Build Verification** - Build now succeeds without errors
   - All TypeScript types validated
   - No linting errors

3. **Code Cleanup** - Removed legacy files:
   - `index.html` (vanilla HTML version)
   - `script.js` (vanilla JS version)
   - `styles.css` (vanilla CSS version)

## 🚀 Deployment Steps

### 1. Environment Variables
Set in Vercel Dashboard → Project Settings → Environment Variables:
```
NEXT_PUBLIC_INSTANTDB_APP_ID=your-instantdb-app-id-here
```

### 2. Build Configuration
Vercel auto-detects Next.js, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Deploy via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time will ask for project setup)
vercel

# Deploy to production
vercel --prod
```

### 4. Deploy via GitHub Integration
1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Connect GitHub repository
4. Vercel will auto-deploy on every push to main branch

## ⚠️ Important Notes

### InstantDB Schema Limitations
- InstantDB doesn't support nested objects or arrays directly
- `textState` and `upvoteUserIds` are stored as JSON strings
- Parsing happens automatically in components that read from DB
- Serialization happens automatically when writing to DB

### Environment Variables
- **Required**: `NEXT_PUBLIC_INSTANTDB_APP_ID`
- Must be set in Vercel Dashboard for production
- Can use different values for Preview/Production environments

### Build Output
- All pages are statically generated (SSG)
- No server-side rendering required
- Fast static site with client-side hydration

## 🔍 Post-Deployment Verification

1. **Check Build Logs** - Ensure build completed successfully
2. **Test Authentication** - Verify magic link and Google OAuth work
3. **Test Meme Creation** - Create and post a meme
4. **Test Feed** - Verify memes appear and upvoting works
5. **Check Console** - No errors in browser console
6. **Performance** - Run Lighthouse audit

## 📊 Performance Optimizations Already Implemented

- ✅ Next.js Image optimization (`next/image`)
- ✅ Static page generation
- ✅ Code splitting
- ✅ Lazy loading images
- ✅ Optimized bundle sizes

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are set
- Verify `NEXT_PUBLIC_INSTANTDB_APP_ID` is correct
- Check build logs for specific errors

### 404 Errors
- Verify routes match Next.js App Router structure
- Check `next.config.js` for any redirects/rewrites

### InstantDB Connection Issues
- Verify App ID is correct
- Check InstantDB dashboard for app status
- Ensure CORS is configured in InstantDB settings

### Authentication Not Working
- Check InstantDB auth configuration
- Verify redirect URLs match Vercel domain
- Check browser console for errors

## 🔐 Security Checklist

- ✅ Environment variables not committed to git
- ✅ `.env.local` in `.gitignore`
- ✅ No API keys in code
- ✅ Client-side only InstantDB (no server secrets needed)

## 📝 Next Steps

1. Deploy to Vercel
2. Set environment variables
3. Test all functionality
4. Monitor Vercel Analytics
5. Set up custom domain (optional)

