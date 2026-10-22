document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Active page navigation
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });

  // Footer year
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll(".reveal")]
            : [];
          const index = Math.max(0, siblings.indexOf(entry.target));
          entry.target.style.animationDelay = `${Math.min(index * 70, 350)}ms`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Menu detail modal
  const modal = document.getElementById("itemModal");
  if (modal) {
    const title = document.getElementById("modalTitle");
    const details = document.getElementById("modalDetails");
    const price = document.getElementById("modalPrice");

    document.querySelectorAll(".details-btn").forEach(button => {
      button.addEventListener("click", () => {
        title.textContent = button.dataset.item;
        details.textContent = button.dataset.details;
        price.textContent = button.dataset.price;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };
    modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const image = document.getElementById("lightboxImage");
    document.querySelectorAll(".gallery-item img").forEach(img => {
      img.addEventListener("click", () => {
        image.src = img.src;
        image.alt = img.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      image.src = "";
    };
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox || e.target.hasAttribute("data-close-lightbox")) closeLightbox();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // Contact demo form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      document.getElementById("contactStatus").textContent =
        "Thanks! Your demo message has been received by the page.";
      contactForm.reset();
    });
  }

  // Order summary + demo checkout
  const orderItem = document.getElementById("orderItem");
  const orderQty = document.getElementById("orderQty");
  const summaryItem = document.getElementById("summaryItem");
  const summaryQty = document.getElementById("summaryQty");
  const summaryTotal = document.getElementById("summaryTotal");

  const updateSummary = () => {
    if (!orderItem) return;
    const selected = orderItem.options[orderItem.selectedIndex];
    const item = selected && selected.value ? selected.value : "—";
    const price = selected && selected.dataset.price ? Number(selected.dataset.price) : 0;
    const qty = Math.max(1, Number(orderQty.value) || 1);
    summaryItem.textContent = item;
    summaryQty.textContent = qty;
    summaryTotal.textContent = `₹${price * qty}`;
  };

  if (orderItem && orderQty) {
    orderItem.addEventListener("change", updateSummary);
    orderQty.addEventListener("input", updateSummary);
    updateSummary();
  }

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("customerName").value.trim() || "Guest";
      const item = orderItem.value;
      const status = document.getElementById("orderStatus");
      if (!item) {
        status.textContent = "Please choose an item first.";
        return;
      }
      status.textContent = `Thanks, ${name}! Your demo order for ${item} is ready.`;
      orderForm.reset();
      document.getElementById("orderQty").value = 1;
      updateSummary();
    });
  }
});
