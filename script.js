const products = [
  { name: 'Moonpetal Scrunchie', category: 'Scrunchies', price: 50, sizes: 'Small ₹50 • Medium ₹80 • Large ₹120', tags: ['velvet soft', 'blush'], shape: 'scrunchie' },
  { name: 'Cocoa Moon Small Pouch', category: 'Pouches', price: 180, sizes: 'Small ₹180 • Medium ₹280 • Large ₹380', tags: ['zip pouch', 'cocoa'], shape: 'pouch' },
  { name: 'Luna Sling Bag', category: 'Sling Bags', price: 450, sizes: 'Small ₹450 • Medium ₹650 • Large ₹800', tags: ['crescent flap', 'lined'], shape: 'sling' },
  { name: 'Heart & Bow Keychain', category: 'Keychains', price: 70, sizes: 'Small ₹70 • Medium ₹110 • Large ₹160', tags: ['bow charm', 'mini gift'], shape: 'keychain' },
  { name: 'Custom Keychain', category: 'Keychains', price: 90, sizes: 'Small ₹90 • Medium ₹140 • Large ₹200', tags: ['personalized', 'gold ring'], shape: 'keychain' },
  { name: 'Midnight Market Tote', category: 'Tote Bags', price: 350, sizes: 'Small ₹350 • Medium ₹550 • Large ₹750', tags: ['roomy', 'star charm'], shape: 'tote' },
  { name: 'Starlace Bookmark', category: 'Bookmarks', price: 50, sizes: 'Small ₹50 • Medium ₹80 • Large ₹120', tags: ['reader gift', 'lace edge'], shape: 'bookmark' }
];

const gallery = [
  { title: 'Rose dusk tote', category: 'bags', shape: 'tote', height: '19rem' },
  { title: 'Tiny charm drop', category: 'accessories', shape: 'keychain', height: '14rem' },
  { title: 'Lavender bookmark set', category: 'pastel', shape: 'bookmark', height: '17rem' },
  { title: 'Soft moon pouch', category: 'accessories', shape: 'pouch', height: '15rem' },
  { title: 'Ribbon sling bag', category: 'bags', shape: 'sling', height: '21rem' },
  { title: 'Blush scrunchie stack', category: 'pastel', shape: 'scrunchie', height: '16rem' }
];

const reviews = [
  { name: 'Mina R.', text: 'The sling bag feels like something from a moonlit fairytale. It is soft, sturdy, and so beautifully finished.' },
  { name: 'Ari L.', text: 'My custom colors came out perfect. The packaging, the tiny note, the stitch work... everything felt so personal.' },
  { name: 'Selene P.', text: 'I bought bookmarks and keychains as gifts and everyone asked where they were from. Dreamy and precious.' }
];

const productGrid = document.querySelector('#productGrid');
const galleryGrid = document.querySelector('#galleryGrid');
const sortProducts = document.querySelector('#sortProducts');
const filters = document.querySelectorAll('.filter');
const galleryFilters = document.querySelectorAll('.gallery-filter');
const toast = document.querySelector('#toast');
const mobileMenu = document.querySelector('#mobileMenu');
const menuToggle = document.querySelector('#menuToggle');
let currentFilter = 'all';
let reviewIndex = 0;
let audioContext;
let musicNodes = [];

const hideLoader = () => document.querySelector('#loader')?.classList.add('hidden');
window.addEventListener('load', () => setTimeout(hideLoader, 650));
window.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1400));

function artMarkup(shape) {
  const labels = {
    scrunchie: 'Crochet scrunchie illustration',
    tote: 'Crochet tote bag illustration',
    sling: 'Crochet sling bag illustration',
    keychain: 'Crochet keychain illustration',
    bookmark: 'Crochet bookmark illustration',
    pouch: 'Crochet pouch illustration'
  };
  const safeShape = labels[shape] ? shape : 'scrunchie';
  return `<img class="product-art" loading="lazy" decoding="async" alt="${labels[safeShape]}" src="${safeShape}.svg" onerror="this.onerror=null;this.src='assets/${safeShape}.svg';">`;
}

