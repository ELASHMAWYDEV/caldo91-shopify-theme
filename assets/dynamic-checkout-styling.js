document.addEventListener('DOMContentLoaded', function () {
  // Find all dynamic checkout wrappers
  const dynamicCheckoutWrappers = document.querySelectorAll('.dynamic-checkout-wrapper');

  dynamicCheckoutWrappers.forEach((wrapper) => {
    const buttonStyle = wrapper.getAttribute('data-button-style');

    // Wait for the dynamic checkout button to be rendered by Shopify
    const observer = new MutationObserver((mutations, obs) => {
      const dynamicCheckoutButton = wrapper.querySelector('.shopify-payment-button__button');

      if (dynamicCheckoutButton) {
        // Apply the selected style
        if (buttonStyle === 'primary') {
          dynamicCheckoutButton.classList.add('button--primary');
          dynamicCheckoutButton.classList.remove('button--secondary', 'button--tertiary');
        } else if (buttonStyle === 'secondary') {
          dynamicCheckoutButton.classList.add('button--secondary');
          dynamicCheckoutButton.classList.remove('button--primary', 'button--tertiary');
        } else if (buttonStyle === 'tertiary') {
          dynamicCheckoutButton.classList.add('button--tertiary');
          dynamicCheckoutButton.classList.remove('button--primary', 'button--secondary');
        }

        // Disconnect once we've found and styled the button
        obs.disconnect();
      }
    });

    observer.observe(wrapper, {
      childList: true,
      subtree: true,
    });
  });
});
