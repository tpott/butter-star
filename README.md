Butter\*
=======

An HTML5, 3D, multiplayer, networked video game production.

None of the static assets will be included with this repository,
due to git's way of handling blob files.

For our group's home page, check out [pisa](http://cse125.ucsd.edu/cse125/2013/cse125g3/)!

Realistically, we should make a butter\* user that has a *DustBusters* repository.



If you're looking for our group's todo work, checkout [TODO.md](https://github.com/tpott/butter-star/blob/master/TODO.md)

I really wanted to write the things in the parenthesis in bash regular expressions... [--Trevor]


Networking:
- [x] String messages (send/receive server+client)
- [x] Floats (send+receive server+client)
- [ ] Anything (send client, receive server)
- [ ] Game state; this includes scene graphs (send server, receive client)
- [ ] Complex data (send+receive server+client)
- [ ] Extra credit: Decentralized game server 
  	* [WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
		* This would have each game instance running in a browser
		* Game tracking would still run on our server

GUI (*Client*):
* [ ] Initial page load --> game begin flow 
* [ ] Dust bunny models (varying size)
* [ ] Player models
* [ ] Two environment maps (Outdoor and indoor)
* [ ] Food models
* [ ] Vacuum models
* [ ] Radar design

Game logic (*Server*):
* [ ] Scene graph
* [ ] Waves of dust bunnies
* [ ] Vacuum functionality
* [ ] Radar (a 2D projection of the scenes)
* [ ] Dust bunny AI; want to eat food
* [ ] Extra credit: Advanced dust bunny AI
* [ ] Extra credit: Advanced vacuum functionality

Renderer (*Client*):
* [ ] Basic shader
* [ ] Dust shader
* [ ] Wind shader

Physics (*Server*): 
* [ ] Motion
* [ ] Collision detection
* [ ] Gravity (jumping)
* [ ] Vacuum

Controls (*Client*):
* [ ] WASD
* [ ] Jump
* [ ] Vacuum in
* [ ] Vacuum out

Configurations:
* [ ] 
* [ ] 
* [ ] 

Tools:
* [ ] Debugger
* [ ] Profiler


