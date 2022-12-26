const Board = () => {
    let board = document.getElementById("boardCheckers");
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 8; column++) {
        const cell = document.createElement("div");
        const piece = document.createElement("button");
        board.appendChild(cell);
        if (row === 1 || row === 3 || row === 5 || row === 7) {
          if (column % 2 === 0) cell.classList.add('box', 'brown');
          else cell.classList.add('shament', 'box');
        }
        if (row === 2 || row === 4 || row === 6 || row === 8) {
          if (column % 2 === 1) cell.classList.add('box', 'brown');
          else cell.classList.add('shament', 'box');
        }
        if (
          (row === 2 && column % 2 === 1) ||
          (row === 1 && column % 2 === 0) ||
          (row === 3 && column % 2 === 0)
        )
        {
          checkersPieces[row+""+column]=('piece black')
          piece.classList.add('piece', 'black');
          cell.appendChild(piece);
          piece.id = row + ""+ column;
  
        }
        else if (
          (row === 7 && column % 2 === 0) ||
          (row === 8 && column % 2 === 1) ||
          (row === 6 && column % 2 === 1)
        )
        {
                  piece.classList.add('piece', 'white');
                  cell.appendChild(piece);
                  piece.id = row + ""+ column;
                  checkersPieces[row+""+column]=('piece white')
        }
        else {
        checkersPieces[row+""+column]=('piece none')
        }
        cell.id = `${row}${column}`;
      }
    }
    return board;
  };
  checkersPieces=[];
  const BoardContainer = Board();
  setBtns();
  let firstClickId = null;
  let SecondClickId = null;
  let PieceColor = null;
  let isItBlackTurn = true;
  let isLegalMove = false;
  let isValidEat = false;
  let middleSlotId = null;
  let isSlotfree = null;
  let whitePiecesCount = 0,
  blackPiecesCount = 0;
  let piecesCanEat = [];
  let justEat = false;
  let numberOfTurns = 0,
  PlacesPieceMustGo = [],
  PlacesPieceCanGo = [];
  let isPieceCanEat = false;
   updateWaysToGo(isItBlackTurn)
  const favDialog = document.getElementById("favDialog");
  
  //first click
  BoardContainer.addEventListener('click', function (event) {
    console.table([checkersPieces]);
    clearMarkedPlaces();
    if (!isfirstClickValid(event)) return false;
    PieceColor = checkPiecesColor(event.target);
    firstClickId = event.target.id;
    if (!(isMyTurn(event.target.id, isItBlackTurn))) 
    return false;
    MarksSlotsCanGo();
    clearBurnPlaces();
  });
  
  //Second click
  BoardContainer.addEventListener("click", function (event) {
    if (!isSecondClickValid(event)) return false;
    SecondClickId = event.target.id;
    justEat = isPieceEatsOpponent();
    let nextrow = SecondClickId[0] * 1,
    nextcolumn = SecondClickId[1] * 1,
    row = firstClickId[0] * 1,
    column = firstClickId[1] * 1;
    middleSlotId = getMiddleSlot(row, column, nextrow, nextcolumn);
    isValidEat = isLegalMoves(row,column,nextrow,nextcolumn,PieceColor,isItBlackTurn);
    if (PlacesPieceMustGo.length > 0) 
    isValidEat = isPieceHaveToEatAnother();
  
    if (isValidEat)
     makeMove(firstClickId, middleSlotId, SecondClickId);
    else {
      restClicks() 
       return false;
    }
    if (!justEat) 
    burnPiecesAbleToEat();
    restArray();
    promotion(SecondClickId, firstClickId);
    if (isGameOver()) return true;
    changeTurn(SecondClickId, isItBlackTurn, justEat);
    isDraw(isItBlackTurn);
    restoreVaribles();
    clearMarkedPlaces();  
    updateWaysToGo(isItBlackTurn);
    document.getElementById("turn").innerHTML = (isItBlackTurn ? 'black player' : 'white player')+" Turn" ;
  });
  function isGameOver() {
    whitePiecesCount=0;
    blackPiecesCount=0;
    for(let i=1;i<=8;i++){
       for(let j=1;j<=8;j++){
    if(checkersPieces[""+i+j]==='king white'||checkersPieces[""+i+j]==='piece white')
     whitePiecesCount++;
     if(checkersPieces[""+i+j]==='king black'||checkersPieces[""+i+j]==='piece black')
     blackPiecesCount++;
    }
  }
    if (blackPiecesCount === 0) {
      let audio = new Audio("images/win.wav");
      audio.play();
      displayModalMessege("white player win , BRAVO!");
      return true;
    }
    if (whitePiecesCount === 0) {
      let audio = new Audio("images/win.wav");
      audio.play();
      displayModalMessege(" black player win, BRAVO! ");
      return true;
    }
  }
  function updateWaysToGo(isItBlackTurn) {
  
   if(PlacesPieceMustGo.length>0)
     return true
  
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 8; column++) {
        const tempPiece=checkersPieces[""+ row + column];
        if (isMyTurn([""+ row + column],isItBlackTurn)){ 
  
          const ways = [(row + 2),(column - 2),(row - 2),(column - 2),(row + 2),(column + 2),(row - 2),(column + 2),
            (row + 1),(column + 1),(row - 1),(column +1),(row + 1),(column - 1),(row - 1),(column -1)];
          for (let i = 0; i<ways.length ; i+=2){
            if(ways[i]>0&&ways[i]<9&&ways[i+1]>0&&ways[i+1]<9){
  
            isLegalMove = isLegalMoves(row,column,ways[i],ways[i+1],tempPiece,isItBlackTurn);
                isSlotfree = isSlotAvialble(ways[i], ways[i+1]);
              if (isLegalMove && isSlotfree)
               {
                  WaysPieceCanGo(row, column, ways[i] ,ways[i+1]);
                  if(row-ways[i]===-2||row-ways[i]===2)
                  piecesCanEat.push(""+row+ column+ ways[i]+ways[i+1]);
  
                }
            }
          }
          }
          }
        }
    }
  function isDraw(isItBlackTurn) {
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 8; column++) {
        const tempPiece = checkersPieces[("" + row + column)]
        if (isMyTurn([""+ row + column],isItBlackTurn)){
          for (let nextrow = 1; nextrow <= 8; nextrow++)
            for (let nextcolumn = 1; nextcolumn <= 8; nextcolumn++) {
              isLegalMove = isLegalMoves(row,column,nextrow,nextcolumn,tempPiece,isItBlackTurn);
              isSlotfree = isSlotAvialble(nextrow, nextcolumn);
              if (isLegalMove && isSlotfree) 
                   return false;
       }
      }
      }
    } 
    displayModalMessege("   Draw!   ");
    return true
  }
  function getMiddleSlot(row, column, nextrow, nextcolumn) {
    let middleSlotIdRow = nextrow > row ? nextrow - 1 : row - 1;
    let middleSlotIdColumn = nextcolumn > column ? nextcolumn - 1 : column - 1;
    return (middleSlotId = "" + middleSlotIdRow + middleSlotIdColumn);
  }
  function isLegalMoves(row,column,nextrow,nextcolumn,PieceColor,isItBlackTurn) {
    middleSlotId = getMiddleSlot(row, column, nextrow, nextcolumn);
    
    if ((isItBlackTurn && PieceColor === 'piece black') ||!isItBlackTurn&& PieceColor === 'king white'||isItBlackTurn&&PieceColor === 'king black') {
      if (nextrow - row === 1 &&(nextcolumn - column === 1 || nextcolumn - column === -1))
        return true;
  
      else if (nextrow - row === 2 &&(nextcolumn - column === 2 || nextcolumn - column === -2) &&(checkersPieces[middleSlotId]===(isItBlackTurn ?'piece white' : 'piece black')||
        checkersPieces[middleSlotId]===(isItBlackTurn ? 'king white' :'king black')))
        return true;
    }
    //////white player
    if ((!isItBlackTurn &&PieceColor === 'piece white') || !isItBlackTurn&&PieceColor === 'king white'||isItBlackTurn&&PieceColor === 'king black') {
      if (nextrow - row === -1 &&(nextcolumn - column === 1 || nextcolumn - column === -1))
        return true;
  
      if (nextrow - row === -2 &&(nextcolumn - column === 2 || nextcolumn - column === -2) &&(checkersPieces[middleSlotId]===(isItBlackTurn ?'piece white' : 'piece black')||
          checkersPieces[middleSlotId]===(isItBlackTurn ? 'king white' :'king black')))
        return true;
    }
    return false;
  }
  function isMyTurn(firstPiece, isItBlackTurn) {
  
    if (isItBlackTurn&&(checkersPieces[firstPiece]==='piece black'||isItBlackTurn&&checkersPieces[firstPiece]==='king black')||
      (!isItBlackTurn&&(checkersPieces[firstPiece]==='piece white'||!isItBlackTurn&&checkersPieces[firstPiece]==='king white')))
      {
      return true;
    }
    return false
  }
  function checkPiecesColor(Piece) {
    return PieceColor=checkersPieces[Piece.id];
  }
  function promotion(SecondClickId, firstClickId) {
    if(!(checkersPieces[SecondClickId]==='king black'||checkersPieces[SecondClickId]==='king black'))
      if ((isItBlackTurn && SecondClickId[0] === '8') ||(!isItBlackTurn && SecondClickId[0] === '1')) 
        addKingToBoard(SecondClickId);
  }
  function restoreVaribles() {
    isLegalMove = false;
    SecondClickId = null;
    firstClickId = null;
    middleSlotId = null;
    isValidEat = false;
    justEat = false;
    isPieceCanEat = false;
  }
  function makeMove(firstClickId, middleSlotId, SecondClickId) {
    if(checkersPieces[firstClickId]==='king black'||checkersPieces[firstClickId]==='king white')
      addKingToBoard(SecondClickId);
  else
    addPiecesToBoard(SecondClickId);
    if (SecondClickId !== middleSlotId)
    {   
        RemovePiecesFromBoard(middleSlotId);
    }
    RemovePiecesFromBoard(firstClickId);
  }
  function isSlotAvialble(nextrow, nextcolumn) {
    if(checkersPieces[""+nextrow+nextcolumn]==='piece none')
    return true
  
    return false;
  }
  function piecesMustEat(row, column, nextrow, nextcolumn) {
    piecesCanEat.push("" + row + column + nextrow + nextcolumn);
  }
  function isPieceCanEatAgain(SecondClickId,isItBlackTurn) {
    let row = SecondClickId[0] * 1;
    let column = SecondClickId[1] * 1;
    isLegalMove = false;
    const directions = [(row + 2), (column - 2), (row - 2), (column - 2), 
      (row + 2), (column + 2), (row - 2),(column + 2)];
    for (let i = 0; i < 8;i+=2 ) {
      if (directions[i] < 9 && directions[i + 1] < 9 && directions[i] > 0 && directions[i + 1] > 0) {
        let isValidMove = isLegalMoves(row,column,directions[i],directions[i + 1],('king '+(isItBlackTurn?'black':'white')),isItBlackTurn);
        if (isValidMove) {
          if (isSlotAvialble(directions[i], directions[i + 1])) 
          {
            if(directions[i]>0&&directions[i]<9&&directions[i+1]>0&&directions[i+1]<9)
            {
            PlacesPieceMustGo.push("" + row + column + directions[i] + directions[i + 1]);
            piecesCanEat=[]
            isLegalMove = true;
            }
          
          }
        }
      }
    }
    if (isLegalMove) return true;
  
    return false;
  }
  function WaysPieceCanGo(row, column, nextrow, nextcolumn) {
    PlacesPieceCanGo.push("" + row + column + nextrow + nextcolumn);
  }
  
    function changeCellColor(color){
    for (let i = 1; i < 9; i++)
    for (let j = 1; j < 9; j++)
      document.getElementById(i + "" + j ).classList.remove(`${color}`);
    }
  function clearMarkedPlaces() {
    changeCellColor('green');
  }
  function clearBurnPlaces() {
    changeCellColor('burn');
  }
  function MarksSlotsCanGo() {
    if (PlacesPieceMustGo.length > 0) {
      ///if the piece get another turn shoe him the place he can go
      for (let items in PlacesPieceMustGo) {
        if (PlacesPieceMustGo[items][0] + PlacesPieceMustGo[items][1] ===firstClickId)
          document.getElementById(PlacesPieceMustGo[items][2] + PlacesPieceMustGo[items][3] ).classList.add("green");
      }
      return true;
    }
    for (let items in PlacesPieceCanGo) {
      if (
        PlacesPieceCanGo[items][0] + PlacesPieceCanGo[items][1] ===
        firstClickId
      )
        document
          .getElementById(
            PlacesPieceCanGo[items][2] + PlacesPieceCanGo[items][3] 
          )
          .classList.add("green");
    }
  }
  function setBtns() {
    const modal1 = document.getElementById("container-dialog");
    const rest_btn = document.getElementById("rest_btn");
    const draw_btn = document.getElementById("updateDetails1");
    const resign_btn = document.getElementById("updateDetails");
    const favDialog = document.getElementById("favDialog");
    const no_btn = favDialog.querySelector("#no_btn");
    const yes_btn = favDialog.querySelector("#yes_btn");
  
    draw_btn.addEventListener("click", (e) => {
      favDialog.showModal();
      restClicks();
      clearMarkedPlaces();
      document.getElementById("id_label").innerHTML = 'Do you agree?';
    });
    yes_btn.addEventListener("click", (e) => {
      let audio = new Audio("images/gameover.wav");
      audio.play();
      displayModalMessege('game over')
      
        
    });
    no_btn.addEventListener("click", (e) => {
      favDialog.style.hidden = true;
    });
    resign_btn.addEventListener("click", (e) => {
      restClicks();
      clearMarkedPlaces();
      favDialog.showModal();
      document.getElementById("id_label").innerHTML = 'Are you sure?';
    });
  }
  function isPieceEatsOpponent() {
    for(let i=0;i<2;i++){
      const ArrayPieces=(i===0)?piecesCanEat:PlacesPieceMustGo;
      
      for (let items in ArrayPieces) {
        if (firstClickId + SecondClickId === ArrayPieces[items])
          return true;
      }
    }
  }
  function burnPiecesAbleToEat() {
    let isCurrentPieceCanEat = false;
    for(let j=0;j<2;j++){
   const ArrayPieces=(j===0)?piecesCanEat:PlacesPieceMustGo;
    for (let i = 0; i < ArrayPieces.length; i++) {
      RemovePiecesFromBoard("" + ArrayPieces[i][0] + ArrayPieces[i][1]);
  
      if (firstClickId === ArrayPieces[i][0] + ArrayPieces[i][1])
        isCurrentPieceCanEat = isCurrentPieceCanEat||true;
  
      BurnsSlots("" + ArrayPieces[i][0] + ArrayPieces[i][1]); 
      if (isCurrentPieceCanEat){     
        RemovePiecesFromBoard(SecondClickId);
    }
    }
    }
  }
  function restArray() {
    PlacesPieceCanGo = [];
    piecesCanEat = [];
    PlacesPieceMustGo = [];
  }
  function displayModalMessege(message) {
  
    document.getElementById("favDialog").innerHTML = message;
    document.getElementById("favDialog").innerHTML += '<br><button id="rest_btn">Restart</button>';
  
    rest_btn.addEventListener("click", (e) => {
      location.reload();
    });
  
    favDialog.showModal();
  }
  function changeTurn() {
    if (justEat&&isPieceCanEatAgain(SecondClickId,isItBlackTurn))
      return false;
  
    isItBlackTurn = !isItBlackTurn;
    numberOfTurns++;
  }
  function isPieceHaveToEatAnother() {
    ///in case the piece get another turn to eat another piece.this function return false if he doesnt do that.
    for (let items = 0; items < PlacesPieceMustGo.length; items++) {
      if (
        PlacesPieceMustGo[items][0] + PlacesPieceMustGo[items][1] ===
          firstClickId &&
        PlacesPieceMustGo[items][2] + PlacesPieceMustGo[items][3] ===
          SecondClickId
      ) {
        return true;
      }
    }
    swal({
     text: "You have to eat",
     color:"#140c05",
     background:"#00FF00",
     timer:"2000",
  
    });
    return false;
  }
  function RemovePiecesFromBoard(LocationOfThePiece) {
    document.getElementById(LocationOfThePiece).innerHTML = ' ';
    checkersPieces[LocationOfThePiece]='piece none'
    }
  function addPiecesToBoard(LocationOfThePiece) {
  
    const piece = document.createElement("button");
    piece.id =LocationOfThePiece;
    piece.classList.add('piece',(isItBlackTurn ? 'black' : 'white'));
    document.getElementById(LocationOfThePiece).appendChild(piece)
    checkersPieces[LocationOfThePiece]='piece '+(isItBlackTurn?'black':'white');
  }
  function addKingToBoard(LocationOfThePiece) {
    document.getElementById(LocationOfThePiece).innerHTML = ' ';
    const piece = document.createElement("button");
    piece.innerHTML = "K";
    piece.classList.add('king',(isItBlackTurn ? 'black' : 'white'));
    document.getElementById(LocationOfThePiece).appendChild(piece)
    piece.id =LocationOfThePiece;
    checkersPieces[LocationOfThePiece]='king '+(isItBlackTurn?'black':'white');
  }
  function isfirstClickValid(event) {
    if (checkersPieces[event.target.id]===('piece none'))
     return false;
    clearMarkedPlaces();
    if (event.target.id == null ||
      SecondClickId !== null ||event.target.id==''||event.target.id==undefined||
      event.target.id.length > 2
    ) {
      restClicks()
      return false;
    }
    return true;
  }
  function isSecondClickValid(event) {
    if (firstClickId === null || event.target.id == null ||event.target.id==''||
      event.target.id.length > 2) {
      restClicks()
      return false;
    }
     else if (checkersPieces[event.target.id]===('piece none') && firstClickId !== null)
      return true;
    return false;
  }
  function BurnsSlots(LocationOfThePiece) {
    document.getElementById(LocationOfThePiece).classList.add('burn');
  }
  function restClicks(){
    firstClickId = null;
    SecondClickId = null;
  }
  
  
  
  
  
  
