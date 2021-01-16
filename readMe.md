
## WELCOME TO BATTLESHIP

Player vs Computer.

Both will start with the exact same amount of ships:

 1) Destroyer : 2 tiles
 2) Cruiser : 3 tiles
 3) Submarine : 3 tiles
 4) Battleship : 4 tiles
 5) Aircraft Carrier: 5 tiles


Each player will start to place their ships into their own respective grids. Player has a choice to either place their ship horizontally or vertically.

The computer's ships placement and orientation are randomly generated the moment you start the game.

Once you're done placing your ships, click on the start button to start the game!


## GAME OBJECTIVE

The objective of the game is to sink all five (5) of your opponent's ship! If you sink them all before they sink yours, you will win the game.


## GAME LINK

https://radicrains.github.io/BattleShip/main.html


## HOW TO PLAY

Player will be able to sink computer's ships by clicking on the squares in the computer's grid. 

If the square turn blue -- It means that you've missed the ship, and your missiles hit the waters.
If the square turns red -- It means that you've hit 1 tile of the ship.

Your job is to figure out where and how did your opponent place their ship (horizontally / vertically) in their grids so that you can sink all five (5) of them. 

GOOD LUCK!


## GAME FEATURES

 - API: imgur - The background image of the game.
 - Drag & drop of the user ship
 - rotate user ships
 - Simple CSS animations to simulate water (when missed) & explosion (when hit)
 - When ship is hit, explosion audio will be heard. 


## CHALLENGES

FOR COMPUTER SHIP GENERATION:
- Identifying ship orientation
- Ensuring the random starting point caters for the ship length to prevent the ship to overspill the grid. 
- Ensuring that the ships are not over lapping each other.

These 3 conditions were tricky as have to be creative in figuring out how to manipulate the DOM.


FOR USER SHIP DRAG & DROP:
- Identifying the ship index to know which square user selected from
- Identifying the grid-id when user drop the selected square.

These 2 critical events information needed to calculate the squares needed to "generate" the ships by adding class.


## THINGS I LEARN

- JS: substr()
- CSS: viewport height, viewport width (along with vmax and vmin)
- CSS: calc()


# KNOWN ISSUES

- User can still click on computer's grid despite game win.


# POSSIBLE FUTURE IMPROVEMENTS

- Adding background music
- Adding in Player name
- Refactoring the codes to allow bigger grids and more ships
- Add in UL & LI on the interface to tell the user how many ships left. 


# SCREENSHOT

<img src='/images/main_page.png'/>
<img src='/images/1.png'/>
<img src='/images/2.png'/>
<img src='/images/3.png'/>
