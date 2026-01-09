# Light Drift - Deployment Guide

## 🚀 Ready to Deploy!

Your Light Drift experience is production-ready. Choose your deployment platform below.

---

## 📋 Pre-Deployment Checklist

Before deploying anywhere:

- [ ] Test locally: `npm run dev` works
- [ ] Build locally: `npm run build` succeeds
- [ ] No console errors (F12 → Console)
- [ ] Lantern placement works
- [ ] Camera movement smooth
- [ ] Audio toggle works (optional audio file added)
- [ ] Responsive design tested on mobile

---

## 🌍 Deployment Options (Ranked by Ease)

### Option 1: Vercel (EASIEST - Recommended ⭐)

**Best for**: Quick deployment, automatic updates from GitHub

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Build Project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow Prompts**
   - Confirm project settings
   - Choose default settings (recommended)
   - Wait for deployment (~1 minute)

**Result:** Live URL like `https://light-drift-xyz.vercel.app`

**Features:**
- ✅ Automatic SSL/HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push (with GitHub integration)
- ✅ Free tier available
- ✅ Environment variables support

**Update Code:**
```bash
git push  # Auto-deploys if connected to GitHub
# Or run: vercel --prod
```

---

### Option 2: Netlify (EASY)

**Best for**: Drag-and-drop deployment, git integration

**Steps:**

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign up (if needed)

3. **Drag & Drop**
   - Drag the `dist/` folder onto Netlify
   - Or click "New site from Git"

4. **Wait for Deployment**
   - Netlify builds automatically
   - ~2-3 minutes

**Result:** Live URL like `https://light-drift-xyz.netlify.app`

**Features:**
- ✅ Drag-and-drop deployment
- ✅ Automatic builds on git push
- ✅ Free SSL
- ✅ Global CDN
- ✅ Custom domains

**Update Code:**
```bash
git push  # Auto-deploys
```

---

### Option 3: GitHub Pages (FREE)

**Best for**: Free hosting, easy integration with GitHub

**Steps:**

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/floating-lanterns.git
   git push -u origin main
   ```

2. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/floating-lanterns/',  // Add this line
     server: { port: 3000 }
   });
   ```

3. **Add GitHub Actions Workflow**
   - Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install --legacy-peer-deps
         - run: npm run build
         - uses: actions/upload-artifact@v3
           with:
             name: dist
             path: dist
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

**Result:** Live URL like `https://YOUR_USERNAME.github.io/floating-lanterns`

**Features:**
- ✅ Completely free
- ✅ GitHub integrated
- ✅ Automatic builds on push
- ✅ Custom domain support

---

### Option 4: AWS S3 + CloudFront (POWERFUL)

**Best for**: Maximum performance, custom domain, professional setup

**Steps:**

1. **Create S3 Bucket**
   - AWS Console → S3
   - Create bucket: `light-drift-xyz`
   - Enable Static Website Hosting
   - Set index.html as default

2. **Upload Build**
   ```bash
   npm run build
   aws s3 sync dist/ s3://light-drift-xyz --delete
   ```

3. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set default root object: index.html

4. **Point Domain** (if using custom domain)
   - Route 53 → Create alias
   - Point to CloudFront distribution

**Cost:** ~$1-5/month for typical usage

**Features:**
- ✅ Global CDN
- ✅ Automatic caching
- ✅ Custom domain
- ✅ HTTPS included
- ✅ Best performance

---

### Option 5: Railway (ALTERNATIVE)

**Best for**: Docker-based deployment, simple git integration

**Steps:**

1. **Connect GitHub**
   - Visit https://railway.app
   - Connect GitHub account

2. **Create Project**
   - Select your repo
   - Auto-detects Vite project
   - Configures deployment

3. **Deploy**
   - Click Deploy
   - Wait ~2-3 minutes
   - Get live URL

**Features:**
- ✅ Simple git integration
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Environment variables

---

## 🎯 Recommended Deployment Path

### For Beginners:
1. **First Choice**: Vercel
   - Easiest setup
   - Best documentation
   - Automatic updates from GitHub

2. **Backup Option**: Netlify
   - Drag-and-drop if needed
   - Similar experience

### For Professionals:
1. **Best Performance**: AWS S3 + CloudFront
   - Global distribution
   - Custom domain
   - Full control

2. **Quick Alternative**: Vercel
   - Production-ready
   - Great defaults
   - Easy scaling

