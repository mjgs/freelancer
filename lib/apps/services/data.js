const services = [
  {
    name: 'consultancy',
    packages: {
      basic: {
        description: 'A short description of the basic service offering',
        amount: 10
      },
      standard: {
        description: 'A short description of the standard service offering',
        amount: 20,
      },
      premium: {
        description: 'A short description of the premium service offering',
        amount: 30
      }
    }
  },
  {
    name: 'translation',
    packages: {
      basic: {
        description: 'A short description of the basic service offering',
        amount: 10
      },
      standard: {
        description: 'A short description of the standard service offering',
        amount: 20,
      },
      premium: {
        description: 'A short description of the premium service offering',
        amount: 30
      }
    }
  },
  {
    name: 'graphic design',
    packages: {
      basic: {
        description: 'A short description of the basic service offering',
        amount: 10
      },
      standard: {
        description: 'A short description of the standard service offering',
        amount: 20,
      },
      premium: {
        description: 'A short description of the premium service offering',
        amount: 30
      }
    }
  }
];

const profile = {
  name: 'yourname',
  venture: 'name of venture',
  email: {
    sender: 'mark@subtle.software',
    receiver: 'mark@subtle.software'
  },
  social: {
    blog: 'https://blog.domain.com',
    linkblog: 'https://linkblog.io/users/username',
    twitter: 'https://twitter.com/username',
    github: 'https://github.com/username',
    linkedIn: 'https://linkedin.com/in/username',
    instagram: 'https://instagram.com/username',
  }
};

module.exports = {
  pricing: {
    services: services
  },
  profile: profile
}
