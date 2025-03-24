// Initialize fullpage.js for Shopify - only on homepage
document.addEventListener('DOMContentLoaded', function () {
  // Check if we're on the homepage
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/collections/frontpage';

  // Only initialize fullpage on the homepage
  if (!isHomepage) {
    return;
  }

  // Make sure fullpage.js is loaded and available
  if (typeof fullpage === 'undefined') {
    console.error('Fullpage.js is not loaded. Please check your script references.');
    return;
  }

  // Select the container where sections should be placed
  const mainContent = document.querySelector('#MainContent');

  // Check if main content exists
  if (!mainContent) {
    console.error('Main content container not found.');
    return;
  }

  // Get all sections from the index page
  const indexSections = mainContent.querySelectorAll('.shopify-section');

  // Also get the footer to include as a final section
  const footerSection = document.querySelector('footer.footer');

  if (indexSections.length === 0) {
    console.error('No sections found to convert to fullpage slides.');
    return;
  }

  // Create a wrapper for fullpage.js
  const fullpageWrapper = document.createElement('div');
  fullpageWrapper.id = 'fullpage';

  // Move each section into the fullpage wrapper and add the section class
  indexSections.forEach((section) => {
    // Make a copy of the section to avoid detaching it from the DOM
    const sectionClone = section.cloneNode(true);
    sectionClone.classList.add('section');
    fullpageWrapper.appendChild(sectionClone);
  });

  // Add footer as the last section if it exists (full screen height on homepage)
  if (footerSection) {
    const footerWrapper = document.createElement('div');
    footerWrapper.classList.add('section', 'footer-section');
    footerWrapper.setAttribute('data-fp-styles', 'display: flex; align-items: center;');

    // Create a copy of the footer
    const footerClone = footerSection.cloneNode(true);

    // Add a container for proper spacing and centering
    const footerContainer = document.createElement('div');
    footerContainer.classList.add('footer-container');
    footerContainer.appendChild(footerClone);
    footerWrapper.appendChild(footerContainer);

    // Add to fullpage wrapper
    fullpageWrapper.appendChild(footerWrapper);
  }

  // Replace main content with fullpage wrapper, preserving the original sections
  const mainContentOriginal = mainContent.innerHTML;
  mainContent.innerHTML = '';
  mainContent.appendChild(fullpageWrapper);

  // Initialize fullPage.js
  new fullpage('#fullpage', {
    licenseKey: '', // Add your license key if you have one
    autoScrolling: true,
    scrollHorizontally: false,
    navigation: true,
    navigationPosition: 'right',
    css3: true,
    scrollingSpeed: 500,
    fitToSection: true,
    // Remove responsiveWidth to enable on mobile
    // responsiveWidth: 768,
    easing: 'easeInOutCubic', // Smoother easing function
    easingcss3: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)', // Smooth CSS3 easing
    fixedElements: null, // Don't exclude any elements (include footer)
    normalScrollElements: null, // Don't exclude any elements
    afterLoad: function (origin, destination, direction) {
      // Add any custom logic here
    },
    // Fix for editor mode
    recordHistory: !window.Shopify || !window.Shopify.designMode,
    // Add touch sensitivity options for better mobile experience
    touchSensitivity: 15,
    continuousVertical: false,
    scrollOverflow: true
  });

  // Handle Shopify theme editor
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function () {
      // Re-initialize fullpage when sections are added/modified
      if (typeof fullpage_api !== 'undefined') {
        fullpage_api.destroy('all');
      }

      setTimeout(function () {
        // Get updated sections
        const updatedSections = mainContent.querySelectorAll('.shopify-section');

        // Rebuild fullpage wrapper
        const newFullpageWrapper = document.createElement('div');
        newFullpageWrapper.id = 'fullpage';

        updatedSections.forEach((section) => {
          const sectionClone = section.cloneNode(true);
          sectionClone.classList.add('section');
          newFullpageWrapper.appendChild(sectionClone);
        });

        // Update main content
        mainContent.innerHTML = '';
        mainContent.appendChild(newFullpageWrapper);

        // Reinitialize fullpage
        new fullpage('#fullpage', {
          licenseKey: '',
          autoScrolling: true,
          scrollHorizontally: false,
          navigation: true,
          navigationPosition: 'right',
          css3: true,
          scrollingSpeed: 700,
          fitToSection: true,
          easing: 'easeInOutCubic',
          easingcss3: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
          fixedElements: null,
          normalScrollElements: null,
          // Removed responsiveWidth setting
          touchSensitivity: 15,
          continuousVertical: false,
          scrollOverflow: true,
          recordHistory: false,
        });
      }, 500);
    });
  }
});
