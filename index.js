var elements;
const stripe = Stripe(
  "pk_test_51PEeeGGHmK2siVPgZohmw4N1M8m9FAkEHCpL4u9gvw0Jq8qqUZIxFkL1IWXdtzJSkjVFvNUeVI9XK8Y5n9ehUc4M00mSCB06Gd"
);

initialize();

function initialize() {
  const stripe = Stripe(
    "pk_test_51PEeeGGHmK2siVPgZohmw4N1M8m9FAkEHCpL4u9gvw0Jq8qqUZIxFkL1IWXdtzJSkjVFvNUeVI9XK8Y5n9ehUc4M00mSCB06Gd"
  );

  const fetchClientSecret = async () => {
    const response = await fetch(
      "https://localhost:5001/api/v1/stripe-payments/create-setup-intent?customerId=cus_QMKyXJ4deXRCIk",
      {
        method: "POST",
      }
    );

    const resp = await response.json();
    const clientSecret = resp.data;
    return clientSecret;
  };

  fetchClientSecret().then((secret) => {
    // const options = {
    //   clientSecret: secret,
    // };

    // Set up Stripe.js and Elements using the SetupIntent's client secret
    //elements = stripe.elements(options);

    elements = stripe.elements({
      clientSecret: secret,
    });

    // Create and mount the Payment Element
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = document.getElementById("payment-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { error } = await stripe.confirmSetup({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://example.com/account/payments/setup-complete",
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    });
  });
}
