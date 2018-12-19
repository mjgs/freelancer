## Freelancer

Website for freelancers that runs sites. Each site can be static and/or dynamic, you can easily associate domain names to each site and adding a site is as simple as creating an express app and adding it to the apps folder.

Two starter apps:

1. Homepage - static site to link to your other online sites, social media etc
2. Services - static+dynamic site to securely receive payments for services

Payments are handled by Stripe and email notifications are via Mailgun.

### Description

**Homepage** 

The homepage is a static landing page to display contact information.

**Services**

Payments can be made via a two step process:

1. Client selects the service and package
2. Client makes a secure payment using the Stripe checkout button

The payment is received by Stripe, then an email is sent to both the client and the freelancer with details of the purchase.

Should an error occur, an error notification alert email is sent to the freelancer.

### Setup

1. Fork the freelancer repo https://github.com/mjgs/freelancer

    ```
    npm install
    ```

2. Create the config files, data files and static homepage file

    ```
    npm run setup
    ```

3. Add development domain resolution 

    Add to your /etc/hosts file:

    ```
    127.0.0.1 domain.com
    127.0.0.1 domain-services.com
    ```

4. Build the project public directory

    ```
    npm run build
    ``` 
    
    This will create the public directory in the root of your project
    
5. Start the web server locally

    ```
    npm start
    ```
    Your freelance website is now running locally!

    Browse to the homepage site: http://domain.com:3000
    
    Browse to services site: http://domain-services.com:3000

    You will be able to browse the pages, but you won't be able to run through the payment flow completely yet because Stripe, Mailgun and Google Analytics are disabled.

    Try to make a payment using the Stripe test card number 4242 4242 4242 4242, a date in the future, and CVC 424. You will see a popup message from Stripe saying you haven't set the publishable key.

6. Replace the placeholder data with your data

    - Update lib/server/data.js with your domain names
    - Update lib/apps/services/data.js with your profile and pricing data
    - Update lib/apps/homepage/public/index.html
      - Update \<title>, \<header> and \<footer> content to suit your needs
      - Add analytics code snippets in head and body section
    - Update lib/apps/services/public/index.html
      - Update the \<title> and \<header> content to suit your needs
      - Add analytics code snippets in head and body section

    About the domains data - When you deploy to a live server, you will need to configure your domain names to point to your live server in your domain registrar DNS configuration.

    About the pricing data - add/remove services as needed, use the same format as already in the sample file. Each service should have 3 packages (basic, standard, premium). You can name the services whatever you like.
    
    The main landing pages are implemented as static pages for performance, generation could be automated in a build step.

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

    - Update the two img tags in ./lib/apps/services/views/pages/purchase.ejs with images that more suits your line of freelancing

9. Commit your modifications to your forked repo production branch

    ```
    git branch production
    git checkout production
    git add * 
    git commit -m "Customized freelancer project"
    git push
    ```

10. Restart the site locally

    ```
    # First quit the process from step 5 (type ctr-c) and then
    npm start
    ```
    The site should now be running with all your configured data.

    Browse to the homepage: http://domain.com:3000
    
    Browse to service selection page: http://domain-services.com:3000/payments/selection

11. Deploy the site to your deployment environment

    - For Heroku and similar services use the deployment cmd line tools they provide, set environment variables using their web UI and ensure .env.prod is an empty file (or just comments)
    - For a regular VPC server, ensure node and pm2 are installed then rsync the files to $HOME/freelancer, and run
    ```
    . ./.env.prod; pm2 start $HOME/freelancer/bin/www
    ```
    - You should ensure that SSL is configured for your domain. Hosting providers often offer this as an option. For self hosting [letsencrypt](https://letsencrypt.org/) can generate SSL certificates for a website at no cost, and adding them to a reverse proxy like [nginx](https://www.nginx.com/resources/wiki/) which would sit on front of the freelance app and handle SSL decryption.

## TODO

- Remove the weird border the Stripe payment button has
- Integrate letsencrypt certificates directly into the app
- Automate static file data replacement in a build step (step 6) 

## Credits

Templates from [HTML5UP](http://html5up.net)

Photography from [Unplash](https://unsplash.com/)
