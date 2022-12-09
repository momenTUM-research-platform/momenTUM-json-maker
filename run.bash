# Run this file with bash run.bash >& log.txt to capture all outputs
 
# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

echo "#######" Starting server "#######" 
git pull
cd frontend
npm i -g pnpm 
pnpm i  
pnpm run build

echo "##" Building frontend done "##"

cd ../api

export ROCKET_ADDRESS=0.0.0.0
export ROCKET_PORT=80


cargo install --path . 
api 

echo "##" Building API done "##"
