// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(255, 255, 255, 0.96)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  }
});

// Contact Form Handling
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.service) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    showNotification(
      "Thank you for your message! We will get back to you within 24 hours.",
      "success"
    );
    contactForm.reset();

    // In a real application, you would send the data to your server here
    console.log("Form submitted:", data);
  });
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#7CB342"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(notification);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".service-card, .story-card, .opportunity-card, .partner-card, .sector-card, .feature-card, .value-card, .team-member, .destination-card"
  );

  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      const suffix = element.dataset.suffix || "";
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      const suffix = element.dataset.suffix || "";
      element.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector(".stat-number");
        if (statNumber && statNumber.dataset.target) {
          const targetValue = parseInt(statNumber.dataset.target);
          const originalText = statNumber.textContent;
          const suffix = originalText.includes("+")
            ? "+"
            : originalText.includes("%")
            ? "%"
            : "";
          statNumber.dataset.suffix = suffix;
          animateCounter(statNumber, targetValue);
          statsObserver.unobserve(entry.target);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener("DOMContentLoaded", () => {
  const statItems = document.querySelectorAll(".stat-item, .impact-stat");
  statItems.forEach((item) => {
    statsObserver.observe(item);
  });
});

// FAQ Functionality
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
});

// Typewriter Effect
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typewriter effect
document.addEventListener("DOMContentLoaded", () => {
  const typewriterElement = document.querySelector(".typewriter");
  if (typewriterElement) {
    const text = typewriterElement.textContent;
    typeWriter(typewriterElement, text, 150);
  }
});

// Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove("lazy");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu
    if (navMenu) {
      navMenu.classList.remove("active");
    }
    if (navToggle) {
      navToggle.classList.remove("active");
    }

    // Close any notifications
    const notification = document.querySelector(".notification");
    if (notification) {
      notification.remove();
    }

    // Close any active FAQ items
    const activeFaq = document.querySelector(".faq-item.active");
    if (activeFaq) {
      activeFaq.classList.remove("active");
    }
  }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(() => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgb(255, 255, 255)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Add loading state to buttons
function addLoadingState(button, text = "Loading...") {
  const originalText = button.textContent;
  button.textContent = text;
  button.disabled = true;
  button.style.opacity = "0.7";

  return () => {
    button.textContent = originalText;
    button.disabled = false;
    button.style.opacity = "1";
  };
}

// Enhanced form validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    const value = field.value.trim();
    const errorElement = field.parentNode.querySelector(".error-message");

    // Remove existing error
    if (errorElement) {
      errorElement.remove();
    }

    // Validate field
    if (!value) {
      showFieldError(field, "This field is required");
      isValid = false;
    } else if (field.type === "email" && !isValidEmail(value)) {
      showFieldError(field, "Please enter a valid email address");
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(field, message) {
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.cssText = `
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
  field.parentNode.appendChild(errorElement);
  field.style.borderColor = "#f44336";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Clear field errors on input
document.addEventListener("input", (e) => {
  if (e.target.matches("input, textarea, select")) {
    const errorElement = e.target.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
      e.target.style.borderColor = "";
    }
  }
});

// Parallax effect for hero sections
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".hero-bg-animation");

  parallaxElements.forEach((element) => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Add smooth reveal animation for sections
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }
);

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    revealObserver.observe(section);
  });
});

// Add CSS for revealed sections
const revealStyle = document.createElement("style");
revealStyle.textContent = `
    section.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);

// Initialize floating animations
document.addEventListener("DOMContentLoaded", () => {
  const floatingCards = document.querySelectorAll(".floating-card");
  floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
  });
});

// Add hover effects for interactive elements
document.addEventListener("DOMContentLoaded", () => {
  const interactiveElements = document.querySelectorAll(
    ".btn, .service-card, .partner-card, .opportunity-card"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.transform = element.style.transform + " scale(1.02)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = element.style.transform.replace(
        " scale(1.02)",
        ""
      );
    });
  });
});

// Console welcome message
console.log(`
🚀 Welcome to TechSkillio!
🌟 Pioneering the future of education through innovation
💡 Built with modern web technologies
📧 Contact: info@techskillio.com
`);

console.log("TechSkillio website loaded successfully! 🎉");

// modal.js  (vanilla JS)

(function () {
  const modal      = document.getElementById('applyPopup');
  const closeBtn   = document.getElementById('applyModalClose');

  // open when any element with .open-apply is clicked
  document.addEventListener('click', e => {
    if (e.target.closest('.open-apply')) {
      e.preventDefault();
      modal.style.display = 'block';
    }
  });

  // close when X is clicked
  closeBtn.addEventListener('click', () => modal.style.display = 'none');

  // close when user clicks outside the form
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
})();

