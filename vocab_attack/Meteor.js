class Meteor {
	constructor(x,y,word) {
		this.word = word[0];
		this.answer = word[1]; // correct answer for the word
		this.guess = ''; // current guess
		this.damage = 5;

		this.position = createVector(x,y);
		this.speed = createVector();
		this.angle = Math.random()*10 - 5; 

		this.speed.x = sin(this.angle);
		this.speed.y = cos(this.angle);
		this.speed.mult(2*Math.exp(-0.2*this.answer.length));

		this.size = this.answer.length * 5; // size of the meteor
		this.collider = COLLIDERS.newCollider(this, this.position, this.size, 1,14); // layer : 0001 / mask : 0110

		this.color = lerpColor(color(100, 50, 0,200), color(0, 50, 100,200), Math.random());
		
		this.isAlive = true;
		this.isSolved = false;
	}

	update() {
		// at each game frame, it should move down towards the planet

		// draw the meteor
		fill(this.color,100);
		circle(this.position.x,this.position.y,this.size);

		fill(255);
		textSize(16);
		textAlign(CENTER);
		text(this.word, this.position.x, this.position.y + this.word.length + 25)

		if (this.isSolved){
			fill(50,255,50);
			textSize(16);
			textAlign(CENTER);
			text(this.answer, this.position.x, this.position.y + this.word.length + 41)
		}		

		this.position.add(this.speed);

		for(let i=0;i < this.collider.collisions.length;i++) {
			this.collider.collisions[i].object.takeDamage(this.damage);
			this.takeDamage()
		}

	}

	checkAnswer(currentGuess) {
		this.guess = currentGuess;
		if (this.guess.length>0 && this.answer.startsWith(this.guess)) {
			fill(255);
			textSize(16);
			textAlign(CENTER);
			text(this.guess, this.position.x, this.position.y + this.word.length + 41)
		}

		if (this.answer === this.guess){
			this.isSolved = true;
		}

		return this.isSolved;
	}

	takeDamage() {
		this.collider.isAlive = false;
		this.isAlive = false;
	}


}