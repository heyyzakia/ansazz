const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const progressBar = document.getElementById("scrollProgress");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const scrollTopButton = document.getElementById("scrollTop");
const counters = document.querySelectorAll(".counter");
const revealItems = document.querySelectorAll(".section-reveal, .slide-up");
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const serviceButtons = document.querySelectorAll("[data-service-target]");
const serviceDetails = document.querySelectorAll("[data-service-detail]");

let countersStarted = false;

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  setTimeout(() => loader.classList.add("hide"), 700);
});

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  header.classList.toggle("scrolled", scrollTop > 40);
  scrollTopButton.classList.toggle("show", scrollTop > 500);
}

window.addEventListener("scroll", updateScrollEffects);
updateScrollEffects();

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function animateCounter(counter) {
  const targetLabel = counter.dataset.target;
  const target = Number(targetLabel.includes("-") ? targetLabel.split("-").pop() : targetLabel);
  const duration = 1500;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    counter.textContent = Math.floor(target * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = targetLabel;
    }
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in-view");

      if (entry.target.classList.contains("stats") && !countersStarted) {
        countersStarted = true;
        counters.forEach(animateCounter);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
document.querySelectorAll(".stats").forEach((item) => observer.observe(item));

document.querySelectorAll(".ripple-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();

    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.serviceTarget;

    serviceDetails.forEach((detail) => {
      detail.classList.toggle("is-active", detail.id === targetId);
    });

    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Thank you. Your enquiry has been prepared for submission.";
    form.reset();
  });
}

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    item.classList.toggle("open", !isOpen);
    question.setAttribute("aria-expanded", String(!isOpen));
  });
});


