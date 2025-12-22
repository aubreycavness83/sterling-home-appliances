function initHeroCarousel(rootEl) {
  const track = rootEl.querySelector(".hero-carousel__track");
  const slides = Array.from(rootEl.querySelectorAll(".hero-carousel__slide"));
  const prevBtn = rootEl.querySelector(".hero-carousel__btn--prev");
  const nextBtn = rootEl.querySelector(".hero-carousel__btn--next");
  const dots = Array.from(rootEl.querySelectorAll(".hero-carousel__dot"));

  let index = 0;
  let intervalId = null;

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("hero-carousel__dot--active", i === index);
    });
  }

  function next() {
    index = (index + 1) % slides.length;
    render();
  }

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    render();
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      render();
    });
  });

  rootEl.addEventListener("mouseenter", stopAutoplay);
  rootEl.addEventListener("mouseleave", startAutoplay);

  rootEl.setAttribute("tabindex", "0");
  rootEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  render();
  startAutoplay();
}

initHeroCarousel(document.querySelector("[data-hero-carousel]"));

function initProductSlider(rootEl) {
  const track = rootEl.querySelector(".product-slider__track");
  const cards = Array.from(rootEl.querySelectorAll(".product-card"));

  // FIXED: Changed selectors to match your HTML (single dash instead of double)
  const prevBtn = rootEl.querySelector(".product-slider__btn-prev");
  const nextBtn = rootEl.querySelector(".product-slider__btn-next");

  if (!track || !prevBtn || !nextBtn) {
    console.error("Slider elements not found. Check your HTML classes.");
    return;
  }

  let index = 0;
  let visibleCount = 5;

  function calcVisibleCount() {
    const w = window.innerWidth;
    if (w < 576) return 2; // phones
    if (w < 992) return 3; // tablets/small laptops
    return 5; // desktop
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - visibleCount);
  }

  function getStepPx() {
    if (cards.length === 0) return 0;
    const firstCard = cards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;

    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return cardWidth + gap;
  }

  function updateButtons() {
    const maxIndex = getMaxIndex();
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  }

  function render() {
    // Update visible count and set the CSS variable for the card widths
    visibleCount = calcVisibleCount();
    rootEl.style.setProperty("--visible-count", visibleCount);

    const maxIndex = getMaxIndex();
    if (index > maxIndex) index = maxIndex;

    const offset = index * getStepPx();
    track.style.transform = `translateX(-${offset}px)`;

    updateButtons();
  }

  function next() {
    index = Math.min(index + 1, getMaxIndex());
    render();
  }

  function prev() {
    index = Math.max(index - 1, 0);
    render();
  }

  // Event Listeners
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  window.addEventListener("resize", render);

  // Initial call
  render();
}

// INITIALIZATION: This tells the script to look for your slider and start the logic
document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".product-slider");
  if (sliderEl) {
    initProductSlider(sliderEl);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const heroRoot = document.querySelector("[data-hero-carousel]");
  if (heroRoot) initHeroCarousel(heroRoot);

  const productRoot = document.querySelector(".product-slider");
  if (productRoot) initProductSlider(productRoot);
});
