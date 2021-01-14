
#! /bin/bash

cd codes/js/instagram-clone

# open vs code here
code .

# start client
gnome-terminal --tab -- sh -c  "cd client && yarn start"

# start server
gnome-terminal --tab -- sh -c "cd server  && nodemon"
