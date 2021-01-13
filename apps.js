document.addEventListener('DOMContentLoaded',() => {

  //--------------------INITIAL DECLARATION--------------------//
    const userGrid = document.querySelector('.user-grid');
    const compGrid = document.querySelector('.comp-grid');

    const displayGrid = document.querySelector('.ship-placement');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-x');
    const submarine = document.querySelector('.submarine-x');
    const cruiser = document.querySelector('.cruiser-x');
    const battleship = document.querySelector('.battleship-x');
    const carrier = document.querySelector('.carrier-x');

    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-turn');
    const infoDisplay = document.querySelector('#message');

    let isShipHorizontal = true; 
    let isGameOver = false;
    let currentPlayer = 'user';

    const userSquares = [];
    const compSquares = [];

    const shipArray = [
      {name: 'destroyer',
      directions: [[0, 1], //if ship is horizontal
        [0, 10]]}, //if ship is vertical
      {name: 'submarine',
      directions: [[0, 1, 2], //if ship is horizontal
        [0, 10, 20]]}, //if ship is vertical
      {name: 'cruiser',
      directions: [[0, 1, 2], //if ship is horizontal
        [0, 10, 20]]}, //if ship is vertical
      
      {name: 'battleship',
      directions: [[0, 1, 2, 3], //if ship is horizontal
        [0, 10, 20, 30]]}, //if ship is vertical
      
      {name: 'carrier',
      directions: [[0, 1, 2, 3, 4], //if ship is horizontal
        [0, 10, 20, 30, 40]]}, //if ship is vertical
    ]
  //--------------------END OF INITIAL DECLARATION--------------------//
  //
  //
  //
  // 
  // 
  //
  // 
  // 
  //
  //
  //--------------------USER & COMP BOARD CREATION--------------------//

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
  // 
  // 
  //
  // 
  // 
  //
  //
  //--------------------RANDOM GENERATION OF COMPUTER'S SHIP ON COMP GRID--------------------//
  
    generateCompShip= (array) => {
      for (let i=0; i<array.length; i++) {
        randomGenerate(array[i]);
        console.log(i);
      }
    }

    randomGenerate = (ship) => {
      //random define computer ship direction (horizontally / vertically)
      let randomDirection = Math.floor(Math.random() * ship.directions.length);

      let current = ship.directions[randomDirection];
      let randomStartPoint = 0;

      if (randomDirection === 0) {
        // pick a random starting point and "generate" the box horizontally 0,1,2,3
        randomStartPoint = Math.abs(Math.floor(Math.random() * compSquares.length - (ship.directions[0].length * 1)));
      }
      if (randomDirection === 1) {
        // pick a random starting point and "generate" the box vertically 0,10,20,30
        randomStartPoint = Math.abs(Math.floor(Math.random() * compSquares.length - (ship.directions[0].length * 10)));
      }

      //To check grid for squares that has been used by other ships (to avoid overlapse) & does not overflow to right edge or left edge
      const isUsed = current.some(index => compSquares[randomStartPoint + index].classList.contains('used'));
      const isAtRightEdge = current.some(index => (randomStartPoint + index) % 10 === 9);
      const isAtLeftEdge = current.some(index => (randomStartPoint + index) % 10 === 0);
      
      if (!isUsed && !isAtRightEdge && !isAtLeftEdge) {
        current.forEach(index => compSquares[randomStartPoint + index].classList.add('used', `comp_${ship.name}`))
      } else {
        //to restart again autoGenerate so that the ship has a new random starting point, new directions & check again if sqIsUsed.
        randomGenerate(ship); 
      }
    }

    generateCompShip(shipArray);

  //--------------------END OF RANDOM GENERATION OF COMPUTER'S SHIP ON COMP GRID--------------------//
  // 
  // 
  // 
  // 
  // 
  //
  // 
  //
  //
  //
  //--------------------ROTATE BUTTON EVENT LISTENER FOR USER--------------------//

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
  // 
  // 
  //
  // 
  //
  //
  //
  //--------------------USER TO DRAG & DROP ON ITS OWN GRID--------------------//

    let selectedShipNameWithIndex = 0;
    let selectedShipClass = 0;
    let selectedShip = 0;
    let selectedShipLength = 0;

    ships.forEach(ship => ship.addEventListener('mousedown',(e) => {
      selectedShipNameWithIndex = e.target.id;
      console.log(selectedShipNameWithIndex);

      selectedShipClass = e.target.classList[0];
      console.log(selectedShipClass);
    }));

    dragStart = (e) => {
      selectedShip = e.target;
      console.log(selectedShip);
      selectedShipLength = e.target.childNodes.length;
      console.log(selectedShipLength);
    }

    dragOver = (e) => {
      e.preventDefault();
    }

    dragEnter = (e) => {
      e.preventDefault();
    }

    dragLeave = () => {
      console.log(`drag leave`);
    }

    dragDrop = (e) => {
      selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
      console.log(selectedShipIndex);

      if(isShipHorizontal) {
        for(let i=0; i<selectedShipLength; i++) {
          console.log(e.target.id)
          userSquares[parseInt(e.target.id) - selectedShipIndex + i].classList.add('used', selectedShipClass);
          console.log(userSquares[parseInt(e.target.id) - selectedShipIndex + i])
        }
      } else if (!isShipHorizontal) {
        for(let i=0; i<selectedShipLength; i++) {
          console.log(parseInt(e.target.id))
          userSquares[parseInt(e.target.id) - selectedShipIndex + 10*i].classList.add('used', selectedShipClass);
          console.log(userSquares[parseInt(e.target.id) - selectedShipIndex + 10*i])
        }
      } else return;

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
  // 
  // 
  //
  // 
  //
  //
  //
  //------------------------------USER ATTACK LOGIC-------------------------------//
    let userDestroyerCount = 0;
    let userSubmarineCount = 0;
    let userCruiserCount = 0;
    let userBattleshipCount = 0;
    let userCarrierCount = 0;

    userAttack = (square) => {
      console.log(`user start`);
      
      let isCompSqUsed = square.classList.contains('used');
      let isCompSqHit = square.classList.contains('hit');

  
      if(isCompSqUsed) {
        if(!isCompSqHit) {
          square.classList.add('hit');

          if (square.classList.contains('comp_destroyer')){
            userDestroyerCount++;
            console.log(`The destroyer has been hit: ${userDestroyerCount}`);
          } 
          else if(square.classList.contains('comp_submarine')){
            userSubmarineCount++;
            console.log(`The submarine has been hit: ${userSubmarineCount}`);
          } 
          else if(square.classList.contains('comp_cruiser')){
            userCruiserCount++;
            console.log(`The cruiser has been hit: ${userCruiserCount}`);
          }
          else if(square.classList.contains('comp_battleship')){
            userBattleshipCount++;
            console.log(`The battleship has been hit: ${userBattleshipCount}`);
          }
          else if(square.classList.contains('comp_carrier')){
            userCarrierCount++;
            console.log(`The carrier has been hit: ${userCarrierCount}`);
          }

          userCheckWin();

        } else if(isCompSqHit) {
          infoDisplay.innerHTML=`You've hit that square before. You lose a turn :(`
        }
      } else if(!isCompSqUsed) {
        square.classList.add('miss');
      }
      
      if(!isGameOver) {
        currentPlayer = 'computer';
        turnDisplay.innerHTML = `Computer's Turn`;
        console.log(`${currentPlayer}'s turn`);

        setTimeout(computerAttack,1000);
      } else return;
    }

  //------------------------------END OF USER ATTACK LOGIC-------------------------------//
  // 
  // 
  // 
  // 
  // 
  //
  // 
  //
  //
  //
  //------------------------------USER CHECK WINS LOGIC-------------------------------//

    let isCompDestroyerSink = false;
    let isCompSubmarineSink = false;
    let isCompCruiserSink = false;
    let isCompBattleshipSink= false;
    let isCompCarrierSink = false;

    userCheckWin = () => {
      
      if(userDestroyerCount === 2) {
        isCompDestroyerSink = true;
        console.log(isCompDestroyerSink);  
        infoDisplay.innerHTML=`You sunk computer's Destroyer`; // why never display?
      }
      if(userSubmarineCount === 3) {
        isCompSubmarineSink = true;
        console.log(isCompSubmarineSink); 
        infoDisplay.innerHTML='You sunk computer\'s Submarine'; // why never display?
      }
      if(userCruiserCount === 3) {
        isCompCruiserSink = true;
        console.log(isCompCruiserSink); 
        infoDisplay.innerHTML='You sunk computer\'s Cruiser'; // why never display?
      }
      if(userBattleshipCount === 4) {
        isCompBattleshipSink = true;
        console.log(isCompBattleshipSink); 
        infoDisplay.innerHTML='You sunk computer\'s Battleship'; // why never display?
      }
      if(userCarrierCount === 5) {
        isCompCarrierSink = true;
        console.log(isCompCarrierSink); 
        infoDisplay.innerHTML='You sunk computer\'s Carrier'; // why never display?
      }
      if(isCompDestroyerSink && isCompSubmarineSink && isCompCruiserSink && isCompBattleshipSink && isCompCarrierSink) {
        infoDisplay.innerHTML= "YOU WIN";
        console.log('YOU WIN');
        gameOver();
        return;
      }
    }
  
  //------------------------------END OF USER CHECK WINS LOGIC-------------------------------//
  // 
  // 
  // 
  // 
  // 
  //
  // 
  //
  //
  //
  //------------------------------COMPUTER ATTACK LOGIC-------------------------------//
    let compDestroyerCount = 0;
    let compSubmarineCount = 0;
    let compCruiserCount = 0;
    let compBattleshipCount = 0;
    let compCarrierCount = 0;

    //---TO RE-DO. FOLLOW PLAYER ATTACK FUNCTION ---//
    computerAttack = () => {
      console.log(`computer Start`);
      
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
        turnDisplay.innerHTML = `Player's Turn`;

      } else return;
    }
  //------------------------------END OF COMPUTER ATTACK LOGIC-------------------------------//
  // 
  // 
  // 
  // 
  // 
  //
  // 
  //
  //
  //
  //------------------------------COMPUTER CHECK WINS LOGIC-------------------------------//

    let isUserDestroyerSink = false;
    let isUserSubmarineSink = false;
    let isUserCruiserSink = false;
    let isUserBattleshipSink= false;
    let isUserCarrierSink = false;

    //---TO RE-DO. FOLLOW PLAYER ATTACK FUNCTION ---//
    compCheckWin = () => {
      if(compDestroyerCount === 2) {
        isUserDestroyerSink = true;
        console.log(isUserDestroyerSink);  
        infoDisplay.innerHTML=`Computer sunk your Destroyer`; // why never display?
      }
      if(compSubmarineCount === 3) {
        isUserSubmarineSink = true;
        console.log(isUserSubmarineSink); 
        infoDisplay.innerHTML='Computer sunk your Submarine'; // why never display?
      }
      if(compCruiserCount === 3) {
        isUserCruiserSink = true;
        console.log(isUserCruiserSink); 
        infoDisplay.innerHTML='Computer sunk your Cruiser'; // why never display?
      }
      if(compBattleshipCount === 4) {
        isUserBattleshipSink = true;
        console.log(isUserBattleshipSink); 
        infoDisplay.innerHTML='Computer sunk your Battleship'; // why never display?
      }
      if(compCarrierCount === 5) {
        isUserCarrierSink = true;
        console.log(isUserCarrierSink); 
        infoDisplay.innerHTML='Computer sunk your Carrier'; // why never display?
      }
      if(isUserDestroyerSink && isUserSubmarineSink && isUserCruiserSink && isUserBattleshipSink && isUserCarrierSink) {
        infoDisplay.innerHTML= "COMPUTER WIN";
        console.log('COMP WIN');
        gameOver();
        return;
      }
    }

  //------------------------------END OF COMPUTER CHECK WIN LOGIC-------------------------------//
  // 
  // 
  // 
  // 
  // 
  //
  // 
  //
  //
  //
  //------------------------------GAME LOGIC-------------------------------//

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
      }
    }

    startButton.addEventListener('click', playGame);

  //------------------------------END OF GAME LOGIC-------------------------------//

});