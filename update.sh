#!/bin/bash
git pull 
git checkout main
npm i 
npm run build
cp -r dist/* /var/www/html/
echo "Built and copied frontend to web root"
echo "Starting the api"
cd server 
npm start