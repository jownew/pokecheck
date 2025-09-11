# Environment Variables Setup for PokéCheck

This guide shows how to configure environment variables for your PokéCheck app, especially for Vercel deployment.

## 🔧 Environment Variables

### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://pokecheck-seven.vercel.app/
NEXT_PUBLIC_SITE_NAME=PokéCheck
NEXT_PUBLIC_SITE_DESCRIPTION=A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.

# Optional: Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@your_twitter_handle
```

## 🚀 Vercel Deployment Setup

### 1. Automatic Domain Detection

The app automatically detects your Vercel deployment URL using:

- `process.env.VERCEL_URL` (Vercel's automatic environment variable)
- `window.location.origin` (client-side fallback)
- Manual `NEXT_PUBLIC_SITE_URL` override

### 2. Setting Environment Variables in Vercel

#### Option A: Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
NEXT_PUBLIC_SITE_URL = https://your-actual-domain.com
NEXT_PUBLIC_SITE_NAME = PokéCheck
NEXT_PUBLIC_TWITTER_HANDLE = @your_handle
```

#### Option B: Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://your-actual-domain.com

vercel env add NEXT_PUBLIC_SITE_NAME
# Enter: PokéCheck

vercel env add NEXT_PUBLIC_TWITTER_HANDLE
# Enter: @your_handle
```

#### Option C: vercel.json Configuration

```json
{
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://your-domain.com",
    "NEXT_PUBLIC_SITE_NAME": "PokéCheck",
    "NEXT_PUBLIC_TWITTER_HANDLE": "@your_handle"
  }
}
```

### 3. Environment-Specific Configuration

#### Production

```bash
NEXT_PUBLIC_SITE_URL=https://pokecheck.vercel.app
```

#### Preview/Staging

```bash
NEXT_PUBLIC_SITE_URL=https://pokecheck-git-main-username.vercel.app
```

#### Development

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔄 How It Works

### Automatic URL Detection

```typescript
// The app automatically uses:
1. NEXT_PUBLIC_SITE_URL (if set)
2. VERCEL_URL (Vercel's automatic variable)
3. window.location.origin (client-side)
4. http://localhost:3000 (fallback)
```

### Usage in Code

```typescript
import { siteConfig, getCanonicalUrl } from '@/config/env';

// Get site name
console.log(siteConfig.name); // "PokéCheck"

// Get full URL
console.log(getCanonicalUrl()); // "https://your-domain.com"
console.log(getCanonicalUrl('/about')); // "https://your-domain.com/about"
```

## 📝 Local Development

### 1. Create .env.local

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Update .env.local

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=PokéCheck
NEXT_PUBLIC_SITE_DESCRIPTION=A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.
NEXT_PUBLIC_TWITTER_HANDLE=@your_twitter_handle
```

## 🌐 Benefits

### SEO & Social Sharing

- ✅ Correct canonical URLs
- ✅ Proper Open Graph URLs
- ✅ Dynamic social media meta tags
- ✅ Environment-specific configurations

### Deployment

- ✅ Works with Vercel preview deployments
- ✅ Automatic domain detection
- ✅ No hardcoded URLs in code
- ✅ Easy to change domains

### Development

- ✅ Different configs per environment
- ✅ Easy local development setup
- ✅ No need to rebuild for different domains

## 🔍 Testing

### Check Current Configuration

```bash
# In your browser console or Node.js
console.log(process.env.NEXT_PUBLIC_SITE_URL);
console.log(process.env.VERCEL_URL);
```

### Verify Social Media Tags

1. Deploy to Vercel
2. Test with social media debuggers:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## 🚨 Important Notes

1. **NEXT*PUBLIC*** prefix is required for client-side access
2. **VERCEL_URL** is automatically provided by Vercel
3. **Environment variables are public** in the browser (hence NEXT*PUBLIC*)
4. **Redeploy after changing** environment variables in Vercel
5. **Preview deployments** get different URLs automatically

## 🔧 Troubleshooting

### Issue: Wrong domain in social previews

**Solution**: Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

### Issue: localhost URLs in production

**Solution**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### Issue: Environment variables not updating

**Solution**: Redeploy after changing variables in Vercel dashboard

### Issue: Different URLs for preview branches

**Solution**: This is expected - preview deployments get unique URLs
