# Sean Okpara: personal website

A single-page personal site built with plain HTML, CSS and JavaScript. No frameworks, no templates, no build step.

Built for the **Bincom Dev Center "Mobile App Trainee" test**.

## What's on the page

Hero, About, Projects, a short case study ("The bug I found in my own apps"), Experience timeline, Skills, a photo gallery, and Contact.

## Features

- **Mobile bottom tab bar** that becomes a top nav at 768px and wider
- **Active tab highlight** while scrolling (`IntersectionObserver`)
- **Dark mode**: follows the device setting, has a toggle, remembers the choice in `localStorage`
- **Gallery lightbox**: tap to open, previous/next buttons, swipe, arrow keys, Esc, click outside to close, focus stays inside while open (native `<dialog>`)
- **Copy email** button with a "Copied ✓" state (Clipboard API, with a fallback)
- **Typing effect** on the `$ whoami` line (runs once, skipped if the visitor prefers reduced motion)
- **Fade-in on scroll** for sections (also skipped for reduced motion)
- **Add to home screen**: `manifest.json` and app icons
- Photo placeholders: if a photo file is missing, a neat dashed box shows in its place

## How to run it

Open `index.html` in a browser. That's it.

## Files

```
index.html       page content
styles.css       all styling (colours, spacing and radii are CSS variables)
script.js        all behaviour
manifest.json    home-screen install info
Sean_Okpara_CV_26_27.pdf   CV download
images/
  sean-01-portrait.jpg     About (4:5)
  sean-03-code.jpg         Experience banner (16:9)
  sean-04-pitch.jpg        Gallery, large (4:3)
  sean-02-lecture.jpg, sean-05-street.jpg,
  sean-06-candid.jpg, sean-07-building.jpg    Gallery squares (1:1)
  icon-192.png, icon-512.png                  App icons
```

## Changing a photo

Replace the file in `images/` (or change its `src` in `index.html`), then update its `alt` text and caption.

**Compressing photos:** open [squoosh.app](https://squoosh.app), drop a photo in, choose MozJPEG, set the width to about 1200px and the quality to about 75, and aim for under 300KB.

## Browser support

Current Chrome, Edge, Firefox and Safari. The lightbox uses the native `<dialog>` element.

&copy; 2026 Sean Okpara
