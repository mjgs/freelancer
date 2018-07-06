#!/usr/bin/env bash

echo "creating file: .env.dev"
cp .env.sample .env.dev

echo "creating file: .env.prod"
cp .env.sample .env.prod

echo "creating file: ./lib/data/pricing.js"
cp ./lib/data/pricing.js.sample ./lib/data/pricing.js

echo "creating file: ./lib/data/profile.js"
cp ./lib/data/profile.js.sample ./lib/data/profile.js

echo "creating file: ./lib/static/homepage/index.html"
cp ./lib/static/homepage/index.html.sample ./lib/static/homepage/index.html

echo "Follow the README setup instructions to get the website running"

exit 0