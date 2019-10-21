var myBorder;
var borderHeight = 30;
var myHeight =  window.innerHeight - 40;
var myWidth = window.innerWidth - 40;

var myPiece; 
var pieceHeight = 70;
var pieceWidth = 20;
var pieceYPosition = 100;
var pieceUpPosition = myHeight / 2 - borderHeight / 2 - pieceHeight;
var pieceDownPosition = myHeight / 2 + borderHeight / 2;

var myObstacles = [];
var obstacleHeight = 30;
var obstacleWidth = 20;
var obstacleSpeed = 4;
var obsMinDistance = 150;
var obsMaxDistance = 151;
var dist;

var myCoins = [];
var coinSize = 20;
var distCoin;
var coinMinDistance = 150;
var coinMaxDistance = 151;
var coinsScore = 0;
var coinsMissed = 0;

var gameEnd = false;
var finalText1;
var finalText2;
var finalText3;
var finalText4;
var myScore;
var myCoinsScore;
var myCoinsMissedText;
var instruction;
var deathSound;
var switchSound;


function startGame() {
    obstacleSpeed = 4;
    myBorder = new component(myWidth, borderHeight, "black", 0, myHeight / 2 - borderHeight / 2);
    myPiece = new component(pieceWidth, pieceHeight, "green", pieceYPosition, pieceUpPosition);
    myScore = new component("30px", "Consolas", "black", 100, 50, "text");
    myCoinsScore = new component("30px", "Consolas", "black", 100, 100, "text");
    myCoinsMissed = new component("30px", "Consolas", "black", 100, 150, "text");
    instruction = new component("30px", "Consolas", "red", 100, myHeight - 100, "text");
    myObstacles = [];
    myCoins = [];
    console.log("speed: " + obstacleSpeed);
    obsMinDistance = 300;
    obsMaxDistance = 400;
    //obstacleSpeed = 4;
    dist = 0;
    distCoin = 0;
    deathSound = new Audio();
    switchSound = new Audio();
    deathSound.src = "dead.wav";
    switchSound.src = "switch.wav";


    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = myWidth;
        this.canvas.height = myHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type = type;

    this.update = function() {
        ctx = myGameArea.context;

        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.detectCrash = function(otherobj) {
        var myRight = this.x + this.width;
        var myLeft = this.x;
        var hisRight = otherobj.x + otherobj.width;
        var hisLeft = otherobj.x;
        var amIUp = this.y < myHeight / 2;
        var isHeUp = otherobj.y < myHeight / 2;
        if(amIUp == isHeUp && (hisLeft <= myRight && hisRight >= myLeft)) {
            return true;
        }

        return false;
    }



}

function updateGameArea() {
    var x, y, rand;
    myGameArea.clear();

    if(dist <= 0) {
        dist = Math.floor(obsMinDistance + Math.random() * (obsMaxDistance - obsMinDistance)); 
        // losowanie dystansu miedzy przeszkodami
    }
    else dist -= obstacleSpeed;

    if(distCoin <= 0) {
        distCoin = Math.floor(coinMinDistance + Math.random() * (coinMaxDistance - coinMinDistance)); 
        // losowanie dystansu miedzy przeszkodami
    }
    else distCoin -= obstacleSpeed;
    


    for (i = 0; i < myObstacles.length; i += 1) {  // sprawdzanie kolizji
        if (myPiece.detectCrash(myObstacles[i])) {
            gameEnd = true;
            deathSound.play();
            break;
        } 
    }

    for (i = 0; i < myCoins.length; i += 1) {  // sprawdzanie kolizji
        if (myPiece.detectCrash(myCoins[i])) {
            
            coinsScore +=1;

            myCoins.splice(i, 1);

            break;
        } 
    }

    if(!gameEnd) {
        myGameArea.frameNo += 1;

        if (myGameArea.frameNo == 1 || dist <= 0) {
            // dodawanie przeszkody
            x = myWidth - obstacleWidth;
            rand = Math.floor(Math.random()*2) >= 1;
            if(rand)
                y = myHeight / 2 - borderHeight / 2 - obstacleHeight;
            else
                y = myHeight / 2 + borderHeight / 2;
            myObstacles.push(new component(obstacleWidth, obstacleHeight, "red", x, y));  
        }

        if (distCoin <= 0) {
            // dodawanie monety
            x = myWidth - coinSize;
            rand = Math.floor(Math.random()*2) >= 1;
            if(rand)
                y = myHeight / 2 - borderHeight / 2 - coinSize;
            else
                y = myHeight / 2 + borderHeight / 2;
            myCoins.push(new component(coinSize, coinSize, "yellow", x, y));  
        }



        if(myGameArea.frameNo <= 300)
        {
            // instrukcja na poczatku gry
            instruction.text = "Click on the screen to change position and avoid obstacles";
            instruction.update();
        }

        if(myGameArea.frameNo % 500 == 0) {
            // "zwiekszanie" trudnosci

            if(obstacleSpeed < 15) {
                if(obstacleSpeed < 8) {
                    obstacleSpeed += 2;
                }
                else {
                    obstacleSpeed += 1;
                }
            }

            if(obsMinDistance >= 120) {
                obsMinDistance -= 30;
            }

            if(obsMaxDistance >= 250) {
                obsMiaxDistance -= 20;
            }

        }

        for (i = 0; i < myObstacles.length; i += 1) {
            if(i == 0 && myObstacles[i].x <= 0)
            {
                // usuwanie przeszkody (nie wiem czy potrzebne xd)
                myObstacles.shift();
            }
            myObstacles[i].x -= obstacleSpeed;
            myObstacles[i].update();
        }


        for (i = 0; i < myCoins.length; i += 1) {
            if(i == 0 && myCoins[i].x <= 0)
            {
                // usuwanie monety (nie wiem czy potrzebne xd)
                myCoins.shift();
                coinsMissed +=1;
            }
            myCoins[i].x -= obstacleSpeed;
            myCoins[i].update();
        }

        myScore.text="SCORE: " + myGameArea.frameNo;
        myScore.update();
        myCoinsScore.text="COINS: " + coinsScore;
        myCoinsScore.update();
        myCoinsMissedText.text="COINS MISSED: " + coinsMissed;
        myCoinsMissedText.update();
        myBorder.update();
        myPiece.update();
    }
    else{
        // ekran konca gry
        finalText1 = new component("40px", "Consolas", "red", 100, 100, "text");
        finalText1.text = "Your score: " + myGameArea.frameNo;
        finalText1.update();
        finalText2 = new component("40px", "Consolas", "red", 100, 150, "text");
        finalText2.text = "Coins collected: " + coinsScore;
        finalText2.update();
        finalText3 = new component("40px", "Consolas", "red", 100, 200, "text");
        finalText3.text =  "Coins missed: " + coinsMissed;
        finalText3.update();
        finalText4 = new component("40px", "Consolas", "red", 100, 250, "text");
        finalText4.text =  "Click to reset game";
        finalText4.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function canvasClicked() {
    if(!gameEnd) {
        if(myPiece.y == pieceUpPosition)
            myPiece.y = pieceDownPosition;
        else
            myPiece.y = pieceUpPosition;
        switchSound.play();
    }
    else{
        gameEnd = false;
        //document.location.reload();
        startGame();
    }
}
