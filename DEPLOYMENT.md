# Deployment Guide

Step-by-step instructions for deploying the website.

## Quick Deployment

```bash
# 1. Upload all files to server
scp -r . user@server:/var/www/html/

# 2. Set permissions
ssh user@server "chmod -R 755 /var/www/html/"

# 3. Done!
```

## Detailed Deployment

### 1. Prerequisites Check

- [ ] Static web hosting available
- [ ] FTP/SFTP/SSH access
- [ ] Domain configured (müller-lukas.de)
- [ ] SSL certificate (Let's Encrypt recommended)

### 2. Prepare Files

Local check before upload:

```bash
# Check size
du -sh .

# Important files present?
ls -la index.html css/style.css js/main.js

# Validate HTML
npx html-validate index.html
```

### 3. Upload Methods

#### Option A: FTP/SFTP (for beginners)

1. Open FileZilla or similar FTP client
2. Connect to server
3. Upload all files to web directory

#### Option B: SSH/SCP (recommended)

```bash
# Complete upload
scp -r . user@server:/var/www/mueller-lukas.de/

# Or via rsync (faster for updates)
rsync -avz --exclude='.git' --exclude='README.md' . user@server:/var/www/mueller-lukas.de/
```

#### Option C: Git Deployment (advanced)

```bash
# On server:
git clone https://github.com/muellerlukasopenclaw-design/mueller-lukas-website.git /var/www/mueller-lukas.de/

# For updates:
cd /var/www/mueller-lukas.de/ && git pull
```

### 4. Server Configuration

#### Apache (.htaccess)

The `.htaccess` file is already included in the repository:

- GZIP compression enabled
- Browser caching for assets
- Security headers
- Rewrite rules for clean URLs

#### Nginx

If using Nginx, add this in server block:

```nginx
# GZIP
gzip on;
gzip_types text/css application/javascript;

# Browser Caching
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 5. Set Permissions

```bash
# On server:
chown -R www-data:www-data /var/www/mueller-lukas.de/
find /var/www/mueller-lukas.de/ -type f -exec chmod 644 {} \;
find /var/www/mueller-lukas.de/ -type d -exec chmod 755 {} \;
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Request certificate
sudo certbot --nginx -d müller-lukas.de -d www.müller-lukas.de

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. Post-Deployment Tests

- [ ] Website loads over HTTPS
- [ ] All navigation links work
- [ ] Mobile view works
- [ ] No 404 errors in console
- [ ] PageSpeed Insights Score > 80
- [ ] Lighthouse Accessibility = 100

### 8. Set Up Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backup/mueller-lukas-$DATE.tar.gz /var/www/mueller-lukas.de/
# Optional: delete old backups (older than 30 days)
find /backup/ -name "mueller-lukas-*.tar.gz" -mtime +30 -delete
```

Add to crontab:
```bash
# Weekly backup at 2 AM on Sundays
0 2 * * 0 /path/to/backup-script.sh
```

## Troubleshooting

### Problem: CSS/JS not loading (404)

**Cause:** Wrong paths or missing files

**Solution:**
```bash
# Check if files exist
ls -la css/style.css js/main.js

# Check paths in HTML (should be relative: css/style.css)
```

### Problem: Fonts not loading

**Cause:** CSP header blocking Google Fonts

**Solution:**
Check Content-Security-Policy in HTML meta tag includes:
```
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
```

### Problem: 500 Internal Server Error

**Cause:** .htaccess syntax error

**Solution:**
```bash
# Test Apache config
apachectl configtest

# Temporarily rename .htaccess
mv .htaccess .htaccess.bak
```

## Update Workflow

```bash
# 1. Test locally
npx serve .

# 2. Deploy to server
rsync -avz --exclude='.git' . user@server:/var/www/mueller-lukas.de/

# 3. Clear cache (if using CDN)
# Cloudflare: Enable Development Mode

# 4. Test online
```

## Performance Monitoring

Recommended tools:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Target metrics:
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Accessibility: 100

## Security Checklist

- [ ] HTTPS enforced
- [ ] Security headers present (HSTS)
- [ ] CSP header configured
- [ ] No sensitive data in repository
- [ ] No API keys exposed
- [ ] Regular backups enabled
