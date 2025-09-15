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
  let offsetY = 10; // vertical distance for bottom images
  let topOffset = 5; // vertical shift for center image

  // Adjust offsets for mobile screens
  function adjustOffsets() {
    if (window.matchMedia("(max-width: 320px)").matches) {
      offsetX = 90;
      offsetY = 0;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 375px)").matches) {
      offsetX = 100;
      offsetY = 0;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 414px)").matches) {
      offsetX = 150;
      offsetY = 0;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 480px)").matches) {
      offsetX = 150;
      offsetY = 10;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 575px)").matches) {
      offsetX = 170;
      offsetY = 0;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 768px)").matches) {
      offsetX = 220;
      offsetY = 0;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 1200px)").matches) {
      offsetX = 320;
      offsetY = 60;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 1400px)").matches) {
      offsetX = 520;
      offsetY = 70;
      topOffset = 0;
    } else if (window.matchMedia("(max-width: 1600px)").matches) {
      offsetX = 560;
      offsetY = 70;
      topOffset = 0;
    } else {
      offsetX = 680;
      offsetY = 70;
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

    if (window.matchMedia("(min-width: 992px)").matches) {
      // Large screens → no wrapping
      bgTitleEl.style.whiteSpace = "nowrap";
    } else {
      // Small screens → wrapping allowed
      bgTitleEl.style.whiteSpace = "wrap";
    }

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
        item.style.transform = `translate(${
          centerX - item.offsetWidth / 2
        }px, ${centerY - topOffset - item.offsetHeight / 2}px) scale(1.2)`;
        item.style.zIndex = 3;
        item.style.opacity = 1;
      } else if (i === rightIndex) {
        item.style.transform = `translate(${
          centerX + offsetX - item.offsetWidth / 2
        }px, ${centerY + offsetY}px) scale(0.8)`;
        item.style.zIndex = 2;
        item.style.opacity = 0.6;
      } else if (i === leftIndex) {
        item.style.transform = `translate(${
          centerX - offsetX - item.offsetWidth / 2
        }px, ${centerY + offsetY}px) scale(0.8)`;
        item.style.zIndex = 2;
        item.style.opacity = 0.6;
      } else {
        item.style.transform = `translate(${
          centerX - item.offsetWidth / 2
        }px, ${centerY + offsetY * 3}px) scale(0.6)`;
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
document.addEventListener("DOMContentLoaded", function () {
  const scrollArrow = document.querySelector(".scroll-arrow");
  const arrowIcon = scrollArrow.querySelector("i");

  // Function to check if user is at the bottom of the page
  function isAtBottom() {
    return (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    );
  }

  // Function to check if user is at the top of the page
  function isAtTop() {
    return window.scrollY < 50;
  }

  // Function to update arrow direction
  function updateArrowDirection() {
    if (isAtBottom()) {
      scrollArrow.classList.add("scroll-to-top");
    } else if (isAtTop()) {
      scrollArrow.classList.remove("scroll-to-top");
    }
  }

  // Initial check
  updateArrowDirection();

  // Scroll arrow click handler
  scrollArrow.addEventListener("click", function () {
    if (isAtBottom()) {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll to bottom
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  // Update arrow direction on scroll
  window.addEventListener("scroll", updateArrowDirection);
});

// 3D Diamond Carousel Functionality - Responsive with preserved tilt
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  const dotsContainer = document.getElementById("dots");

  // Card data matching the image
  const cardData = [
    {
      title: "Round",
      desc: "Every diamond in our collection",
      img: "images/round.webp",
    },
    {
      title: "Emerald",
      desc: "Every diamond in our collection",
      img: "images/diamond.webp",
    },
    {
      title: "Princess",
      desc: "Every diamond in our collection",
      img: "images/round.webp",
    },
    {
      title: "Oval",
      desc: "Every diamond in our collection",
      img: "images/oval.webp",
    },
    {
      title: "Heart",
      desc: "Every diamond in our collection",
      img: "images/heart.webp",
    },
    {
      title: "Asscher",
      desc: "Every diamond in our collection",
      img: "images/asscher.webp",
    },
    {
      title: "Cushion",
      desc: "Every diamond in our collection",
      img: "images/heart.webp",
    },
  ];

  let currentIndex = Math.floor(cardData.length / 2);
  const totalCards = cardData.length;
  let visibleCards = getVisibleCardsCount();

  // Get number of visible cards based on screen width
  function getVisibleCardsCount() {
    if (window.innerWidth <= 768) return 3;
    if (window.innerWidth <= 1200) return 5;
    return 7;
  }

  // Initialize carousel
  function initCarousel() {
    // Create cards
    carousel.innerHTML = "";
    cardData.forEach((data, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-image-container">
          <img src="${data.img}" class="card-img" alt="${data.title}">
        </div>
        <div class="card-content">
          <h3 class="card-title">${data.title}</h3>
          <p class="card-desc">${data.desc}</p>
        </div>
      `;
      carousel.appendChild(card);
    });

    // Create dots
    updateDots();

    positionCards();
  }

  // Update dot indicators
  function updateDots() {
    dotsContainer.innerHTML = "";
    const visibleDots = getVisibleCardsCount();

    // Calculate the range of dots to show based on currentIndex
    const halfVisible = Math.floor(visibleDots / 2);
    let startIndex = currentIndex - halfVisible;
    let endIndex = currentIndex + halfVisible;

    // Handle edge cases for circular carousel
    if (startIndex < 0) {
      endIndex += Math.abs(startIndex);
      startIndex = 0;
    }
    if (endIndex >= totalCards) {
      startIndex -= endIndex - totalCards + 1;
      endIndex = totalCards - 1;
    }

    // Ensure we show exactly visibleDots number of dots
    const dotsToShow = [];
    for (let i = 0; i < visibleDots; i++) {
      let dotIndex = (startIndex + i) % totalCards;
      if (dotIndex < 0) dotIndex += totalCards;
      dotsToShow.push(dotIndex);
    }

    // Create the dots
    dotsToShow.forEach((dotIndex) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (dotIndex === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goToCard(dotIndex);
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Position cards in 3D space (preserving original tilt)
  function positionCards() {
    const cards = document.querySelectorAll(".card");
    visibleCards = getVisibleCardsCount();

    cards.forEach((card, index) => {
      // Calculate position relative to center
      let position = index - currentIndex;

      // Handle wrapping for circular carousel (shortest path)
      if (position < -totalCards / 2) position += totalCards;
      if (position > totalCards / 2) position -= totalCards;

      // Calculate properties based on position
      const absPos = Math.abs(position);

      // Hide cards that are outside the visible range
      if (absPos > Math.floor(visibleCards / 2)) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.zIndex = "0";
        return;
      }

      const zIndex = visibleCards - absPos;
      const scale = 1 - absPos * 0.01;

      // Adjust offset based on screen size but maintain the same rotation
      let offsetX;
      let zTranslate; // Declare zTranslate here

      if (window.innerWidth <= 768) {
        offsetX = position * 140; // Smaller offset for mobile
        zTranslate = -absPos * 200; // Use absPos * 100 for mobile
      } else if (window.innerWidth <= 1200) {
        offsetX = position * 130; // Medium offset for tablet
        zTranslate = -absPos * 0; // Default for tablet
      } else {
        offsetX = position * 180; // Default offset for desktop
        zTranslate = -absPos * 0; // Default for desktop
      }

      // Preserve the original rotation values
      const rotateDeg = -position * 15;

      // Apply styles
      card.style.opacity = "1";
      card.style.zIndex = zIndex;
      card.style.pointerEvents = "all";
      card.style.transform = `translate3d(${offsetX}px, 0, ${zTranslate}px) rotateY(${rotateDeg}deg) scale(${scale})`;

      // Add active class to center card
      if (position === 0) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    updateDots();
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
  carousel.parentElement.addEventListener("click", (e) => {
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevCard();
    } else if (e.key === "ArrowRight") {
      nextCard();
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      visibleCards = getVisibleCardsCount();
      positionCards();
    }, 250);
  });

  // Initialize the carousel
  initCarousel();

  // Add touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.parentElement.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  carousel.parentElement.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next card
      nextCard();
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous card
      prevCard();
    }
  }
});

// Subscribe form handler
// / Form submission handling for both forms
document
  .getElementById("subscribeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("subscriberEmail").value;
    alert(`Subscribed with email: ${email}`);
    this.reset();
  });

document
  .getElementById("subscribeFormMobile")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("subscriberEmailMobile").value;
    alert(`Subscribed with email: ${email}`);
    this.reset();
  });
// Function to move inquiry and feedback to mobile menu
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const closeMenuButton = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const navItems = document.querySelectorAll(".mobile-nav-item");

  // Toggle mobile menu
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeMenuButton.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Toggle dropdowns
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const dropdown = this.nextElementSibling;
      const arrow = this.querySelector(".dropdown-arrow");

      // Close all other dropdowns
      document.querySelectorAll(".mobile-dropdown").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active");
        }
      });

      document.querySelectorAll(".dropdown-arrow").forEach((a) => {
        if (a !== arrow) {
          a.classList.remove("rotated");
        }
      });

      // Toggle current dropdown
      dropdown.classList.toggle("active");
      arrow.classList.toggle("rotated");
    });
  });

  // Close menu when clicking outside
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
});