function renderProducts() {
  const sorted = [...products]
    .filter(product => currentFilter === 'all' || product.category === currentFilter)
    .sort((a, b) => {
      if (sortProducts.value === 'low') return a.price - b.price;
      if (sortProducts.value === 'high') return b.price - a.price;
      return products.indexOf(a) - products.indexOf(b);
    });

  productGrid.innerHTML = sorted.map(product => `
    <article class="product-card reveal" data-category="${product.category}">
      <div class="product-media">
        ${artMarkup(product.shape)}
        <button class="heart" type="button" aria-label="Add ${product.name} to wishlist">♡</button>
      </div>
      <div class="product-info">
        <div class="flex items-start justify-between gap-3">
          <h3>${product.name}</h3>
          <span class="price">from ₹${product.price}</span>
        </div>
        <p class="size-prices">${product.sizes}</p>
        <div class="tag-row">${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <button class="btn btn-secondary" type="button">Add to Basket</button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.heart').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      button.textContent = button.classList.contains('active') ? '♥' : '♡';
      showToast(button.classList.contains('active') ? 'Saved to your moonlit wishlist' : 'Removed from wishlist');
    });
  });

  document.querySelectorAll('.product-info .btn').forEach(button => {
    button.addEventListener('click', () => showToast('Added to your crochet basket'));
  });
}

function renderGallery(filter = 'all') {
  galleryGrid.innerHTML = gallery
    .filter(item => filter === 'all' || item.category === filter)
    .map(item => `
      <article class="gallery-card reveal" data-title="${item.title}" data-shape="${item.shape}" style="--h:${item.height}">
        <div class="gallery-art">${artMarkup(item.shape)}</div>
        <p>${item.title}</p>
      </article>
    `).join('');

  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card.dataset.shape));
  });
}

function renderReviews() {
  document.querySelector('#reviewTrack').innerHTML = reviews.map(review => `
    <article class="review-card">
      <div class="stars">★★★★★</div>
      <blockquote>“${review.text}”</blockquote>
      <cite>${review.name}</cite>
    </article>
  `).join('');
  updateReviews();
}

function updateReviews() {
  document.querySelector('#reviewTrack').style.transform = `translateX(-${reviewIndex * 100}%)`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderProducts();
  });
});

galleryFilters.forEach(button => {
  button.addEventListener('click', () => {
    galleryFilters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderGallery(button.dataset.gallery);
  });
});

sortProducts.addEventListener('change', renderProducts);

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-label', mobileMenu.classList.contains('open') ? 'Close menu' : 'Open menu');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

document.querySelector('#prevReview').addEventListener('click', () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  updateReviews();
});

document.querySelector('#nextReview').addEventListener('click', () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  updateReviews();
});

setInterval(() => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  updateReviews();
}, 5200);

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#referenceUpload');
const fileName = document.querySelector('#fileName');

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  });
});

dropZone.addEventListener('drop', event => {
  const [file] = event.dataTransfer.files;
  if (file) {
    fileInput.files = event.dataTransfer.files;
    fileName.textContent = file.name;
  }
});

fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files[0]?.name || 'PNG, JPG, or moodboard screenshot';
});

document.querySelector('#customForm').addEventListener('submit', event => {
  event.preventDefault();
  showToast('Custom request sent into the stars');
  event.currentTarget.reset();
  fileName.textContent = 'PNG, JPG, or moodboard screenshot';
});

document.querySelector('#emailForm').addEventListener('submit', event => {
  event.preventDefault();
  showToast('Your note has been tucked into the meadow');
  event.currentTarget.reset();
});

function openLightbox(shape) {
  const lightbox = document.querySelector('#lightbox');
  document.querySelector('#lightboxArt').innerHTML = `<div class="gallery-art" style="height:min(34rem,72vh)">${artMarkup(shape)}</div>`;
  lightbox.classList.add('open');
}

document.querySelector('#closeLightbox').addEventListener('click', () => {
  document.querySelector('#lightbox').classList.remove('open');
});

document.querySelector('#lightbox').addEventListener('click', event => {
  if (event.target.id === 'lightbox') event.currentTarget.classList.remove('open');
});

let lastSparkle = 0;
document.addEventListener('pointermove', event => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const now = performance.now();
  if (now - lastSparkle < 55) return;
  lastSparkle = now;
  const sparkle = document.createElement('span');
  sparkle.className = 'cursor-sparkle';
  sparkle.textContent = '✦';
  sparkle.style.left = `${event.clientX}px`;
  sparkle.style.top = `${event.clientY}px`;
  sparkle.style.fontSize = `${Math.random() * .55 + .45}rem`;
  document.body.appendChild(sparkle);
  sparkle.animate([
    { transform: 'translate(-50%, -50%) scale(1)', opacity: .9 },
    { transform: `translate(${Math.random() * 34 - 17}px, ${Math.random() * -42 - 12}px) scale(0)`, opacity: 0 }
  ], { duration: 760, easing: 'ease-out' }).onfinish = () => sparkle.remove();
});

function createShootingStar() {
  const star = document.createElement('span');
  star.className = 'shooting-star';
  star.style.top = `${Math.random() * 45 + 8}%`;
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 5800);
}

setInterval(createShootingStar, 9000);

document.querySelector('#musicToggle').addEventListener('click', async event => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') await audioContext.resume();

  if (musicNodes.length) {
    musicNodes.forEach(node => node.stop?.());
    musicNodes = [];
    event.currentTarget.classList.remove('active');
    showToast('Ambient music paused');
    return;
  }

  const gain = audioContext.createGain();
  gain.gain.value = .035;
  gain.connect(audioContext.destination);
  [196, 246.94, 329.63].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = index === 1 ? 'triangle' : 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start();
    musicNodes.push(oscillator);
  });
  event.currentTarget.classList.add('active');
  showToast('Ambient moon hum playing');
});

function initGsap() {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-copy > *', { opacity: 0, y: 24, stagger: .12, duration: .9, ease: 'power3.out', delay: .4 });
  gsap.from('.hero-showcase', { opacity: 0, y: 30, scale: .96, duration: 1, ease: 'power3.out', delay: .55 });
  gsap.utils.toArray('.reveal, .price-card, .glass-card, .about-panel').forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 28,
      duration: .75,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 88%' }
    });
  });
  gsap.to('.parallax-card', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', scrub: true, start: 'top top', end: 'bottom top' }
  });
}

renderProducts();
renderGallery();
renderReviews();
initGsap();
