class FloatingSelection extends HTMLElement {
  constructor() {
    super();
    this.floatingContainer = null;
    this.floatingImage = null;
    this.floatingColorSpan = null;
    this.floatingSizeSpan = null;
    this.sectionId = this.dataset.section;
    this.productId = this.dataset.productId;
    this.currentVariant = null;
    this.colorOptionIndex = -1;
    this.sizeOptionIndex = -1;
    this.threshold = 300; // Scroll threshold in pixels to show the floating container

    this.init();
  }

  init() {
    this.initElements();
    this.initOptionIndices();
    this.attachEventListeners();
  }

  initElements() {
    // Find the floating container and its elements
    this.floatingContainer = document.getElementById(`FloatingSelection-${this.sectionId}`);
    if (!this.floatingContainer) return;

    this.floatingImage = document.getElementById(`FloatingSelectionImage-${this.sectionId}`);
    this.floatingColorSpan = document.getElementById(`FloatingSelectionColor-${this.sectionId}`);
    this.floatingSizeSpan = document.getElementById(`FloatingSelectionSize-${this.sectionId}`);

    // Find the variant selectors
    const variantRadios = document.querySelectorAll(`input[type="radio"][name="Color"]`);
    const variantSelect = document.querySelector(`select[data-for-product="${this.productId}"]`);

    // Get size selectors, could be radios or select
    const sizeRadios = document.querySelectorAll(`input[type="radio"][name="Size"]`);
    const sizeSelect = document.querySelector(`select[data-variant-option-name="Size"]`);
  }

  initOptionIndices() {
    // Find the indices for color and size options
    const variantOptions = document.querySelectorAll('.product-form__input');

    variantOptions.forEach((option, index) => {
      const label = option.querySelector('.form__label');
      if (label) {
        if (label.textContent.trim().toLowerCase().includes('color')) {
          this.colorOptionIndex = index;
        } else if (label.textContent.trim().toLowerCase().includes('size')) {
          this.sizeOptionIndex = index;
        }
      }
    });
  }

  attachEventListeners() {
    if (!this.floatingContainer) return;

    // Scroll event to show/hide floating container
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Listen for variant changes
    document.addEventListener('variant:change', this.handleVariantChange.bind(this));
  }

  handleScroll() {
    if (window.scrollY > this.threshold) {
      this.floatingContainer.classList.add('is-visible');
    } else {
      this.floatingContainer.classList.remove('is-visible');
    }
  }

  handleVariantChange(event) {
    const variant = event.detail.variant;
    if (!variant) return;

    this.currentVariant = variant;
    this.updateFloatingSelection(variant);
  }

  updateFloatingSelection(variant) {
    if (!this.floatingContainer) return;

    // Update image if variant has an image
    if (variant.featured_image) {
      this.floatingImage.src = variant.featured_image.src.replace(/(\.[^.]*)$/, '_100x100$1');
      this.floatingImage.alt = variant.featured_image.alt || variant.title;
    }

    // Update variant info
    if (this.colorOptionIndex !== -1 && variant.options[this.colorOptionIndex]) {
      const colorValue = variant.options[this.colorOptionIndex];
      this.floatingColorSpan.textContent = `Color: ${colorValue}`;

      // Try to set the color dot to match the selected color
      this.floatingColorSpan.style.setProperty('--color-variant', this.getColorCode(colorValue) || '#ccc');
    } else {
      this.floatingColorSpan.textContent = '';
    }

    if (this.sizeOptionIndex !== -1 && variant.options[this.sizeOptionIndex]) {
      this.floatingSizeSpan.textContent = `Size: ${variant.options[this.sizeOptionIndex]}`;
    } else {
      this.floatingSizeSpan.textContent = '';
    }
  }

  getColorCode(colorName) {
    // Basic color mapping - can be expanded for your specific color names
    const colorMap = {
      black: '#000000',
      white: '#ffffff',
      red: '#ff0000',
      blue: '#0000ff',
      green: '#008000',
      yellow: '#ffff00',
      purple: '#800080',
      pink: '#ffc0cb',
      gray: '#808080',
      grey: '#808080',
      navy: '#000080',
      beige: '#f5f5dc',
      brown: '#a52a2a',
    };

    return colorMap[colorName.toLowerCase()];
  }
}

customElements.define('product-info', FloatingSelection);
