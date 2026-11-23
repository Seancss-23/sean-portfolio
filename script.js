// ==========================================================
// Sean Okpara: personal site
// 1. Photo placeholders   2. Dark mode        3. Typing effect
// 4. Fade-in on scroll    5. Active nav tab   6. Copy email
// 7. Gallery lightbox
// ==========================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ---------- 1. Photo placeholders ----------
// If a photo file is missing, mark its <figure> so the CSS shows the
// dashed placeholder box instead of a broken-image icon.
const photoFigures = document.querySelectorAll('.photo');

photoFigures.forEach(function (figure) {
  const img = figure.querySelector('img');

  function markMissing() {
    figure.classList.add('is-missing');
  }

  // The error may already have happened before this script ran
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
  }

  // Or it may happen later (lazy-loaded images below the fold)
  img.addEventListener('error', markMissing);
});


// ---------- 2. Dark mode ----------
// Follows the device setting until the visitor presses the toggle;
// after that their choice is saved in localStorage.
// (A tiny script in <head> re-applies the saved choice before the page paints.)
const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Which theme is showing right now: the saved choice, or else the device setting
function getCurrentTheme() {
  const chosen = root.getAttribute('data-theme');
  if (chosen) {
    return chosen;
  }
  return darkQuery.matches ? 'dark' : 'light';
}

// Keep the button label and the browser bar colour in step with the theme
function updateThemeUi() {
  const theme = getCurrentTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  themeButton.textContent = next === 'dark' ? 'Dark' : 'Light';
  themeButton.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  themeColorMeta.setAttribute('content', theme === 'dark' ? '#141612' : '#FAF7F0');
}

themeButton.addEventListener('click', function () {
  const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);

  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Storage can be blocked (private mode): the toggle still works for this visit
  }

  updateThemeUi();
});

// If the device setting changes while no choice is saved, follow it
darkQuery.addEventListener('change', updateThemeUi);
updateThemeUi();


// ---------- 3. Typing effect on "$ whoami" ----------
const typedLine = document.getElementById('typed-line');

if (typedLine && !prefersReducedMotion) {
  const fullText = typedLine.textContent;
  let typedCount = 0;

  typedLine.textContent = '';

  function typeNextLetter() {
    typedCount += 1;
    typedLine.textContent = fullText.slice(0, typedCount);

    if (typedCount < fullText.length) {
      setTimeout(typeNextLetter, 90);
    }
  }

  setTimeout(typeNextLetter, 400);
}


// ---------- 4. Fade-in on scroll ----------
// Each section starts slightly faded and eases in the first time it appears.
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);   // only fade in once
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(function (section) {
    section.classList.add('fade-in');
    fadeObserver.observe(section);
  });
}


// ---------- 5. Active nav tab ----------
const navLinks = document.querySelectorAll('.site-nav a');

// Which tab each section belongs to
const tabForSection = {
  home: 'home',
  about: 'home',
  projects: 'projects',
  story: 'story',
  experience: 'story',
  skills: 'story',
  gallery: 'gallery',
  contact: 'contact'
};

function setActiveTab(sectionId) {
  const activeHref = '#' + tabForSection[sectionId];

  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === activeHref) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// The observer watches a thin band across the middle of the screen
// (from 40% down to 45% of the viewport height). Whichever section crosses
// that band is the one the visitor is reading.
const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      setActiveTab(entry.target.id);
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main > section').forEach(function (section) {
  sectionObserver.observe(section);
});

setActiveTab('home');


// ---------- 6. Copy email ----------
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
const emailLink = document.getElementById('email-link');

// Older browsers (or insecure pages) have no Clipboard API, so fall back
// to selecting a hidden text box and using the old copy command.
function copyWithFallback(text) {
  const box = document.createElement('textarea');
  box.value = text;
  box.setAttribute('readonly', '');
  box.style.position = 'fixed';
  box.style.opacity = '0';
  document.body.appendChild(box);
  box.select();

  const worked = document.execCommand('copy');
  document.body.removeChild(box);
  return worked;
}

copyButton.addEventListener('click', async function () {
  const email = emailLink.textContent.trim();
  let copied = false;

  try {
    await navigator.clipboard.writeText(email);
    copied = true;
  } catch (error) {
    copied = copyWithFallback(email);
  }

  if (copied) {
    copyButton.textContent = 'Copied ✓';
    copyStatus.textContent = 'Email address copied';
  } else {
    copyButton.textContent = 'Copy failed';
    copyStatus.textContent = 'Could not copy the email address';
  }

  // Go back to "Copy" after two seconds
  setTimeout(function () {
    copyButton.textContent = 'Copy';
    copyStatus.textContent = '';
  }, 2000);
});


// ---------- 7. Gallery lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxFigure = document.getElementById('lightbox-figure');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCount = document.getElementById('lightbox-count');
const gallery = document.querySelector('.gallery');
const galleryFigures = Array.from(gallery.querySelectorAll('.photo'));

// The big image is created the first time the lightbox opens, then reused for every photo
const lightboxImage = document.createElement('img');

let currentIndex = 0;

function showPhoto(index) {
  if (!lightboxImage.isConnected) {
    lightboxFigure.prepend(lightboxImage);
  }

  // Wrap around: after the last photo comes the first, and the other way round
  currentIndex = (index + galleryFigures.length) % galleryFigures.length;

  const figure = galleryFigures[currentIndex];
  const img = figure.querySelector('img');
  const caption = figure.querySelector('figcaption');

  lightboxImage.src = img.currentSrc || img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightboxCount.textContent = (currentIndex + 1) + ' of ' + galleryFigures.length;
}

// Tap or click a photo to open (the click is caught once, on the gallery)
gallery.addEventListener('click', function (event) {
  const openButton = event.target.closest('.photo-open');
  if (!openButton) {
    return;
  }

  const figure = openButton.closest('.photo');
  if (figure.classList.contains('is-missing')) {
    return;   // nothing to show yet: the real photo file is not there
  }

  showPhoto(galleryFigures.indexOf(figure));
  lightbox.showModal();   // opens as a modal: focus stays inside, Esc closes it
});

document.getElementById('lightbox-prev').addEventListener('click', function () {
  showPhoto(currentIndex - 1);
});

document.getElementById('lightbox-next').addEventListener('click', function () {
  showPhoto(currentIndex + 1);
});

document.getElementById('lightbox-close').addEventListener('click', function () {
  lightbox.close();
});

// Click outside the box (on the dark backdrop) to close.
// The padding lives on the inner .lightbox-body, so only a backdrop click
// has the <dialog> itself as its target.
lightbox.addEventListener('click', function (event) {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

// Arrow keys move between photos (Esc is handled by <dialog> itself)
lightbox.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    showPhoto(currentIndex - 1);
  } else if (event.key === 'ArrowRight') {
    showPhoto(currentIndex + 1);
  }
});

// Swipe: compare where the finger went down with where it came up
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener('touchstart', function (event) {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', function (event) {
  const distanceX = event.changedTouches[0].clientX - touchStartX;
  const distanceY = event.changedTouches[0].clientY - touchStartY;

  // Count it as a swipe only if it was mostly sideways and long enough
  if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
    showPhoto(distanceX < 0 ? currentIndex + 1 : currentIndex - 1);
  }
}, { passive: true });
