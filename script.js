// script.js — rotating ring carousel with click info update, keyboard nav, and card reveal
document.addEventListener('DOMContentLoaded', function () {
  const items = Array.from(document.querySelectorAll('.ring-item'));
  const ringStage = document.getElementById('ringStage');
  const title = document.getElementById('ringTitle');
  const price = document.getElementById('ringPrice');
  const desc = document.getElementById('ringDesc');
  let current = 1; // center index
  let autoRotate = null;
  const ROTATE_DELAY = 3800;

  if (items.length === 0) return;
function positionOrbit() {
    const centerX = ringStage.clientWidth / 2;
    const centerY = ringStage.clientHeight / 2;
    const offset = 500; // horizontal distance for side images
    const topOffset = 50; // vertical distance for center image

    items.forEach((item, i) => {
        if (i === current) {
            // center image → top
            item.style.transform = `translate(${centerX - item.offsetWidth/2}px, ${centerY - topOffset - item.offsetHeight/2}px) scale(1.2)`;
            item.style.zIndex = 3;
            item.style.opacity = 1;
        } else if (i === (current + 1) % 3) {
            // right image → bottom right
            item.style.transform = `translate(${centerX + offset - item.offsetWidth/2}px, ${centerY + 80}px) scale(0.8)`;
            item.style.zIndex = 2;
            item.style.opacity = 0.6;
        } else if (i === (current + 2) % 3) {
            // left image → bottom left
            item.style.transform = `translate(${centerX - offset - item.offsetWidth/2}px, ${centerY + 80}px) scale(0.8)`;
            item.style.zIndex = 2;
            item.style.opacity = 0.6;
        }
    });
}

  function setCenter(idx) {
    current = idx;
    positionOrbit();
  }
  

  function next() { setCenter((current + 1) % items.length); }
  function prev() { setCenter((current - 1 + items.length) % items.length); }

  function startAuto() {
    stopAuto();
    autoRotate = setInterval(next, ROTATE_DELAY);
  }
  function stopAuto() {
    if (autoRotate) { clearInterval(autoRotate); autoRotate = null; }
  }

  // Initialize
  setCenter(current);
  startAuto();

  // Click handlers (stop + set + restart)
  items.forEach((it, idx) => {
    it.addEventListener('click', () => {
      stopAuto();
      setCenter(idx);
      // small timeout to restart auto to give user time to view
      setTimeout(startAuto, 1200);
    });
  });

  // Pause on hover/focus for accessibility
  ringStage.addEventListener('mouseenter', stopAuto);
  ringStage.addEventListener('mouseleave', startAuto);
  ringStage.addEventListener('focusin', stopAuto);
  ringStage.addEventListener('focusout', startAuto);

  // Keyboard navigation (left / right)
  ringStage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { stopAuto(); prev(); setTimeout(startAuto, 1000); }
    if (e.key === 'ArrowRight') { stopAuto(); next(); setTimeout(startAuto, 1000); }
  });

  // Reveal collection cards when they enter viewport (intersection observer)
  const reveals = document.querySelectorAll('.collection-row .card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // if you want them to animate just once, unobserve
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  reveals.forEach(r => obs.observe(r));

  // Forms (simple client-side behavior)
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('subscriberEmail').value.trim();
      if (!email) { alert('Please enter a valid email'); return; }
      alert('Thanks for subscribing — ' + email);
      subscribeForm.reset();
    });
  }

  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(inquiryForm);
      const name = fd.get('name'), email = fd.get('email'), message = fd.get('message');
      if (!name || !email || !message) { alert('Please fill all fields'); return; }
      alert('Thanks, ' + name + '. Your message has been received.');
      inquiryForm.reset();
    });
  }
});
