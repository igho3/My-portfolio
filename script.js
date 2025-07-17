// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            links.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});

// Sticky navigation on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'white';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill, .project-card, .about-content, .contact-container');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
window.addEventListener('load', () => {
    document.querySelectorAll('.skill, .project-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
    });
    
    document.querySelector('.about-content').style.opacity = '0';
    document.querySelector('.about-content').style.transform = 'translateY(20px)';
    document.querySelector('.about-content').style.transition = 'all 0.5s ease 0.2s';
    
    document.querySelector('.contact-container').style.opacity = '0';
    document.querySelector('.contact-container').style.transform = 'translateY(20px)';
    document.querySelector('.contact-container').style.transition = 'all 0.5s ease 0.4s';
});

window.addEventListener('scroll', animateOnScroll);

  // Modal Functions
function openForm() {
    const modal = document.getElementById("hireFormPopup");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      
      // Add overlay
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.onclick = closeForm;
      document.body.appendChild(overlay);
    }
  }
  
  function closeForm() {
    const modal = document.getElementById("hireFormPopup");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
      
      // Remove overlay
      const overlay = document.querySelector('.modal-overlay');
      if (overlay) overlay.remove();
    }
  }
  
  // Escape key listener
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeForm();
  });
  
  // Form Submission Handler (for both modal and contact form)
  function setupFormSubmission(formSelector, isModal = false) {
    const form = document.querySelector(formSelector);
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
  
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
  
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
  
        if (response.ok) {
          // Show success message
          if (isModal) {
            showModalSuccess();
          } else {
            showInlineSuccess(form);
          }
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        if (isModal) {
          showModalError();
        } else {
          showInlineError(form);
        }
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Message Functions
  function showModalSuccess() {
    const modalContent = document.querySelector('#hireFormPopup .modal-content');
    modalContent.innerHTML = `
      <div class="form-success">
        <i class="fas fa-check-circle"></i>
        <h3>Message Sent Successfully!</h3>
        <p>I'll get back to you soon.</p>
        <button onclick="closeForm()" class="btn">Close</button>
      </div>
    `;
  }
  
  function showModalError() {
    const modalContent = document.querySelector('#hireFormPopup .modal-content');
    modalContent.innerHTML = `
      <div class="form-error">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error Sending Message</h3>
        <p>Please try again or email me directly.</p>
        <button onclick="location.reload()" class="btn">Try Again</button>
      </div>
    `;
  }
  
  function showInlineSuccess(form) {
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <p>Message sent! I'll get back to you soon.</p>
    `;
    form.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 5000);
  }
  
  function showInlineError(form) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-error';
    errorMsg.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>Oops! Something went wrong. Please try again.</p>
    `;
    form.appendChild(errorMsg);
  }
  
  // Initialize all forms
  document.addEventListener('DOMContentLoaded', function() {
    // Modal form
    setupFormSubmission('#hireFormPopup form', true);
    
    // Regular contact form
    setupFormSubmission('.contact-form');
  });