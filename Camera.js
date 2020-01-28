class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.scale = 1;
	}
	
	move(players) {
		let sumX = 0;
		let sumY = 0;
		for(var i = 0;i < players.length;i ++) {
			let p = players[i];
			
			sumX -= p.x;
			sumY -= p.y;
			
			if(p.y < this.inup() && this.scale > 0.9) {
				this.scale /= 1.005 * 1.005;
			}
			
			if(p.x > this.inleft() && p.x < this.inright()) {
				this.scale *= 1.005;
			}
			if(p.x < this.left() || p.x > this.right()) {
				this.scale /= 1.005;
			}
			
			if(p.y > this.down()) {
				//this.scale /= 1.01;
			}
			
			if(p.y > this.inup()) {
				//this.scale *= 1.01;
			}
			if(p.y < this.indown()) {
				//this.scale *= 1.01;
			}
		}
		
		sumX /= players.length;
		sumY /= players.length + 1;
		
		this.x = (7*this.x + sumX)/8;
		this.y = (7*this.y + sumY)/8;
		
		this.x = constrain(this.x, -350*this.scale, 300*this.scale);
		this.y = constrain(this.y, -150*this.scale, 300*this.scale);
		
		this.scale = constrain(this.scale, 0.6, 1.8);
	}
	
	left() {
		return -this.x - 200 / this.scale;
	}
	
	right() {
		return -this.x + 200 / this.scale;
	}
	
	up() {
		return -this.y - 250 / this.scale;
	}
	
	down() {
		return -this.y + 150 / this.scale;
	}
	
	inleft() {
		return -this.x - 50 / this.scale;
	}
	
	inright() {
		return -this.x + 50 / this.scale;
	}
	
	inup() {
		return -this.y - 175 / this.scale;
	}
	
	indown() {
		return -this.y + 100 / this.scale;
	}
}