// Déclenchement de l'animation d'ouverture du Hero
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('is-loaded');
  });
});

// Navigation : fond au scroll + bascule sombre sur la section Commerces + menu mobile
const nav = document.getElementById('nav');
const burger = document.querySelector('.nav__burger');
const darkSection = document.getElementById('offres');
const parallaxImgs = document.querySelectorAll('[data-parallax]');

const onScroll = () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
  if (darkSection) {
    const rect = darkSection.getBoundingClientRect();
    const overDark = rect.top <= 64 && rect.bottom >= 64;
    nav.classList.toggle('is-dark', overDark);
  }

  // Parallaxe douce sur les images des grands projets
  const vh = window.innerHeight;
  parallaxImgs.forEach((img) => {
    const rect = img.parentElement.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const offset = Math.max(-18, Math.min(18, progress * -24));
      img.style.transform = `scale(1.06) translateY(${offset}px)`;
    }
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.nav__links a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  })
);

// Apparition fluide des textes et ouverture rideau des médias
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
);

document.querySelectorAll('.reveal, .reveal-media').forEach((el) => {
  const siblings = [...el.parentElement.children].filter(
    (c) => c.classList.contains('reveal') || c.classList.contains('reveal-media')
  );
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 65}ms`;
  io.observe(el);
});

// Bascule de la grille d'aperçus au survol / clic des 4 Expertises
const expGrid = document.querySelector('.expertise__grid');
const expShowcase = document.querySelector('.expertise__showcase');
const expCards = document.querySelectorAll('.exp-card[data-exp]');
const expPanels = document.querySelectorAll('.exp-panel[data-panel]');

const updateShowcaseLocation = () => {
  if (!expGrid || !expShowcase) return;
  const isMobile = window.innerWidth <= 900;
  if (isMobile) {
    // Sur mobile : on glisse la grille directement sous la carte active
    const activeCard = document.querySelector('.exp-card.is-active') || expCards[0];
    if (activeCard && activeCard.nextElementSibling !== expShowcase) {
      activeCard.after(expShowcase);
    }
  } else {
    // Sur PC et tablette : la grille reste ancrée de manière fixe après la grille des 4 cartes
    if (expGrid.nextElementSibling !== expShowcase) {
      expGrid.after(expShowcase);
    }
  }
};

const activateExpertise = (id) => {
  expCards.forEach((c) => c.classList.toggle('is-active', c.dataset.exp === id));
  expPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
  updateShowcaseLocation();
};
window.activateExpertise = activateExpertise;

expCards.forEach((card) => {
  card.addEventListener('pointerenter', (e) => {
    // Sur PC uniquement au survol
    if (e.pointerType === 'mouse' && window.innerWidth > 900) {
      activateExpertise(card.dataset.exp);
    }
  });
  card.addEventListener('focus', () => {
    if (window.innerWidth > 900) activateExpertise(card.dataset.exp);
  });
  card.addEventListener('click', () => activateExpertise(card.dataset.exp));
});

window.addEventListener('resize', updateShowcaseLocation);
updateShowcaseLocation();

// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();
