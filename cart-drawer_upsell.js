// Form Upsell Cart Method
window.addEventListener("load", (event) => {
    const upsellContainer = document.querySelector("#CartDrawer");
  
    if (upsellContainer) {
      upsellContainer.addEventListener("click", function (event) {
        if (event.target && event.target.matches(".upsell_atc-btn")) {
          event.preventDefault();
  
          const productContainer = event.target.closest(".cart_upsell-item");
  
          if (productContainer) {
            const checkedRadio = productContainer.querySelector(
              'input[type="radio"]:checked'
            );
  
            if (checkedRadio) {
              const productId = productContainer.getAttribute("data-product-id");
              const variantId = checkedRadio.getAttribute("data-variant");
  
              // console.log(
              //   `Product added: productId=${productId}, variantId=${variantId}`
              // );
  
              const lineItems = [
                {
                  id: variantId,
                  quantity: 1,
                },
              ];
  
              // console.log("Line items for cart: ", lineItems);
  
              // Send the data to the cart via AJAX
              fetch("/cart/add.js", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ items: lineItems }),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Optionally redirect to the cart or update the cart UI
                  // console.log("Cart updated: ", data);
  
                  // Fetch the updated cart content
                  return fetch("/cart/?view=ajax");
                })
  
                .then((response) => response.text())
                .then((html) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = html;
  
                  // Extract the .cart__items element
                  const customFreeShippingBar = tempDiv.querySelector(
                    ".custom-free-shipping-bar"
                  );
                  const cartItems = tempDiv.querySelector(".cart__items");
                  const discounts = tempDiv.querySelector(".cart__discounts");
                  const cartUpsells = tempDiv.querySelector(
                    ".cart-drawer_upsell"
                  );
  
                  //document.querySelector(".free-shipping-bar").innerHTML = "";
  
                  const cartTotal = cartItems.dataset.cartSubtotal;
  
                  if (cartItems) {
                    const dataProducts =
                      document.querySelector("[data-products]");
                    if (dataProducts) {
                      dataProducts.innerHTML = "";
                      dataProducts.appendChild(customFreeShippingBar);
                      document
                        .querySelector(".free-shipping-bar")
                        .querySelector(".custom-free-shipping-bar")
                        .remove();
                      document
                        .querySelector(".free-shipping-bar")
                        .appendChild(customFreeShippingBar);
                      dataProducts.appendChild(cartItems);
  
                      document.querySelector("[data-discounts]").innerHTML = "";
                      document
                        .querySelector("[data-discounts]")
                        .append(discounts);
  
                      dataProducts.appendChild(cartUpsells);
  
                      var swiper = new Swiper(".cart_upsell-slider", {
                        slidesPerView: 1,
                        spaceBetween: 30,
                        loop: false,
                        navigation: {
                          nextEl: ".swiper-button-next",
                          prevEl: ".swiper-button-prev",
                        },
                      });
  
                      const CartDrawerForm =
                        document.querySelector("#CartDrawerForm");
                      new theme.CartForm(CartDrawerForm);
  
                      document.querySelector("[data-subtotal]").innerHTML =
                        theme.Currency.formatMoney(
                          cartTotal,
                          theme.settings.moneyFormat
                        );
  
                      if (window.AOS) {
                        AOS.refreshHard();
                      }
  
                      console.log("Cart items appended to [data-products]");
                    } else {
                      console.log("[data-products] element not found");
                    }
                  } else {
                    console.log(".cart__items element not found in the response");
                  }
                })
                .catch((error) => {
                  // Handle errors
                  console.error(error);
                });
            } else {
              console.log("No radio button selected for this product");
            }
          } else {
            console.log("Product container not found");
          }
        }
      });
    }
  });
  