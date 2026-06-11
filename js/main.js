/* ============================================================
   Timee — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navigation scroll effect ----------
  const nav = document.getElementById('nav');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---------- Mobile nav toggle ----------
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    links.classList.toggle('nav__links--open');
  });

  // Close nav on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
    });
  });

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Reveal on scroll (Intersection Observer) ----------
  const revealElements = document.querySelectorAll(
    '.story__grid, .product-card, .philosophy__item, .philosophy__quote, .contact__card'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Stagger children for product cards
  document.querySelectorAll('.products__grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  // ---------- Product modal ----------
  const modal = document.getElementById('productModal');
  const modalOverlay = modal.querySelector('.modal__overlay');
  const modalClose = modal.querySelector('.modal__close');
  const modalTitle = modal.querySelector('.modal__title');
  const modalDesc = modal.querySelector('.modal__desc');
  const modalPrice = modal.querySelector('.modal__price');

  const productData = {
    'pocket-stone': {
      title: 'Pocket Stone',
      desc: 'A single amethyst or rose quartz crystal, polished smooth and ready to carry with you. Small enough to fit in any pocket, powerful enough to bring you back to the present moment. Each stone is naturally unique — no two are exactly alike.',
      price: '$14.99'
    },
    'crystal-kit': {
      title: 'Crystal Kit',
      desc: 'Four crystals in harmony: Amethyst (calm), Rose Quartz (love), Citrine (abundance), and Black Obsidian (protection). Each with its own meaning and energy. Comes with a guide to help you work with each stone.',
      price: '$34.99'
    },
    'moon-phase': {
      title: 'Moon Phase Crystal',
      desc: 'Your birth month\'s guardian crystal, displayed on a handcrafted wooden moon phase stand. A beautiful reminder of the cycles of nature — and your place within them. Twelve months, twelve stones, one journey.',
      price: '$59.99'
    }
  };

  const openModal = (productKey) => {
    const data = productData[productKey];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  };

  // Coming Soon buttons open modal
  document.querySelectorAll('[data-product]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.product);
    });
  });

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ---------- Waitlist form ----------
  const form = document.getElementById('waitlistForm');
  const emailInput = document.getElementById('emailInput');
  const successMsg = document.getElementById('successMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Here you would send to your backend / email service
    // For now, we just show success
    console.log('Waitlist signup:', email);

    form.style.display = 'none';
    successMsg.style.display = 'block';

    // Reset if they come back
    setTimeout(() => {
      // In production, don't reset — they're already signed up
    }, 1000);
  });

  // ---------- Parallax hero crystal ----------
  const crystal = document.querySelector('.hero__crystal-icon');
  if (crystal) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      crystal.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  console.log('🐝 Timee — A billion years in the making.');
});
