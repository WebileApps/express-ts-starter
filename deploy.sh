#!/bin/bash
echo "Remove dist folder"
rm -rf dist
echo "Removed dist build directory successfully"

echo "Started typescript compiling"
./node_modules/.bin/tsc -p tsconfig.json --outDir dist --sourceMap false
cp package.json dist

mkdir -p dist/public/uploads
cp -r public/css dist/public
cp -r public/images dist/public

echo "Started webpack compilation"
npm run build
cp -r public/js dist/public
cp -r public/*.html dist/public
echo "build directory populated with compilation files"

zip -r karvy-chat.zip dist
echo "Created a zip of the build directory"

ls -la karvy-chat.zip

scp karvy-chat.zip webile1:~/karvy-chat.zip
ssh webile1 'pm2 stop karvy-chat; mv ~/karvy-chat/public/uploads ~; rm -rf ~/karvy-chat; unzip ~/karvy-chat; mv ~/dist ~/karvy-chat'
ssh webile1 'cd ~/karvy-chat; npm i --only=prod; pm2 start karvy-chat; mv ~/uploads ~/karvy-chat/public'