### For Learning:
1. **Free Option**: GitHub Pages
   - Free forever
   - Good learning experience
   - GitHub integration

---

## 📝 Custom Domain Setup

### For Any Provider:

1. **Purchase Domain**
   - GoDaddy, Namecheap, Google Domains, etc.

2. **Point DNS**
   - Vercel: Add CNAME record
   - Netlify: Add CNAME record
   - AWS: Use Route 53
   - GitHub Pages: Add CNAME file

3. **Wait for DNS Propagation**
   - Usually 5-30 minutes
   - Check: https://mxtoolbox.com

### Example (Vercel + GoDaddy):
```
GoDaddy DNS Settings:
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Vercel Settings:
Domains → Add domain → light-drift.com
```

---

## 🔒 Security Checklist

Before going live:

- [ ] HTTPS enabled (automatic on all platforms)
- [ ] No sensitive keys in code
- [ ] No console.log() sensitive data
- [ ] Environment variables for any secrets
- [ ] No hardcoded API keys
- [ ] Check dist/ folder doesn't have source maps (if security needed)

---

## 📊 Performance After Deployment

### Test Your Deployment:

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev
   - Paste your live URL
   - Get performance score

2. **WebPageTest**
   - https://www.webpagetest.org
   - Test from different locations

3. **Monitor Live Site**
   - Vercel Dashboard: Analytics
   - Netlify Analytics: Performance
   - CloudFront: CloudWatch metrics

### Typical Results:
- **Load Time**: <2 seconds
- **FPS**: 60fps
- **Page Size**: ~450KB
- **Performance Score**: 85-95

---

## 🚀 Continuous Deployment (Git Integration)

### GitHub Integration (Recommended):

All major platforms support git integration.

**Setup Once:**
1. Connect GitHub account to platform
2. Select your repository
3. Enable auto-deploy on push

**From Then On:**
```bash
git add .
git commit -m "Update lantern colors"
git push

# ✅ Automatically deployed!
```

---

## 📈 Scaling & Optimization

### If Performance Drops:

1. **Add CDN** (already included with most platforms)
2. **Enable Caching**
   - Cache-Control headers
   - Browser caching

3. **Reduce Bundle Size** (if needed)
   ```bash
   npm run build
   # Check dist/ folder size
   ```

4. **Monitor Performance**
   - Use platform analytics
   - Check Core Web Vitals

---

## 🔄 Update Process

### After Initial Deployment:

1. **Make Changes Locally**
   ```bash
   npm run dev  # Test
   ```

2. **Commit & Push**
   ```bash
   git add .
   git commit -m "Update: Add new feature"
   git push origin main
   ```

3. **Auto-Deploy** (with git integration)
   - Platform auto-builds and deploys
   - Live within 1-5 minutes

4. **No Downtime** (with most platforms)
   - Blue-green deployment
   - Automatic rollback if needed

---

## 💾 Environment Variables (Optional)

### If You Need Configuration:

**Create .env.local**
```
VITE_API_URL=https://api.example.com
VITE_AUDIO_ENABLED=true
```

**Use in Code**
```javascript
const audioEnabled = import.meta.env.VITE_AUDIO_ENABLED;
```

**Set in Platform**
- Vercel: Settings → Environment Variables
- Netlify: Build & deploy → Environment
- Railway: Variables

---

## 🎯 Next Steps

1. **Choose Platform** (Vercel recommended)
2. **Run**: `npm run build`
3. **Deploy** (follow platform-specific steps)
4. **Share URL** with portfolio/employers
5. **Monitor** performance and updates

---

## 📞 Deployment Support

### If You Get Stuck:

1. **Check Platform Docs**
   - Vercel: https://vercel.com/docs
   - Netlify: https://docs.netlify.com
   - GitHub: https://pages.github.com

2. **Check Build Logs**
   - All platforms show build output
   - Errors usually clear in logs

3. **Try Local Build First**
   ```bash
   npm run build
   npm run preview
   ```
   - If this works, deployment will too

4. **Common Issues**
   - Missing node_modules: `npm install`
   - Port conflicts: Check firewall
   - File permissions: Check .gitignore

---

## ✨ Congratulations!

You're ready to deploy Light Drift to the world! 🚀

**Recommended Flow:**
1. Deploy to Vercel (5 minutes)
2. Share live URL on GitHub README
3. Add to portfolio website
4. Share on social media/LinkedIn

**Good luck! 🎉**
