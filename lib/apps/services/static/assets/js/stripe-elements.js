(function() {
  // Create a Stripe client.
  const stripePublishableKey = getCookie('stripePublishableKey');
  const stripe = Stripe(stripePublishableKey); // eslint-disable-line new-cap

  // Create an instance of Elements.
  const elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  // (Note that this demo uses a wider set of styles than the guide below.)
  const style = {
    base: {
      color: '#32325d',
      lineHeight: '18px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  // Create an instance of the card Element.
  const card = elements.create('card', {
    hidePostalCode: true,
    style: style
  });

  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');

  stripe.createPaymentMethod(
    'card',
    card
  ).then(function(result) {
    if (result.error) {
      // Show error in payment form
      console.log(`ERROR: ${result.error}`);
    }
    else {
      // Send paymentMethod.id to server
      fetch('/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_method_id: result.paymentMethod.id
        })
      }).then(function(result) {
        // Handle server response (see Step 3)
        result.json().then(function(json) {
          handleServerResponse(json);
        })
      });
    }
  });

  function handleServerResponse(response) {
    if (response.error) {
      // Show error from server on payment form
      console.log(`ERROR: ${result.error}`);
    }
    else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      handleAction(response);
    }
    else {
      // Show success message
      console.log('SUCCESS');
    }
  }

  function handleAction(response) {
    stripe.handleCardAction(
      response.payment_intent_client_secret
    ).then(function(result) {
      if (result.error) {
        // Show error in payment form
        console.log(`ERROR: ${result.error}`);
      }
      else {
        // The card action has been handled
        // The PaymentIntent can be confirmed again on the server
        fetch('/ajax/confirm_payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payment_intent_id: result.paymentIntent.id
          })
        }).then(function(confirmResult) {
          return confirmResult.json();
        }).then(handleServerResponse);
      }
    });
  }

  // https://www.w3schools.com/js/js_cookies.asp
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
})();
