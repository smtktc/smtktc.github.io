class Collider {
	constructor(object, position, size, layer, mask) {
		// shape is always a circle

		// position is an x/y array
		this.position = position;
		// size is the radius
		this.size = size;

		this.layer = layer;
		this.mask = mask;
		this.isAlive = true;

		this.object = object;

		this.collisions = [];
	}

	draw() {
		stroke(0,0,255);
		fill(0,0,0,0);
		circle(this.position.x, this.position.y, this.size);	}
}

class Colliders {
	constructor(debug = false) {
		this.colliders = [];
		this.debug = debug;
	}

	newCollider(object, position, size, layer = 0, mask = 15) {
		let c = new Collider(object, position, size, layer, mask);
		this.colliders.push(c)
		return c;
	}

	allColliders() {
		return this.colliders;
	}

	numberOfColliders() {
		return this.colliders.length;
	}

	checkCollisions() {

		for (var i=0;i<this.colliders.length;i++) {
			var c1 = this.colliders[i];
			c1.collisions = [];
			for (var j=0;j<this.colliders.length;j++) {
				var c2 = this.colliders[j];
				
				if (this.debug){
					c1.draw();
					stroke(0,0,255);
					strokeWeight(1);
					line(c1.position.x,c1.position.y,c2.position.x,c2.position.y)
				}

				if ((c1 != c2) && (c2.layer & c1.mask)) {

					var dist = Math.sqrt(Math.pow(c1.position.x-c2.position.x,2)+Math.pow(c1.position.y-c2.position.y,2));

					if ((dist < ((c1.size + c2.size)*0.5)) && !c1.collisions.includes(c2)) {
						c1.collisions.push(c2);
					}
				}
			}	
		}

		for (var i=this.colliders.length-1;i>=0;i--) {
			if (!this.colliders[i].isAlive) {
				this.colliders.splice(i,1)
			}
		}

	}

}

const COLLIDERS = new Colliders(false);