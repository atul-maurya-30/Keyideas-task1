document.addEventListener("DOMContentLoaded", function () {
  const items = Array.from(document.querySelectorAll(".ring-item"));
  const ringStage = document.getElementById("ringStage");
  const titleEl = document.getElementById("ringTitle");
  const priceEl = document.getElementById("ringPrice");
  const descEl = document.getElementById("ringDesc");
  const bgTitleEl = document.getElementById("ringBgTitle");

  const n = items.length;
  let current = 1; // center index
  let autoRotate = null;

  // Orbit settings (use let because values change on mobile)
  let offsetX = 500; // horizontal distance for side images
  let offsetY = 10;  // vertical distance for bottom images
  let topOffset = 5; // vertical shift for center image

  // Adjust offsets for mobile screens
  function adjustOffsets() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      offsetX = 180;
      offsetY = 90;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 1200px)").matches) {
      offsetX = 320;
      offsetY = 60;
      topOffset = 0;
    } else {
      offsetX = 500;
      offsetY = 10;
      topOffset = 5;
    }
  }

  adjustOffsets(); // call initially

  if (!n) return;

  // Compute direction (left/right) with wrap-around
  function computeDirection(targetIndex, fromIndex) {
    if (targetIndex === (fromIndex + 1) % n) return "right";
    if (targetIndex === (fromIndex - 1 + n) % n) return "left";
    const forward = (targetIndex - fromIndex + n) % n;
    const backward = (fromIndex - targetIndex + n) % n;
    return forward <= backward ? "right" : "left";
  }

  // Animate background title into center
  function animateBgTitleToCenter(idx, direction) {
    if (!bgTitleEl) return;
    const item = items[idx];

    bgTitleEl.style.transformOrigin = "center center";
    bgTitleEl.style.whiteSpace = "nowrap";
    bgTitleEl.style.textAlign = "center";
    bgTitleEl.style.willChange = "transform, opacity";

    const startX =
      direction === "left" ? -offsetX : direction === "right" ? offsetX : 0;
    const startY = Math.round(item.offsetHeight / 2 + offsetY + 40);
    const endY = Math.round(-(item.offsetHeight / 2 + topOffset + 20));

    bgTitleEl.style.transition = "none";
    bgTitleEl.style.opacity = "0";
    bgTitleEl.style.transform = `translate(-50%, -50%) translate(${startX}px, ${startY}px) scale(0.75)`;

    void bgTitleEl.offsetWidth;

    bgTitleEl.textContent = item.dataset.title;
    bgTitleEl.style.transition =
      "transform 0.8s cubic-bezier(.2,.9,.2,1), opacity 0.6s ease";
    bgTitleEl.style.transform = `translate(-50%, -50%) translate(0px, ${endY}px) scale(1)`;
    bgTitleEl.style.opacity = "1";
  }

  // Place background title quietly
  function placeBgTitleAtCenter(idx) {
    if (!bgTitleEl) return;
    const item = items[idx];
    const endY = Math.round(-(item.offsetHeight / 2 + topOffset + 20));
    bgTitleEl.style.transition = "none";
    bgTitleEl.textContent = item.dataset.title;
    bgTitleEl.style.transform = `translate(-50%, -50%) translate(0px, ${endY}px) scale(1)`;
    bgTitleEl.style.opacity = "1";
  }

  // Update ring info
  function updateRingInfo(idx, direction) {
    const item = items[idx];
    titleEl.textContent = item.dataset.title;
    priceEl.textContent = item.dataset.price;
    descEl.innerHTML = item.dataset.desc;

    if (!bgTitleEl) return;

    if (direction == null) placeBgTitleAtCenter(idx);
    else animateBgTitleToCenter(idx, direction);
  }

  // Position orbit images
  function positionOrbit(direction = null) {
    const centerX = ringStage.clientWidth / 2;
    const centerY = ringStage.clientHeight / 2;
    const rightIndex = (current + 1) % n;
    const leftIndex = (current - 1 + n) % n;

    items.forEach((item, i) => {
      if (i === current) {
        item.style.transform = `translate(${centerX - item.offsetWidth / 2}px, ${centerY - topOffset - item.offsetHeight / 2}px) scale(1.2)`;
        item.style.zIndex = 3;
        item.style.opacity = 1;
      } else if (i === rightIndex) {
        item.style.transform = `translate(${centerX + offsetX - item.offsetWidth / 2}px, ${centerY + offsetY}px) scale(0.8)`;
        item.style.zIndex = 2;
        item.style.opacity = 0.6;
      } else if (i === leftIndex) {
        item.style.transform = `translate(${centerX - offsetX - item.offsetWidth / 2}px, ${centerY + offsetY}px) scale(0.8)`;
        item.style.zIndex = 2;
        item.style.opacity = 0.6;
      } else {
        item.style.transform = `translate(${centerX - item.offsetWidth / 2}px, ${centerY + offsetY * 3}px) scale(0.6)`;
        item.style.zIndex = 1;
        item.style.opacity = 0;
      }
    });

    updateRingInfo(current, direction);
  }

  function setCenter(idx, direction = null) {
    current = idx;
    positionOrbit(direction);
  }

  function next() {
    const newIdx = (current + 1) % n;
    setCenter(newIdx, "right");
  }

  function prev() {
    const newIdx = (current - 1 + n) % n;
    setCenter(newIdx, "left");
  }

  function startAuto() {
    stopAuto();
  }

  function stopAuto() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  // Initialize
  setCenter(current, null);
  startAuto();

  // Click handlers
  items.forEach((it, idx) => {
    it.addEventListener("click", () => {
      stopAuto();
      if (idx === current) setCenter(idx, null);
      else {
        const dir = computeDirection(idx, current);
        setCenter(idx, dir);
      }
      setTimeout(startAuto, 1200);
    });
  });

  // Pause on hover/focus
  ringStage.addEventListener("mouseenter", stopAuto);
  ringStage.addEventListener("mouseleave", startAuto);
  ringStage.addEventListener("focusin", stopAuto);
  ringStage.addEventListener("focusout", startAuto);

  // Keyboard nav
  ringStage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopAuto();
      prev();
      setTimeout(startAuto, 1000);
    }
    if (e.key === "ArrowRight") {
      stopAuto();
      next();
      setTimeout(startAuto, 1000);
    }
  });

  // Diamond shapes selection (if any)
  const diamondShapes = document.querySelectorAll(".diamond-shape");
  diamondShapes.forEach((shape) => {
    shape.addEventListener("click", function () {
      diamondShapes.forEach((s) => s.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Recalculate offsets and reposition on window resize
  window.addEventListener("resize", () => {
    adjustOffsets();
    positionOrbit(); // reposition orbit with updated offsets
  });
});
// Scroll arrow functionality
document.addEventListener("DOMContentLoaded", function() {
  const scrollArrow = document.querySelector('.scroll-arrow');
  const arrowIcon = scrollArrow.querySelector('i');
  
  // Function to check if user is at the bottom of the page
  function isAtBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  }
  
  // Function to check if user is at the top of the page
  function isAtTop() {
    return window.scrollY < 50;
  }
  
  // Function to update arrow direction
  function updateArrowDirection() {
    if (isAtBottom()) {
      scrollArrow.classList.add('scroll-to-top');
    } else if (isAtTop()) {
      scrollArrow.classList.remove('scroll-to-top');
    }
  }
  
  // Initial check
  updateArrowDirection();
  
  // Scroll arrow click handler
  scrollArrow.addEventListener('click', function() {
    if (isAtBottom()) {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to bottom
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
  
  // Update arrow direction on scroll
  window.addEventListener('scroll', updateArrowDirection);
});

// 3D Diamond Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('carousel');
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // Card data matching the image
  const cardData = [
    { title: "Round", desc: "Every diamond in our collection", img: "round.png" },
    { title: "Emerald", desc: "Every diamond in our collection", img: "diamond.png" },
    { title: "Princess", desc: "Every diamond in our collection", img: "round.png" },
    { title: "Oval", desc: "Every diamond in our collection", img: "oval.png" },
    { title: "Heart", desc: "Every diamond in our collection", img: "heart.png" },
    { title: "Asscher", desc: "Every diamond in our collection", img: "asscher.png" },
    { title: "Cushion", desc: "Every diamond in our collection", img: "heart.png" }
  ];
  
  let currentIndex = Math.floor(cardData.length / 2); // Start with middle card centered
  const totalCards = cardData.length;
  const visibleCards = 7; // Show all 7 cards
  
  // Initialize carousel
  function initCarousel() {
    // Create cards
    carousel.innerHTML = '';
    cardData.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${data.img}" class="card-img" alt="${data.title}">
        <h3 class="card-title">${data.title}</h3>
        <p class="card-desc">${data.desc}</p>
      `;
      carousel.appendChild(card);
    });
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToCard(i);
      });
      dotsContainer.appendChild(dot);
    }
    
    positionCards();
  }
  
  // Position cards in 3D space
  function positionCards() {
    const cards = document.querySelectorAll('.card');
    const centerIndex = Math.floor(visibleCards / 2);
    
    cards.forEach((card, index) => {
      // Calculate position relative to center
      let position = index - currentIndex;
      
      // Handle wrapping for circular carousel (shortest path)
      if (position < -totalCards / 2) position += totalCards;
      if (position > totalCards / 2) position -= totalCards;
      
      // Calculate properties based on position
      const absPos = Math.abs(position);
      const zIndex = visibleCards - absPos;
      const scale = 1 - absPos * 0.01;
      const offsetX = position * 180;
      const rotateDeg = -position * 15;
      const zTranslate = -absPos * 0;
      
      // Apply styles
      card.style.opacity = '1';
      card.style.zIndex = zIndex;
      card.style.pointerEvents = 'all';
      card.style.transform = `translate3d(${offsetX}px, 0, ${zTranslate}px) rotateY(${rotateDeg}deg) scale(${scale})`;
      
      // Add active class to center card
      if (position === 0) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    updateDots();
  }
  
  // Update dot indicators
  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Go to specific card
  function goToCard(index) {
    currentIndex = index;
    positionCards();
  }
  
  // Next card
  function nextCard() {
    currentIndex = (currentIndex + 1) % totalCards;
    positionCards();
  }
  
  // Previous card
  function prevCard() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    positionCards();
  }
  
  // Click on carousel container to navigate
  carousel.parentElement.addEventListener('click', (e) => {
    const rect = carousel.parentElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    if (clickX < width / 3) {
      // Clicked on left third
      prevCard();
    } else if (clickX > (width / 3) * 2) {
      // Clicked on right third
      nextCard();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'ArrowRight') {
      nextCard();
    }
  });
  
  // Button event listeners
  prevBtn.addEventListener('click', prevCard);
  nextBtn.addEventListener('click', nextCard);
  
  // Initialize the carousel
  initCarousel();
  
});

// Subscribe form handler
document.getElementById("subscribeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("subscriberEmail").value;
  alert(`Thank you for subscribing, ${email}!`);
  this.reset();
});
