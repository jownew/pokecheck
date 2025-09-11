# Creating the Open Graph Image

To create the `og-image.png` file for your PokéCheck app, you have several options:

## Option 1: Manual Screenshot (Easiest)

1. Open `public/og-preview.html` in your browser
2. Set your browser window to exactly 1200x630 pixels
3. Take a screenshot of the entire page
4. Save it as `public/og-image.png`

## Option 2: Using Browser Developer Tools

1. Open `public/og-preview.html` in Chrome/Edge
2. Press F12 to open Developer Tools
3. Click the device toolbar icon (mobile view)
4. Set custom dimensions to 1200x630
5. Take a screenshot using the camera icon in dev tools
6. Save as `public/og-image.png`

## Option 3: Using Online Tools

1. Copy the HTML content from `public/og-preview.html`
2. Use an online HTML to image converter like:
   - htmlcsstoimage.com
   - htmltoimage.app
   - screenshot.guru
3. Set dimensions to 1200x630
4. Download and save as `public/og-image.png`

## Option 4: Using Puppeteer (Advanced)

If you want to automate this process, you can install Puppeteer:

```bash
npm install --save-dev puppeteer
```

Then create a script to generate the image programmatically.

## Temporary Solution

For now, the app will use `og-image-simple.svg` as a fallback. Most social media platforms can handle SVG images, but PNG is preferred for better compatibility.

## Testing Your Open Graph Image

After creating the image, test it using:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Open Graph Preview**: https://www.opengraph.xyz/

Just enter your website URL and these tools will show you how your link preview will look.
