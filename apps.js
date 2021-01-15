document.addEventListener('DOMContentLoaded',() => {

  //--------------------USER & COMP BOARD CREATION--------------------//
   /* 
   this whole section will create the user & comp grid.
  */

  const userGrid = document.querySelector('.user-grid');
  const compGrid = document.querySelector('.comp-grid');
  const userSquares = [];
  const compSquares = [];

    createBoard = (grid, squares) => {
      for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.id = i;
        grid.append(square);
        squares.push(square);
      }
    }

    createBoard(userGrid,userSquares);
    createBoard(compGrid,compSquares);

  //-----------------------END BOARD CREATION---------------------------//
  //
  //
  //
  //--------------------RANDOM GENERATION OF COMPUTER'S SHIP ON COMP GRID--------------------//
  /* 
   This whole section generate comp's ship on comp's grid by:
   1) Defining the orientation of the ship (horizontally / vertically)
   2) based on the direction, Identify the starting point of the ship with the following considerations:
      a) ensure that comp ship generate does not overflow to col 0 or col 9. (else 3 ship will be 2 or 1 if overflow the grid)
      b) ensuring that the comp ship does not overlap with existing ships on comp's grid. 
  */

  const shipArray = [
    {name: 'destroyer',
    directions: [[0, 1],    //if ship is horizontal
      [0, 10]]},            //if ship is vertical

    {name: 'submarine',
    directions: [[0, 1, 2], //if ship is horizontal
      [0, 10, 20]]},        //if ship is vertical

    {name: 'cruiser',
    directions: [[0, 1, 2], //if ship is horizontal
      [0, 10, 20]]},        //if ship is vertical
    
    {name: 'battleship',
    directions: [[0, 1, 2, 3], //if ship is horizontal
      [0, 10, 20, 30]]},       //if ship is vertical
    
    {name: 'carrier',
    directions: [[0, 1, 2, 3, 4], //if ship is horizontal
      [0, 10, 20, 30, 40]]}       //if ship is vertical
  ]      
  

  //loop array to generate random comp ship squares
  generateCompShip= (array) => {
    for (let i=0; i<array.length; i++) {
      randomGenerate(array[i]);
      console.log(i);
    }
  };

  randomGenerate = (ship) => {
    //random define computer ship direction (horizontally / vertically)
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    let randomStartPoint = 0;

    // pick a random starting point - the comp ship length
    if (randomDirection === 0) {
      randomStartPoint = Math.abs(Math.floor(Math.random() * compSquares.length - (ship.directions[0].length * 1)));
      // console.log(randomStartPoint);

    } else if (randomDirection === 1) {
      randomStartPoint = Math.abs(Math.floor(Math.random() * compSquares.length - (ship.directions[0].length * 10)));
      // console.log(randomStartPoint);
    }


    //To check grid for squares that has been used by other ships (to avoid overlapse) & does not overflow to right edge or left edge
    const isUsed = current.some(index => compSquares[randomStartPoint + index].classList.contains('used'));
    const isAtRightEdge = current.some(index => (randomStartPoint + index) % 10 === 9);
    const isAtLeftEdge = current.some(index => (randomStartPoint + index) % 10 === 0);
    
    // check & "generate" ship by adding class to the squares (for ease of identification later)
    // else to restart again so that the ship has a new random starting point, new directions & check again if sqIsUsed.
    if (!isUsed && !isAtRightEdge && !isAtLeftEdge) {
      current.forEach(index => compSquares[randomStartPoint + index].classList.add('used', `comp_${ship.name}`, 'compSq-hide'))
    } else {
      randomGenerate(ship); 
    }
  }

  generateCompShip(shipArray);

  //--------------------END OF RANDOM GENERATION OF COMPUTER'S SHIP ON COMP GRID--------------------//
  // 
  // 
  // 
  //--------------------ROTATE BUTTON EVENT LISTENER FOR USER--------------------//
   /* 
   This whole section controls the rotation of the ships with the help of rotate button toggle the ship's sq class:
   - user ships are originally horizontal (X). 
   - If user pressed rotate, it will be vertical (Y).
   - press rotate again will revert back to horizontal (X).
   
  */
  const rotateButton = document.querySelector('#rotate');
  const destroyer = document.querySelector('.destroyer-x');
  const submarine = document.querySelector('.submarine-x');
  const cruiser = document.querySelector('.cruiser-x');
  const battleship = document.querySelector('.battleship-x');
  const carrier = document.querySelector('.carrier-x');

  let isShipHorizontal = true; 


  rotateShip = () => {
    if (isShipHorizontal) {
      destroyer.classList.toggle('destroyer-y');
      submarine.classList.toggle('submarine-y');
      cruiser.classList.toggle('cruiser-y');
      battleship.classList.toggle('battleship-y');
      carrier.classList.toggle('carrier-y');

      isShipHorizontal = false;
      console.log(isShipHorizontal);

    } else if (!isShipHorizontal){
      destroyer.classList.toggle('destroyer-y');
      submarine.classList.toggle('submarine-y');
      cruiser.classList.toggle('cruiser-y');
      battleship.classList.toggle('battleship-y');
      carrier.classList.toggle('carrier-y');

      isShipHorizontal = true
      console.log(isShipHorizontal);

    }
  }

  rotateButton.addEventListener('click', rotateShip);

  //--------------------END OF ROTATE BUTTON EVENT LISTENER FOR USER--------------------//
  // 
  // 
  // 
  //--------------------USER TO DRAG & DROP ON ITS OWN GRID--------------------//
  /* 
   This whole section allows user to drag and drop user's ship. We have to identify 2 things:
   1) the grid-id that user drop the ship onto.
   2) the ship index when user click to drag onto the squares. 
   
   We need this two critical events information to calculate the squares needed to "generate" the ship via class.
   for horizontal --- squares +1
   for vertical ---- squares +10
  */

    const displayGrid = document.querySelector('.ship-placement');
    const ships = document.querySelectorAll('.ship');

    let selectedShipNameWithIndex = 0;
    let selectedShipClass = 0;
    let selectedShip = 0;
    let selectedShipLength = 0;


    //When player click on user ship (to drag) - get selected ship ID & Class
    ships.forEach(ship => ship.addEventListener('mousedown',(e) => {
      selectedShipNameWithIndex = e.target.id;
      // console.log(selectedShipNameWithIndex); //log: destroyer -0

      selectedShipClass = e.target.classList[0];
      // console.log(selectedShipClass);  //log: destroyer
    }));



    dragStart = (e) => {

      selectedShip = e.target;
      // console.log(selectedShip); //log: <div class="shipdestroyer-x" draggable ='true'></div>

      selectedShipLength = e.target.childNodes.length;  
      // console.log(selectedShipLength); //log: 2 (as destroyer only has 2 tiles)
    }

    dragOver = (e) => {
      e.preventDefault();
      // console.log(`drag over`);
    }

    dragEnter = (e) => {
      e.preventDefault();
      // console.log(`drag Enter`);
    }

    dragLeave = () => {
      console.log(`drag leave`);
    }

    dragDrop = (e) => {
      selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
      //logs: 1 ----> as user select destroyer in 2nd tile. [0,1]

      if(isShipHorizontal) {
        for(let i=0; i<selectedShipLength; i++) {
          //logs: 99 ----> the sq id you decide to place ur ship into.

          //'generate' the ships in user grid by adding class 
          userSquares[parseInt(e.target.id) - selectedShipIndex + i].classList.add('used', selectedShipClass);
          // logs: [99-1+ (0 or 1)] -> sq1 = 98. sq2 = 99
        }

      } else if (!isShipHorizontal) {
        for(let i=0; i<selectedShipLength; i++) {
          userSquares[parseInt(e.target.id) + 10*i].classList.add('used', selectedShipClass); //remove selectedShipIndex to prevent y to be displaced by LHS/RHS
        }
      } else return;

      //remove the draggedship after user drag.
      displayGrid.removeChild(selectedShip);
    }
  
    dragEnd = () => {
      console.log(`drag end`);
    }

    ships.forEach(ship => ship.addEventListener('dragstart',dragStart));
    userSquares.forEach(square => square.addEventListener('dragstart',dragStart));
    userSquares.forEach(square => square.addEventListener('dragover',dragOver));
    userSquares.forEach(square => square.addEventListener('dragenter',dragEnter));
    userSquares.forEach(square => square.addEventListener('dragleave',dragLeave));
    userSquares.forEach(square => square.addEventListener('drop',dragDrop));
    userSquares.forEach(square => square.addEventListener('dragend',dragEnd));
  
  //--------------------END OF USER TO DRAG & DROP ON ITS OWN GRID--------------------//
  // 
  // 
  //
  //------------------------------FOR GAME LOGICS (ATTACK & CHECKWIN) DECLARATIONS-------------------------------//
 
    const startButton = document.querySelector('#start');
    const turnDisplay = document.querySelector('#turnMsg');
    const gameDisplay = document.querySelector('#gameMsg');
    
    let isGameOver = false;
    let currentPlayer = 'user';
 
  //------------------------------USER ATTACK LOGIC-------------------------------//
  /* 
   This whole section counts the ship's tiles via identifying:
   - if the grid sq is being used by both players' ship
   - if the grid sq has been hit

   3 conditions for this game:
   1) MISS - if sq is hit but not used.
   2) HIT - if sw id hit and used
   3) SINK - ship sinks when all of ship's tiles are destroyed. 

   User will lose a turn if the sq as already been hit.

  */

    let userDestroyerCount = 0;
    let userSubmarineCount = 0;
    let userCruiserCount = 0;
    let userBattleshipCount = 0;
    let userCarrierCount = 0;

    userAttack = (square) => {
      // console.log(`user start`);
      gameDisplay.innerHTML = ''; //to clear all & any existing text
      
      let isCompSqUsed = square.classList.contains('used');
      let isCompSqHit = square.classList.contains('hit');

  
      if(isCompSqUsed) {
        if(!isCompSqHit) {
          square.classList.add('hit');

          if (square.classList.contains('comp_destroyer')){
            userDestroyerCount++;
            // console.log(`The destroyer has been hit: ${userDestroyerCount}`);
          } 
          else if(square.classList.contains('comp_submarine')){
            userSubmarineCount++;
            // console.log(`The submarine has been hit: ${userSubmarineCount}`);
          } 
          else if(square.classList.contains('comp_cruiser')){
            userCruiserCount++;
            // console.log(`The cruiser has been hit: ${userCruiserCount}`);
          }
          else if(square.classList.contains('comp_battleship')){
            userBattleshipCount++;
            // console.log(`The battleship has been hit: ${userBattleshipCount}`);
          }
          else if(square.classList.contains('comp_carrier')){
            userCarrierCount++;
            // console.log(`The carrier has been hit: ${userCarrierCount}`);
          }

          userCheckWin();

        } else if(isCompSqHit) {
          gameDisplay.innerHTML=`You've hit that square before. You lose a turn :(`
        }
      } else if(!isCompSqUsed) {
        square.classList.add('miss');
      }
      
      if(!isGameOver) {
        currentPlayer = 'computer';
        turnDisplay.innerHTML = `Computer's turn to Attack`;
        console.log(`${currentPlayer}'s turn`);

        setTimeout(computerAttack,1000);
      } else return;
    }

  //------------------------------END OF USER ATTACK LOGIC-------------------------------//
  // 
  // 
  //------------------------------USER CHECK WINS LOGIC-------------------------------//
  /* 
   This whole section calculates the ship's death:
   Every ship has standard squares available.

   destroyer = 2 squares
   cruiser = 3 squares
   submarine = 3 squares
   battleship = 4 squares
   carrier = 4 squares

   at any point, if the ship's hit counter (in attack logic) === no of ship squares
   the ship will sink. 

   Players win the game when all 5 ships has sunk

  */

    let isCompDestroyerSink = false;
    let isCompSubmarineSink = false;
    let isCompCruiserSink = false;
    let isCompBattleshipSink= false;
    let isCompCarrierSink = false;

    userCheckWin = () => {

      if(!isCompDestroyerSink && userDestroyerCount === 2) {
        isCompDestroyerSink = true;
        // console.log(isCompDestroyerSink);  
        gameDisplay.innerHTML=`You sunk computer's Destroyer`; 
      }

      if(!isCompSubmarineSink && userSubmarineCount === 3) {
        isCompSubmarineSink = true;
        console.log(isCompSubmarineSink);  
        gameDisplay.innerHTML=`You sunk computer's Submarine`; 
      }

      if(!isCompCruiserSink && userCruiserCount === 3) {
        isCompCruiserSink = true;
        // console.log(isCompCruiserSink);  
        gameDisplay.innerHTML=`You sunk computer's Cruiser`; 
      }

      if(!isCompBattleshipSink && userBattleshipCount === 4) {
        isCompBattleshipSink = true;
        // console.log(isCompBattleshipSink);  
        gameDisplay.innerHTML=`You sunk computer's Battleship`; 
      }

      if(!isCompCarrierSink && userCarrierCount === 5) {
        isCompCarrierSink = true;
        // console.log(isCompCarrierSink);  
        gameDisplay.innerHTML=`You sunk computer's Carrier`; 
      }
      if(isCompDestroyerSink && isCompSubmarineSink && isCompCruiserSink && isCompBattleshipSink && isCompCarrierSink) {
        gameDisplay.innerHTML= "YOU WIN";
        // console.log('YOU WIN');
        gameOver();
        return;
      }
    }
  
  //------------------------------END OF USER CHECK WINS LOGIC-------------------------------//
  // 
  // 
  // 
  //------------------------------COMPUTER ATTACK LOGIC-------------------------------//
  /* 
   Similar logic to user attacking logic. It's just that rather than asking for user
   to click on the square to attack. The computer will attack based on random number generation. 

   computer will attack only when the random number has not be hit / missed before.
   this is to prevent same random number being generated again throughout the game.

  */
    let compDestroyerCount = 0;
    let compSubmarineCount = 0;
    let compCruiserCount = 0;
    let compBattleshipCount = 0;
    let compCarrierCount = 0;

    //---TO RE-DO. FOLLOW PLAYER ATTACK FUNCTION ---//
    computerAttack = () => {
      console.log(`computer Start`);
      gameDisplay.innerHTML = ''; //to clear all & any existing text
      
      let randomNum = Math.floor(Math.random()*100);
      let isUserSqUsed = userSquares[randomNum].classList.contains('used');
      let isUserSqHit = userSquares[randomNum].classList.contains('hit');
      let isUserSqMiss = userSquares[randomNum].classList.contains('miss');

      console.log(userSquares[randomNum]);

      if(isUserSqUsed) {
        if(!isUserSqHit) {
          userSquares[randomNum].classList.add('hit');
          console.log(`Computer hits you!`);
          console.log(userSquares[randomNum]);

          if (userSquares[randomNum].classList.contains('destroyer')){
            compDestroyerCount++;
            console.log(`Computer hits your destroyer: ${compDestroyerCount}`);
          } 
          if(userSquares[randomNum].classList.contains('submarine')){
            compSubmarineCount++;
            console.log(`Computer hits your submarine: ${compSubmarineCount}`);
          } 
          if(userSquares[randomNum].classList.contains('cruiser')){
            compCruiserCount++;
            console.log(`Computer hits your cruiser: ${compCruiserCount}`);
          }
          if(userSquares[randomNum].classList.contains('battleship')){
            compBattleshipCount++;
            console.log(`Computer hits your battleship: ${compBattleshipCount}`);
          }
          if(userSquares[randomNum].classList.contains('carrier')){
            compCarrierCount++;
            console.log(`Computer hits your carrier: ${compCarrierCount}`);
          }
        }else if(isUserSqHit){
          computerAttack();
          return;
        }
      } else if(!isUserSqUsed && !isUserSqMiss) {
        userSquares[randomNum].classList.add('miss');
        console.log(`Computer misses your ship!`);
        console.log(userSquares[randomNum]);
      } else if(isUserSqMiss) {
        computerAttack();
        return;
      }

      compCheckWin();

      if(!isGameOver) {
        currentPlayer = 'user';
        console.log(`${currentPlayer}'s turn`);
        turnDisplay.innerHTML = `Player's turn to Attack`;

      } else return;
    }
  //------------------------------END OF COMPUTER ATTACK LOGIC-------------------------------//
  // 
  // 
  //------------------------------COMPUTER CHECK WINS LOGIC-------------------------------//
  /* 
   same logic as user check wins. just on user status.

  */

    let isUserDestroyerSink = false;
    let isUserSubmarineSink = false;
    let isUserCruiserSink = false;
    let isUserBattleshipSink= false;
    let isUserCarrierSink = false;

    compCheckWin = () => {

      if(!isUserDestroyerSink && compDestroyerCount === 2) {
        isUserDestroyerSink = true;
        // console.log(isUserDestroyerSink);  
        gameDisplay.innerHTML=`Computer sunk your Destroyer`; 
      }
      if(!isUserSubmarineSink && compSubmarineCount === 3) {
        isUserSubmarineSink = true;
        // console.log(isUserSubmarineSink);  
        gameDisplay.innerHTML=`Computer sunk your Submarine`; 
      }
      if(!isUserCruiserSink && compCruiserCount === 3) {
        isUserCruiserSink = true;
        // console.log(isUserCruiserSink);  
        gameDisplay.innerHTML=`Computer sunk your Cruiser`; 
      }
      if(!isUserBattleshipSink && compBattleshipCount === 4) {
        isUserBattleshipSink = true;
        // console.log(isUserBattleshipSink);  
        gameDisplay.innerHTML=`Computer sunk your Cruiser`;
      }
      if(!isUserCarrierSink && compCarrierCount === 5) {
        isUserCarrierSink = true;
        // console.log(isUserCarrierSink);  
        gameDisplay.innerHTML=`Computer sunk your Cruiser`; 
      }
      if(isUserDestroyerSink && isUserSubmarineSink && isUserCruiserSink && isUserBattleshipSink && isUserCarrierSink) {
        gameDisplay.innerHTML= "COMPUTER WIN";
        // console.log('COMP WIN');
        gameOver();
        return;
      }
    }

  //------------------------------END OF COMPUTER CHECK WIN LOGIC-------------------------------//
  // 
  // 
  // 
   //------------------------------GAME INITIALIZATION-------------------------------//

    gameOver = () => {
      isGameOver = true;
      startButton.removeEventListener('click',playGame);
      rotateButton.removeEventListener('click',rotate);
      return;
    }

    playGame = () => {
      if (isGameOver){
        gameOver();
        return;
      } else {
        compSquares.forEach(square => square.addEventListener('click',()=> {
          userAttack(square);
        }));
        rotateButton.style.display = 'none';
        turnDisplay.innerHTML = 'Player starts first. Click on Computer grid to start the attack!';
      }
    }

    startButton.addEventListener('click', playGame);

  //------------------------------END OF GAME LOGIC-------------------------------//
  //
  //
  //
  //------------------------------START IMGUR API-------------------------------//
  
  $.ajax({
      url: 'https://api.imgur.com/3/album/4RlR7EB/images',
      headers:{
          'Authorization':'Client-ID 23492f2c1894b2f'
      },
      type: 'GET',
      dataType: 'json',
      success: function(data) { 

          $('body').css('background-image', 'url('+data.data[0].link+')');

      },
      error: function() { console.log("API FAIL");}
  });

  //------------------------------END IMGUR API-------------------------------//


});


//--------------------------SOURCES------------------------------//
// For imgur to ajax:
// https://stackoverflow.com/questions/24912112/how-can-i-get-imgur-com-album-images-using-ajax-request