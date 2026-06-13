/* ============================================================
   Timee — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVIGATION
  // ============================================================
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

  // ============================================================
  // 2. HERO CANVAS PARTICLES ✦
  //    Floating light motes in the dark hero background,
  //    like dust catching golden light in a quiet room.
  // ============================================================
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    const ctx = heroParticles.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      heroParticles.width = heroParticles.offsetWidth;
      heroParticles.height = heroParticles.offsetHeight;
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(55, Math.floor(heroParticles.width / 12));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * heroParticles.width,
          y: Math.random() * heroParticles.height,
          size: Math.random() * 2.5 + 0.5,
          speedY: -(Math.random() * 0.25 + 0.08),
          speedX: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.35 + 0.06,
          glow: Math.random() > 0.6,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, heroParticles.width, heroParticles.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around edges
        if (p.y < -10) {
          p.y = heroParticles.height + 10;
          p.x = Math.random() * heroParticles.width;
        }
        if (p.x < -10) p.x = heroParticles.width + 10;
        if (p.x > heroParticles.width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Glow halo on larger particles
        if (p.glow && p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 146, 90, ${p.opacity * 0.12})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(drawParticles);
    };

    resize();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animId);
    });
  }

  // ============================================================
  // 3. HERO PARALLAX — subtle movement on mouse
  // ============================================================
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      heroContent.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  // ============================================================
  // 4. CURSOR GLOW
  //    A warm, slow-moving light that follows the mouse.
  // ============================================================
  const cursorGlow = document.getElementById('cursorGlow');
  let cursorX = -200, cursorY = -200;
  let posX = -200, posY = -200;

  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorGlow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    }, { passive: true });

    // Smooth follow with requestAnimationFrame
    const followCursor = () => {
      posX += (cursorX - posX) * 0.08;
      posY += (cursorY - posY) * 0.08;
      cursorGlow.style.left = posX + 'px';
      cursorGlow.style.top = posY + 'px';
      requestAnimationFrame(followCursor);
    };
    followCursor();
  }

  // ============================================================
  // 5. REVEAL ON SCROLL
  // ============================================================
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

  // ============================================================
  // 6. PHILOSOPHY SVG STROKE DRAW
  // ============================================================
  const svgIcons = document.querySelectorAll('.philosophy__icon');

  svgIcons.forEach((icon) => {
    const paths = icon.querySelectorAll('path, circle, polygon');
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.dataset.length = length;
    });
  });

  const svgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('philosophy__icon--drawn');
          svgObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  svgIcons.forEach((icon) => svgObserver.observe(icon));

  // ============================================================
  // 7. PRODUCT MODAL (legacy — Coming Soon products)
  // ============================================================
  const modal = document.getElementById('productModal');
  if (modal) {
    const modalOverlay = modal.querySelector('.modal__overlay');
    const modalClose = modal.querySelector('.modal__close');
    const modalTitle = modal.querySelector('.modal__title');
    const modalDesc = modal.querySelector('.modal__desc');
    const modalPrice = modal.querySelector('.modal__price');

    const productData = {
      'pocket-stone': {
        title: 'Pocket Stone',
        desc: 'A single amethyst or rose quartz crystal, polished smooth and ready to carry with you...',
        price: '$14.99'
      },
      'crystal-kit': {
        title: 'Crystal Kit',
        desc: 'Four crystals in harmony: Amethyst (calm), Rose Quartz (love), Citrine (abundance)...',
        price: '$34.99'
      },
      'moon-phase': {
        title: 'Moon Phase Crystal',
        desc: 'Your birth month\'s guardian crystal, displayed on a handcrafted wooden moon phase stand...',
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
  }

  // ============================================================
  // 8. WAITLIST FORM
  // ============================================================
  const form = document.getElementById('waitlistForm');
  if (form) {
    const emailInput = document.getElementById('emailInput');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) return;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Waitlist signup:', email);

      form.style.display = 'none';
      successMsg.style.display = 'block';
    });
  }

  // ============================================================
  // 9. CHECKOUT MODAL
  // ============================================================
  const productInfo = {
    'pink-elephant': { title: 'Pink Crystal Elephant', price: '$426', sold: true },
    'aquamarine-bracelet': { title: 'Aquamarine Bracelet', price: '$420' },
    'geode-mirror': { title: 'Amethyst Geode Mirror', price: '$624' },
    'amethyst-bracelet': { title: 'Amethyst Bracelet', price: '$350' },
    'pixiu-bracelet': { title: 'Pi Xiu Bracelet', price: '$310' },
    'titanium-bangle': { title: 'Titanium Gold Bangle', price: '$1,639' }
  };

  const checkoutHTML = `
    <div class="modal" id="checkoutModal">
      <div class="modal__overlay" id="checkoutOverlay"></div>
      <div class="modal__content" style="max-width:520px">
        <button class="modal__close" id="checkoutClose">&times;</button>
        <div class="modal__body">
          <h3 class="modal__title" id="checkoutTitle">Order</h3>
          <p style="color:var(--color-text-light);font-weight:300;font-size:0.95rem" id="checkoutDesc"></p>
          <p style="font-family:var(--font-serif);font-size:1.3rem;color:var(--color-accent);margin:0.5rem 0" id="checkoutPrice"></p>
          <form id="orderForm" style="display:flex;flex-direction:column;gap:0.8rem;margin-top:1rem">
            <input type="hidden" id="orderProduct" name="product" />
            <input type="hidden" id="orderPrice" name="price" />
            <input type="text" name="name" placeholder="Your full name" required class="contact__input" />
            <input type="email" name="email" placeholder="Your email address" required class="contact__input" />
            <textarea name="address" placeholder="Shipping address (street, city, country, zip)" rows="3" required class="contact__input" style="resize:vertical;font-family:var(--font-sans);font-weight:300"></textarea>
            <div style="font-size:0.8rem;color:var(--color-text-muted);padding:0.5rem 0">
              📦 We'll send you a PayPal invoice within 24 hours. Free shipping on orders over $50.
            </div>
            <button type="submit" class="btn btn--primary" style="align-self:flex-start">Place Order</button>
          </form>
          <div id="orderSuccess" style="display:none;padding:1rem;background:#E8F5E9;color:#2E7D32;border-radius:0;font-size:0.95rem;margin-top:1rem">
            ✅ Order received! We'll email you a PayPal invoice within 24 hours.
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', checkoutHTML);

  const coModal = document.getElementById('checkoutModal');
  const coClose = document.getElementById('checkoutClose');
  const coOverlay = document.getElementById('checkoutOverlay');
  const coForm = document.getElementById('orderForm');
  const coTitle = document.getElementById('checkoutTitle');
  const coDesc = document.getElementById('checkoutDesc');
  const coPrice = document.getElementById('checkoutPrice');
  const coProduct = document.getElementById('orderProduct');
  const coPriceInput = document.getElementById('orderPrice');
  const coSuccess = document.getElementById('orderSuccess');

  document.querySelectorAll('.buy-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var info = productInfo[this.dataset.product];
      if (!info) return;
      coTitle.textContent = info.title;
      coDesc.textContent = 'You are ordering: ' + info.title;
      coPrice.textContent = info.price;
      coProduct.value = info.title;
      coPriceInput.value = info.price;
      coModal.classList.add('modal--open');
      coForm.style.display = 'flex';
      coSuccess.style.display = 'none';
      coForm.reset();
    });
  });

  coClose.addEventListener('click', function() { coModal.classList.remove('modal--open'); });
  coOverlay.addEventListener('click', function() { coModal.classList.remove('modal--open'); });

  coForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = this.name.value;
    var email = this.email.value;
    var address = this.address.value;
    var product = this.product.value;
    var price = this.price.value;
    var subj = encodeURIComponent('Timee Order: ' + product);
    var body = encodeURIComponent(
      'Product: ' + product + '\nPrice: ' + price + '\nName: ' + name + '\nEmail: ' + email + '\nAddress: ' + address + '\n\nPlease send PayPal invoice to: ' + email
    );
    window.open('mailto:dylan_shi@hotmail.com?subject=' + subj + '&body=' + body, '_blank');
    this.style.display = 'none';
    coSuccess.style.display = 'block';
  });

  console.log('🐝 Timee — A billion years in the making.');
});
