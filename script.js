// Prevent redeclaration errors with hot reload
if (typeof window.slideIndex === 'undefined') {
  window.slideIndex = 0;
  showSlides();
}

function showSlides() {
  const slides = document.getElementsByClassName("slides");
  
  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  
  window.slideIndex++;
  if (window.slideIndex > slides.length) { 
    window.slideIndex = 1; 
  }
  
  // Show current slide
  if (slides.length > 0) {
    slides[window.slideIndex - 1].classList.add("active");
  }
  
  setTimeout(showSlides, 4000); // Change image every 4 seconds
}

// Fixed Mobile menu toggle - Matches your HTML structure
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.main-nav'); // Your nav is actually .main-nav
  
  console.log('Mobile menu button:', mobileMenuBtn); // Debug
  console.log('Mobile nav:', mobileNav); // Debug
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      mobileNav.classList.toggle('mobile-active'); // Different class to avoid conflicts
      mobileMenuBtn.classList.toggle('active');
      
      // Also toggle aria-expanded for accessibility
      const isExpanded = mobileNav.classList.contains('mobile-active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      
      console.log('Menu toggled:', isExpanded); // Debug
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    console.error('Mobile menu elements not found!');
  }
});

// Enhanced smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Remove any existing scroll listeners to prevent duplicates
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      console.log('Clicked link:', href); // Debug
      
      // Don't prevent default for external links or special cases
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      
      const targetId = href.substring(1); // Remove the #
      let target = document.getElementById(targetId);
      
      console.log('Looking for element with ID:', targetId); // Debug
      console.log('Found target:', target); // Debug
      
      // If direct ID lookup fails, try other methods
      if (!target) {
        // Try querySelector with the full href
        target = document.querySelector(href);
      }
      
      // Try finding by section with matching ID
      if (!target) {
        target = document.querySelector(`section[id="${targetId}"]`);
      }
      
      // Try finding by div with matching ID
      if (!target) {
        target = document.querySelector(`div[id="${targetId}"]`);
      }
      
      // Try case-insensitive search
      if (!target) {
        const allElements = document.querySelectorAll('[id]');
        for (let element of allElements) {
          if (element.id.toLowerCase() === targetId.toLowerCase()) {
            target = element;
            break;
          }
        }
      }
      
      if (target) {
        console.log('Scrolling to:', target); // Debug
        
        // Close mobile menu if it's open
        const mobileNav = document.querySelector('.main-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileNav && mobileMenuBtn) {
          mobileNav.classList.remove('mobile-active');
          mobileMenuBtn.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Alternative method if scrollIntoView doesn't work
        setTimeout(() => {
          const targetPosition = target.offsetTop - 80; // Account for fixed header
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, 100);
        
      } else {
        console.warn('Target element not found for:', href);
        console.log('Available IDs on page:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      }
    });
  });
});

// Enhanced active nav link highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id], div[id], main[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  
  let current = '';
  const scrollPosition = window.scrollY + 100; // Offset for better detection
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = sectionId;
    }
  });

  // If no current section found, check which section is closest to top
  if (!current && sections.length > 0) {
    let closestSection = sections[0];
    let closestDistance = Math.abs(sections[0].offsetTop - scrollPosition);
    
    sections.forEach(section => {
      const distance = Math.abs(section.offsetTop - scrollPosition);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });
    
    current = closestSection.getAttribute('id');
  }

  // Update active nav links
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === `#${current}`) {
      link.classList.add('active');
    }
  });
  
  console.log('Current section:', current); // Debug - remove this later
});

// Blog Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    let currentCategory = 'all';
    let currentSearch = '';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase().trim();
            filterPosts();
        });
    }

    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.getAttribute('data-category');
            
            // Filter posts
            filterPosts();
        });
    });

    function filterPosts() {
        blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
            const cardExcerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            const cardCategoryText = card.querySelector('.blog-category')?.textContent.toLowerCase() || '';
            
            // Check category match
            const categoryMatch = currentCategory === 'all' || cardCategory === currentCategory;
            
            // Check search match
            const searchMatch = currentSearch === '' || 
                               cardTitle.includes(currentSearch) || 
                               cardExcerpt.includes(currentSearch) ||
                               cardCategoryText.includes(currentSearch);
            
            // Show or hide card
            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Add CSS for smooth animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Updated mobile menu styles to match your structure */
    .main-nav {
        /* Your existing desktop styles here */
    }
    
    .main-nav.mobile-active {
        display: block !important;
        position: fixed;
        top: 60px; /* Adjust based on your header height */
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        padding: 20px;
    }
    
    .mobile-menu-btn {
        display: none;
        flex-direction: column;
        cursor: pointer;
        padding: 5px;
        background: none;
        border: none;
    }
    
    .mobile-menu-btn span,
    .mobile-menu-btn div {
        width: 25px;
        height: 3px;
        background: #333;
        margin: 3px 0;
        transition: 0.3s;
        display: block;
    }
    
    /* Hamburger animation */
    .mobile-menu-btn.active span:nth-child(1),
    .mobile-menu-btn.active div:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-btn.active span:nth-child(2),
    .mobile-menu-btn.active div:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3),
    .mobile-menu-btn.active div:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
        }
        
        .main-nav {
            display: none;
        }
        
        .main-nav.mobile-active {
            display: block !important;
        }
        
        /* Style the mobile menu items */
        .main-nav.mobile-active ul,
        .main-nav.mobile-active {
            flex-direction: column;
        }
        
        .main-nav.mobile-active li {
            margin: 10px 0;
        }
        
        .main-nav.mobile-active a {
            display: block;
            padding: 10px;
            text-decoration: none;
            color: #333;
            border-bottom: 1px solid #eee;
        }
    }
`;
document.head.appendChild(style);