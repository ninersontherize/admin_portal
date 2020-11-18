# sudo apt install git -y

# curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
# echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
# sudo apt update && sudo apt install yarn
rm -rf node_modules
rm -rf client
git clone git@gitlab.com:lucidsystems/client-projects/casual-precision/casual-spend-planner-react.git ./client/
# mv casual-spend-planner-react/* . && rm -rf casual-spend-planner-react
# cd client
# yarn install
# cd ..
# npm install


# REACT ON port 3000
# node on 5000
