#! /bin/bash
# open vs code here
code .
nautilus .

# start client in a new tab
gnome-terminal --tab -- sh -c  "cd client && yarn start"

# start server in a new tab
gnome-terminal --tab -- sh -c "cd server  && nodemon"
