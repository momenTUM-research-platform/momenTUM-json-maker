# Run this file with bash run.bash >& log.txt to capture all outputs

# NGINX config based on: https://www.digitalocean.com/community/tools/nginx?domains.0.server.domain=tuspl22-momentum.srv.mwn.de&domains.0.server.redirectSubdomains=false&domains.0.php.php=false&domains.0.reverseProxy.reverseProxy=true&domains.0.reverseProxy.proxyPass=http%3A%2F%2F127.0.0.1%3A8000&domains.0.routing.root=false&global.docker.dockerfile=true&global.docker.dockerCompose=true
 
# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT


echo "#######" Starting server "#######" 
cd frontend
npm i -g pnpm 
pnpm i  
pnpm run build --outDir dist-preview --base /preview/ # Build the preview version

git checkout main # Bild the production version
pnpm i 
pnpm run build --outDir dist    

git checkout - # Switch back to the preview version
cd ../api 

export ROCKET_ADDRESS=127.0.0.1
export ROCKET_PORT=8000


cargo install --path . 
echo "##" Building API done "##"


api 

