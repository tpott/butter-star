# DUST BUSTERS
## A Butter\* Production

An HTML5, 3D, multiplayer, networked video game, written entirely in
JavaScript.

Production release: http://pisa.ucsd.edu:8080/

This was our project for UCSD's CSE 125 class. Our group's 
[page](http://cse125.ucsd.edu/cse125/2013/cse125g3/) is hosted on campus,
and serves as a journal to our ten weeks spent working on our project.
The class's [page](http://cse125.ucsd.edu/cse125/2013/) has links to the 
other teams from our quarter. We were apart of Professor 
[Voelker](http://cseweb.ucsd.edu/~voelker/)'s (lucky) thirteenth class.
You can also checkout other [years](http://cse125.ucsd.edu/cse125/)' projects.

# Installing

For the server, you will need to install nodejs and a couple packages.
We tested it on several different versions of nodejs, from v0.6.12 to 
v0.10.9. After installing nodejs you will need to install the 
[ws](http://einaros.github.io/ws/) and 
[three](https://npmjs.org/package/three).

# Running

After completing the above install instructions, you will should create
your own server config. Copy server/defaultPConfig.json and save it as
server/personalConfig.json. Then you need to modify your personalConfig.json
file so that the IP address is the IP or domain name that you want to run
the server at. Next, change the httpPort to 80 so browsers can use their
defaults. Then run server/main.js inside the server/ directory!

The gameplay instructions will be hosted on the server that you now have
running, so you can find them there.

# Contributing

If you are interested in contributing to the game, we ask that you fork
this repository and make a pull request. Be warned though, we may not 
respond in a timely manner!
