## Freelancer

A simple website for freelancers providing a homepage for contact information and a set of payments pages to securely receive payments for freelance services

Payments are handled by Stripe and email notification is via Mailgun.

### Description

The homepage is a static landing page to display contact information.

Payments can be made via a two step process:

1. Client selects the service and package
2. Client makes a secure payment using the Stipe checkout button

The payment is received by Stripe, then an email is sent to both the client and the freelancer with details of the purchase.

Should an error occur, an error notification alert email is sent to the freelancer.

### Setup

1. Clone the freelancer repo

    Fork the repo https://github.com/mjgs/freelancer

2. Create .env config files

    ```
    cp .env.sample .env.dev
    cp .env.sample .env.prod
    ```
3. Create the data files

    ```
    # Update both created files with your data 
    cp ./lib/data/pricing.js.sample ./lib/data/pricing.js
    cp ./lib/data/profile.js.sample ./lib/data/profile.js
     ```

4. Create the static homepage

    ```
    cp ./lib/static/homepage/index.html.sample ./lib/static/homepage/index.html
    ```

5. Start the web server locally

    ```
    npm start
    ```
    Your freelance website is now running locally!


    Browse to the homepage: http://localhost:3000
    Browse to service selection page: http://localhost:3000/payments/selection

    You will be able to browse the pages, but you won't be able to run through the payment flow completely yet because Stripe, Mailgun and Google Analytics are disabled.

    Try to make a payment using the Stripe test card number 4242 4242 4242 4242, a date in the future, and CVC 424. You will see a popup message from stripe saying you haven't set the publishable key.

6. Replace the placeholder data with your data

    - Update ./lib/data/pricing.js with your pricing data
    - Update ./lib/data/profile.js with your profile data
    - Update ./lib/static/homepage/index.html
        - Update the page title with your name
        - Update the Header section with your name, byline and contact links
        - Update the Footer section with your domain name and venture name
        - Add analytics code snippets in head and body section (e.g. google analytics / tag manager etc)

    About the pricing data - add/remove services as needed, use the same format as already in the sample file. Each service should have 3 packages (basic, standard, premium). You can name the services whatever you like. Use single quotes around service names that have spaces.

7. Setup 3rd party site accounts

    - Purchase a domain name from a domain registrar
    - Setup a Stripe account and update in the .env files:
        - STRIPE_PUBLISHABLE_KEY
        - STRIPE_SECRET_KEY
    - Setup a Mailgun account. Follow the Mailgun setup instructions for [adding a domain](https://documentation.mailgun.com/en/latest/user_manual.html#verifying-your-domain) to your account. Then set in the .env files:
        - MAILGUN_API_KEY
        - MAILGUN_DOMAIN
    - Note: Live keys go in .env.prod, test keys go in .env.dev
    - Setup a Google Tag Manager account. It's a good idea to setup two containers one for .env.dev and one for .env.prod. Set with your container ids:
        - GOOGLE_TM_ID
    - Enable Stripe, Mailgun and Google Analytics in the .env files by setting
        - STRIPE_ENABLED=1
        - MAILGUN_ENABLED=1
        - GOOGLE_TM_ENABLED=1

8. Replace the payments page images

    - Update the two img tags in ./lib/views/payments/purchase.ejs with images that more suits your line of freelancing

9. Commit your modifications to your repo

    ```
    git add * 
    git commit -m "Initial configuration"
    ```

10. Restart the site locally

    ```
    # First quit the process from step 5 (type ctr-c) and then
    npm start
    ```
    The site should now be running with all your configured data.

    Browse to http://localhost:3000

11. Deploy the site to your deployment environment

    - For Heroku and similar services use the deployment cmd line tools they provide, set environment variables using their web UI and ensure .env.prod is an empty file (or just comments)

    - For a regular VPC server, ensure node and pm2 are installed then rsync the files to $HOME/freelancer, and run
    ```
    . ./.env.prod; pm2 start $HOME/freelancer/bin/www
    ```

## TODO

Remove the weird border the Stripe payment button has
Center the payment page left section image for smaller screen sizes

## Credits

Templates from [HTML5UP](http://html5up.net)
Photography from [Unplash](https://unsplash.com/)
