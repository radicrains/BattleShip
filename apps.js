/* 
  User will start out placing ships (horizontally / vertically) with 5ships:
  - Carrier (5 spaces)
  - BattleShip (4 spaces)
  - Cruiser (3 spaces)
  - submarine (3 spaces)
  - destroyer (2 spaces)

  Computer's ships will be auto generated the moment user clicks "start".

  gameGoal: to sinks all computer's 5 ships before computer sinks yours!
*/

document.addEventListener('DOMContentLoaded',() => {
  const userGrid = document.querySelector('.user-grid');
  const compGrid = document.querySelector('.comp-grid');
  const displayGrid = document.querySelector('.ship-placement');
  const ships = document.querySelectorAll('.ship');
  const destroyer = document.querySelector('.destroyer-hull');
  const submarine = document.querySelector('.submarine-hull');
  const cruiser = document.querySelector('.cruiser-hull');
  const battleship = document.querySelector('.battleship-hull');
  const carrier = document.querySelector('.carrier-hull');
  const startButton = document.querySelector('#start');
  const rotateButton = document.querySelector('#rotate');
  const turnDisplay = document.querySelector('#whose-turn');
  const infoDisplay = document.querySelector('#message');

  let isHorizontal = true; 
  let isGameOver = false;
  let currentPlayer = 'user';

  const userSquares = [];
  const compSquares = [];
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1], //if ship is horizontal
        [0, 10] //if ship is vertical
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2], //if ship is horizontal
        [0, 10, 20] //if ship is vertical
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2], //if ship is horizontal
        [0, 10, 20] //if ship is vertical
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3], //if ship is horizontal
        [0, 10, 20, 30] //if ship is vertical
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4], //if ship is horizontal
        [0, 10, 20, 30, 40] //if ship is vertical
      ]
    },
  ]



  createBoard = (grid, squares) => {
    for (let i = 0; i < 100; i++) {
      const square = document.createElement('div');
      square.dataset.id = i;
      // square.classList.add('taken');
      grid.append(square);
      squares.push(square);
    }
  }

  autoGenerate = (ship) => {
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
      current.forEach(index => compSquares[randomStartPoint + index].classList.add('used', ship.name))
    } else {
      autoGenerate(ship)
    }
  }

  generateCompShip= (array) => {
    for (let i=0; i<array.length; i++) {
      autoGenerate(array[i]);
      console.log(i);
    }
  }

  rotate = () => {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-hull-v');
      submarine.classList.toggle('submarine-hull-v');
      cruiser.classList.toggle('cruiser-hull-v');
      battleship.classList.toggle('battleship-hull-v');
      carrier.classList.toggle('carrier-hull-v');

      isHorizontal = false
      console.log(isHorizontal);
      // return
    } else {
      destroyer.classList.toggle('destroyer-hull');
      submarine.classList.toggle('submarine-hull');
      cruiser.classList.toggle('cruiser-hull');
      battleship.classList.toggle('battleship-hull');
      carrier.classList.toggle('carrier-hull');

      isHorizontal = true
      console.log(isHorizontal);
    //   return
    }
  }





  //move ard user ship
  let selectShipNameWithIndex
  let selectShipNameWithClass
  let draggedShip
  let draggedShipLength



  ships.forEach(ship => ship.addEventListener('mousedown',(e) => {
    selectShipNameWithIndex = e.target.id;
    console.log(selectShipNameWithIndex);

    selectShipNameWithClass = (`comp_${e.target.classList[0]}`);
    console.log(selectShipNameWithClass);
  }));

  dragStart = (e) => {
    draggedShip = e.target;
    draggedShipLength = e.target.childNodes.length;

    console.log(draggedShip);
    console.log(draggedShipLength);
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
    // let lastShipIndex = parseInt(draggedShip.lastChild.id.substr(-1)); //take the last string of the name. e.g. destroyer-1 --> return 1
    // console.log(lastShipIndex);

    // let shipLastId = lastShipIndex + parseInt(e.target.dataset.id);
    // console.log(shipLastId);

    selectedShipIndex = parseInt(selectShipNameWithIndex.substr(-1));
    console.log(selectedShipIndex);

    // shipLastId = shipLastId - selectedShipIndex;
    // console.log(shipLastId);

    if(isHorizontal) {
      for(let i=0; i<draggedShipLength; i++) {
        userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + i].classList.add('used', selectShipNameWithClass);
      }
    } else if (!isHorizontal) {
      for(let i=0; i<draggedShipLength; i++) {
        userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + 10*i].classList.add('used', selectShipNameWithClass);
      }
    } else return

    displayGrid.removeChild(draggedShip);
  }
 
  dragEnd = () => {
    console.log(`drag end`);
  }



  
  gameOver = () => {
    isGameOver = true;
    startButton.removeEventListener('click',playGame);
    rotateButton.removeEventListener('click',rotate);
  }
  

  
  compCheckWin = () => {
    if(cpuDestroyerCount === 2) {
      infoDisplay.innerHTML='Computer sunk your destroyer';
      cpuDestroyerCount = 10;
    }
    if(cpuSubmarineCount === 3) {
      infoDisplay.innerHTML='Computer sunk your Submarine';
      cpuSubmarineCount = 10;
    }
    if(cpuCruiserCount === 3) {
      infoDisplay.innerHTML='Computer sunk your Cruiser';
      cpuCruiserCount = 10;
    }
    if(cpuBattleshipCount === 4) {
      infoDisplay.innerHTML='Computer sunk your Battleship';
      cpuBattleshipCount = 10;
    }
    if(cpuCarrierCount === 4) {
      infoDisplay.innerHTML='Computer sunk your Carrier';
      cpuCarrierCount = 10;
    }
    if((cpuDestroyerCount + cpuSubmarineCount + cpuCarrierCount + cpuBattleshipCount + cpuCruiserCount) === 50) {
      infoDisplay.innerHTML="COMPUTER WIN"
      gameOver();
    }
  }

  let destroyerCount = 0;
  let submarineCount = 0;
  let cruiserCount = 0;
  let battleshipCount = 0;
  let carrierCount = 0;

  playerAttack = (square) => {
    console.log(`Player start`);
    
    let isCompSqUsed = square.classList.contains('used');
    let isCompSqHit = square.classList.contains('hit');

 

    if(isCompSqUsed) {
      if(!isCompSqHit) {
        square.classList.add('hit');
        // console.log(`it's a hit!`);

        if (square.classList.contains('destroyer')){
          destroyerCount++;
          console.log(`The destroyer has been hit: ${destroyerCount}`);
        } 
        else if(square.classList.contains('submarine')){
          submarineCount++;
          console.log(`The submarine has been hit: ${submarineCount}`);
        } 
        else if(square.classList.contains('cruiser')){
          cruiserCount++;
          console.log(`The cruiser has been hit: ${cruiserCount}`);
        }
        else if(square.classList.contains('battleship')){
          battleshipCount++;
          console.log(`The battleship has been hit: ${battleshipCount}`);
        }
        else if(square.classList.contains('carrier')){
          carrierCount++;
          console.log(`The carrier has been hit: ${carrierCount}`);
        }

        playerCheckWin();

      } else if(isCompSqHit) {
        infoDisplay.innerHTML=`You've hit that square before. You lose a turn :(`
      }
    } else if(!isCompSqUsed) {
      square.classList.add('miss');
      // console.log(`you missed :(`);
    }
    
    currentPlayer = 'computer';
    turnDisplay.innerHTML = `Computer's Turn`;
    console.log(`${currentPlayer}'s turn`);

    setTimeout(computerAttack,1000);
  }

    let isDestroyerSink = false;
    let isSubmarineSink = false;
    let isCruiserSink = false;
    let isBattleshipSink= false;
    let isCarrierSink = false;

  playerCheckWin = () => {
    

    // let totalCount = destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount;

    
    if(destroyerCount === 2) {
      isDestroyerSink = true;
      console.log(isDestroyerSink);  
      infoDisplay.innerHTML='You sunk computer\'s Destroyer';
      // destroyerCount = 10;
    }
    if(submarineCount === 3) {
      isSubmarineSink = true;
      console.log(isSubmarineSink); 
      infoDisplay.innerHTML='You sunk computer\'s Submarine';
      // submarineCount = 10;
    }
    if(cruiserCount === 3) {
      isCruiserSink = true;
      console.log(isCruiserSink); 
      infoDisplay.innerHTML='You sunk computer\'s Cruiser';
      // cruiserCount = 10;
    }
    if(battleshipCount === 4) {
      isBattleshipSink = true;
      console.log(isBattleshipSink); 
      infoDisplay.innerHTML='You sunk computer\'s Battleship'; // why never display?
      // battleshipCount = 10;
    }
    if(carrierCount === 5) {
      isCarrierSink = true;
      console.log(isCarrierSink); 
      infoDisplay.innerHTML='You sunk computer\'s Carrier';
      // carrierCount = 10;
    }
    if(isDestroyerSink && isSubmarineSink && isCarrierSink && isBattleshipSink && isCarrierSink) {
      infoDisplay.innerHTML= "YOU WIN";
      console.log('YOU WIN');
      gameOver();
    }
    

    

    // if((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
    //   infoDisplay.innerHTML= "YOU WIN";
    //   gameOver();
    // }
  }
  





  let cpuDestroyerCount = 0;
  let cpuSubmarineCount = 0;
  let cpuCruiserCount = 0;
  let cpuBattleshipCount = 0;
  let cpuCarrierCount = 0;

  computerAttack = () => {
    console.log(`computer Start`);
    
    let randomNum = Math.floor(Math.random()*100);
    let isUserSqUsed = userSquares[randomNum].classList.contains('used');
    let isUserSqHit = userSquares[randomNum].classList.contains('hit');

    if(isUserSqUsed) {
      if(!isUserSqHit) {
        userSquares[randomNum].classList.add('hit');
        console.log(`Computer hits you!`);

        if (userSquares[randomNum].classList.contains('comp_destroyer')){
          cpuDestroyerCount++;
          console.log(`Computer hits your destroyer: ${cpuDestroyerCount}`);
        } 
        else if(userSquares[randomNum].classList.contains('comp_submarine')){
          cpuSubmarineCount++;
          console.log(`Computer hits your submarine: ${cpuSubmarineCount}`);
        } 
        else if(userSquares[randomNum].classList.contains('comp_cruiser')){
          cpuCruiserCount++;
          console.log(`Computer hits your cruiser: ${cpuCruiserCount}`);
        }
        else if(userSquares[randomNum].classList.contains('comp_battleship')){
          cpuBattleshipCount++;
          console.log(`Computer hits your battleship: ${cpuBattleshipCount}`);
        }
        else if(userSquares[randomNum].classList.contains('comp_carrier')){
          cpuCarrierCount++;
          console.log(`Computer hits your carrier: ${cpuCarrierCount}`);
        }
      }else if(isUserSqHit){
        computerAttack();
      }
    } else if(!isUserSqUsed) {
      userSquares[randomNum].classList.add('miss');
      console.log(`Computer misses your ship!`);
    }

    compCheckWin();
    
    currentPlayer = 'user';
    console.log(`${currentPlayer}'s turn`);
    
    turnDisplay.innerHTML = `Your Turn`;

  }
  

  playGame = () => {
    if (isGameOver){
      gameOver();
      return;
    } else {
      compSquares.forEach(square => square.addEventListener('click',()=> {
        playerAttack(square);
      }));
    }
  }

  

  createBoard(userGrid,userSquares);
  createBoard(compGrid,compSquares);
  generateCompShip(shipArray);

  rotateButton.addEventListener('click', rotate);

  ships.forEach(ship => ship.addEventListener('dragstart',dragStart));
  userSquares.forEach(square => square.addEventListener('dragstart',dragStart));
  userSquares.forEach(square => square.addEventListener('dragover',dragOver));
  userSquares.forEach(square => square.addEventListener('dragenter',dragEnter));
  userSquares.forEach(square => square.addEventListener('dragleave',dragLeave));
  userSquares.forEach(square => square.addEventListener('drop',dragDrop));
  userSquares.forEach(square => square.addEventListener('dragend',dragEnd));


  startButton.addEventListener('click', playGame);

});





/*--------------- WHAT IS LEFT? ----------------*/
//Ensure that computer cannot double attack the same sq.
//checkwins
//gameover

//api?

// challenges
//random generate to keep inside the box. 
//drag & drop