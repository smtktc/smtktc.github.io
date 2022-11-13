
var numOfMeteors = 10;
var meteors = Array();
var player;

var wordList = fruits;

var currentGuess = '';
var guessTime = 1000; // in milliseconds
var lastTime = 0; // millisecond time of last key press

function setup() {
  createCanvas(1200, 600);
  //createCanvas(windowWidth, windowHeight);
  frameRate(30);
  background(100);
  angleMode(DEGREES)

  player = new PlayerBase();
  player.update();

  for (var i=0;i<numOfMeteors;i++) {
      let randomWord = wordList[Math.floor(Math.random()*wordList.length)];
      let pos = [Math.random()*(width-100) + 100 , -Math.random()*500]
      meteors[i] = new Meteor(pos[0],pos[1],randomWord)
  }
}

function draw() {
  background(100);
  strokeWeight(2);
  
  COLLIDERS.checkCollisions();

  player.update();

  meteors.sort((a,b) => b.position.y-a.position.y);

  for (var i=0;i<meteors.length;i++) {



    if(!meteors[i].isSolved) {
      if(meteors[i].checkAnswer(currentGuess)) {

        currentGuess = '';
        player.fire(meteors[i]);
                
      }
    }

    if(meteors[i].isAlive) {
      meteors[i].update()
    }
  }

  for (var i=0;i<meteors.length;i++) {
    if(!meteors[i].isAlive){
      meteors.splice(i,1);

      randomWord = wordList[Math.floor(Math.random()*wordList.length)];
      pos = [Math.random()*(width-100) + 100 , -Math.random()*500];
      meteors.push(new Meteor(pos[0],pos[1],randomWord));

    }
  }

  if (((millis() - lastTime) > guessTime)) {
    currentGuess = '';
    lastTime = 0;
  }

  fill(50,255,50);
  stroke(0,0,0);
  strokeWeight(10);
  textSize(32);
  text(currentGuess,300,570)

}

  

function keyTyped() {
  if (key == "Enter") {lastTime=0;}
  else {
    currentGuess += key;
    lastTime = millis();
  }


}

function keyPressed() {
  if (key === 'Backspace') {
    currentGuess = currentGuess.substring(0,currentGuess.length-1)
    //lastTime = 0;
    lastTime = millis();
  }
}