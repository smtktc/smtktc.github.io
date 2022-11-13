class PlayerBase {
	constructor() {
		this.position = createVector(0.5*width,0.75*height+2*width);		
		this.currentHP = 100; // hp of the base
		this.isAlive = true;

		this.collider = COLLIDERS.newCollider(this, this.position, width * 4, 4,15); // layer : 0100 / mask : 1111

		this.shield = new Shield(this.position.x,this.position.y,width * 4.2)

		this.weapons = [];
		this.weapons[0] = new Weapon(this.position.x+2*width*sin(5)		,this.position.y-2*width*cos(5));
		this.weapons[1] = new Weapon(this.position.x+2*width*sin(10)	,this.position.y-2*width*cos(10));
		this.weapons[2] = new Weapon(this.position.x+2*width*sin(0)		,this.position.y-2*width*cos(0));
		this.weapons[3] = new Weapon(this.position.x+2*width*sin(-5)	,this.position.y-2*width*cos(-5));
		this.weapons[4] = new Weapon(this.position.x+2*width*sin(-10)	,this.position.y-2*width*cos(-10));
	}

	update() {
		// draw the base

		// draw weapons and kill them if they don't have hp
		for (let i=this.weapons.length-1;i>=0;i--) {
			this.weapons[i].update();
			if (this.weapons[i].currentHP <= 0) {
				this.weapons[i].collider.isAlive = false;
				this.weapons.splice(i,1);
			}
		}

		// draw the planet
		fill(200);
		stroke(0);
		circle(this.position.x,this.position.y, width * 4);

		// draw the shield
		if (this.shield.isAlive){
			this.shield.update();
		}

		// check hp
		if (this.currentHP <= 0) {
			this.isAlive = false;
		}

	}

	fire(target) {
		if (this.currentHP > 0) { // if the planet is still alive
			let weapon = this.weapons.concat().sort((a,b) => (Math.abs(a.position.x-target.position.x)-Math.abs(b.position.x-target.position.x)))[0];
			weapon.fire(target);
		}
	}

	takeDamage(damage) {
		this.currentHP -= damage;
	}
}

class Weapon {
	constructor(x,y) {
		this.position = createVector(x,y);
		this.currentHP = 10;
		this.collider = COLLIDERS.newCollider(this, this.position, 25, 4,15); // layer : 0100 / mask : 1111
		this.shield = new Shield(x,y,100);

		this.missiles = [];
	}

	update() {
		// draw the weapon

		// update missiles
		for (let i=this.missiles.length-1;i>=0;i--) {
			if (this.missiles[i].isAlive){
				this.missiles[i].update();
			} else {
				this.missiles.splice(i,1);
			}
		}

		// draw the weapon
		fill(255,200,200,255);
		stroke(0);
		rect(this.position.x-10,this.position.y-20,20,50)

		// update the shield
		if (this.shield.isAlive){
			this.shield.update();
		}

	}

	fire(target) {
		let missile = new Missile(this, target);
		this.missiles.push(missile);
	}

	takeDamage(damage) {
		this.currentHP -= damage;
	}

}

class Missile {
  constructor(weapon, target) {
    this.position = createVector(weapon.position.x, weapon.position.y);
    this.target = target;
    this.vel = createVector(0,-5);
    this.acc = createVector();
    this.r = 8;
    this.maxspeed = 5;
    this.maxforce = 1;

    this.angle = 90;

    this.isAlive = true;

	this.collider = COLLIDERS.newCollider(this, this.position, this.r, 8,1); // layer : 1000 / mask : 0001

  }

  update() {
  	// steering behaviour

  	if (this.target) {
	    let desire = p5.Vector.sub(this.target.position, this.position);
	    let d = desire.mag();
	    var speed = this.maxspeed;

	    if (d < 100) {
	      speed = map(d, 0, 100, 3, this.maxspeed);
	    }

	    desire.setMag(speed);
	    let steer = p5.Vector.sub(desire, this.vel);
	    steer.limit(this.maxforce);
	    
	    // add steering force to acc
	    this.acc.add(steer);

	    // check for collisions
	    for (let i=0;i<this.collider.collisions.length;i++) {
	    	
	    	let collision = this.collider.collisions[i];
	    	if (collision.object === this.target) {
	    		this.target.takeDamage();
	    		this.collider.isAlive = false;
	    		this.isAlive = false;
	    	}
	    }

	    if (!this.target.isAlive) {
	    	this.target = null;
	    	this.collider.isAlive = false;
	    }

	}

    // calculate new position
  	this.position.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    
    // draw the missile
   	// Draw a triangle rotated in the direction of velocity
    this.angle = this.vel.heading() + 90;

    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    fill(200,100,100);
    stroke(255,0,0);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r);
    vertex(-this.r*0.4, this.r);
    vertex(this.r*0.4, this.r);
    endShape(CLOSE);

    pop();

    if (this.position.x < width*-1 || this.position.x > width*2 || this.position.y < height*-1 || this.position.y > height*2 ) {
		this.collider.isAlive = false;
		this.isAlive = false;
    }

  }

  takeDamage(damage){
  	// I don't know why but this has to be here
  }
}

class Shield {
	constructor(x,y, size) {
		this.position = createVector(x,y);
		this.currentHP = 100;
		this.size = size;
		this.collider = COLLIDERS.newCollider(this, this.position, this.size, 4,15); // layer : 0100 / mask : 1111
		this.isAlive = true;
	}

	update() {
		fill(0,0,100,this.currentHP*0.01*100);
		stroke(0,0,100);
		circle(this.position.x,this.position.y,this.size);
		if (this.currentHP <= 0) {
			this.collider.isAlive = false;
			this.isAlive = false;
		}

	}


	takeDamage(damage) {
		this.currentHP -= damage;
	}

}