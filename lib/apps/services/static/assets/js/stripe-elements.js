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

  const form = document.getElementById('payment-form');
  const errorElement = document.getElementById('card-errors');

  // Create an instance of the card Element.
  const card = elements.create('card', {
    hidePostalCode: true,
    style: style
  });

  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');

  card.addEventListener('change', function (event) {
    if (event.error) {
      errorElement.textContent = event.error.message;
    }
    else {
      errorElement.textContent = '';
    }
  });

  // Handle form submission.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    stripe.createPaymentMethod('card', card)
      .then(function(result) {
        if (result.error) {
          errorElement.textContent = result.error.message;
        }
        else {
          const fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: $('#email').val(),
              selectionToken: $('#selectionToken').val(),
              paymentMethodId: result.paymentMethod.id,
              _csrf: $('#csrfToken').val()
            })
          };

          fetch('/purchase', fetchOptions)
            .then(function(fetchResult) {
              return fetchResult.json();
            })
            .then(function(json) {
              handleServerResponse(json);
            });
        }
      });
  });

  function handleServerResponse(response) {
    if (response.status === 'error') {
      errorElement.textContent = response.message;
    }
    else if (response.data && response.data.requires_action) {
      handleAction(response);
    }
    else {
      redirectToUrl(`/confirmation?selectionToken=${response.data.tokens.selection}&transactionToken=${response.data.tokens.transaction}`);
    }
  }

  function handleAction(response) {
    const clientSecret = response.data.payment_intent_client_secret;
    stripe.handleCardAction(clientSecret).then(function(result) {
      if (result.error) {
        errorElement.textContent = result.error.message;
      }
      else {
        // The card action has been handled
        // The PaymentIntent can be confirmed again on the server
        const fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: $('#email').val(),
            paymentIntentId: result.paymentIntent.id,
            selectionToken: $('#selectionToken').val(),
            _csrf: $('#csrfToken').val()
          })
        };

        fetch('/purchase', fetchOptions)
          .then(function(handleActionFetchResult) {
            return handleActionFetchResult.json();
          })
          .then(function(json) {
            handleServerResponse(json);
          });
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
  };

  function redirectToUrl(url) {
    try {
      console.log(`redirecting to ${url}`);
      window.top.location.replace(url);
    }
    catch (e) {
      window.top.location = url;
    }
  };
})();
