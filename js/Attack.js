class Attack {
	constructor(id, percent, launch, angle, hitStun, projectile, x=0, y=0) {
		this.hits = new Hitbox(this, new Rect(0, 0, 0, 0));
		
		this.x = x;
		this.y = y;
		
		this.dx = 0;
		this.dy = 0;
		
		this.type = "";
		
		this.id = id;
		
		this.players = [false, false, false, false];
		
		this.end = 0;
		this.startup = 0;
		this.percent = percent;
		this.launch = launch;//The slope of the launch function (+1*launch for every 10%)
		this.angle = angle;
		this.projectile = projectile;
		this.hitStun = hitStun;
		this.length = 0;
		this.launchS = 0;//The starting launch at 0%
		this.landing = 6;
		this.aerial = true;
		this.grab = false;
		
		this.maintain = false;//If true, keep hurting the player every frame
		this.follow = true;//If the hitbox follows the player
	}
	
	attack(p) {
		p.fallen = false;
		
		p.percent += this.percent;
		
		p.hitStun = this.hitStun;
		p.launched = this.launch * p.percent / 10 + this.launchS;
		if(p.launched > 3 && p.angle > Math.PI/6 && p.angle < Math.PI*5/6 && this.percent > 0) {
			p.tumble = true;
		}
		p.angle = this.angle;
		
		let dy = Math.sin(this.angle);
		let dx = Math.cos(this.angle);
		
		p.dx = dx*(this.launch*p.percent/10+this.launchS);
		p.dy = -dy*(this.launch*p.percent/10+this.launchS);
		
		if(!this.maintain) {
			this.players[p.id] = true;
		}
		
		p.edgeWait = 15;
		p.onEdge = false;
		
		if(this.percent > 0) {
			p.action = "";
		}
	}
	
	attackShield(p) {
		p.shieldHealth -= this.percent;
		
		p.hitStun = this.hitStun;
		
		//let dy = Math.sin(this.angle);
		let dx = Math.cos(this.angle)/3;
		
		p.dx = dx*(this.launch*p.percent/20+this.launchS);
		//p.dy = -dy*(this.launch*p.percent/20+this.launchS);
		
		if(!this.maintain) {
			this.players[p.id] = true;
		}
	}
	
	resetPlayers() {
		this.players = [false, false, false, false];
	}
	
	static createAttack(player) {
		player.tumble = false;
		return new Attack(player.id, 0, 0, 0, 1, false, player.x, player.y);
	}
	
	setGrab(yes) {
		this.grab = yes;
		this.maintain = yes;
		return this;
	}
	
	setAerial(yes) {
		this.aerial = yes;
		return this;
	}
	
	setType(string) {
		this.type = string;
		return this;
	}
	
	setVelocity(dx, dy) {
		this.dx = dx;
		this.dy = dy;
		return this;
	}
	
	setLanding(num) {
		this.landing = num;
		return this;
	}
	
	setLength(num, start, end) {
		this.length = num;
		this.startup = start;
		this.end = end;
		return this;
	}
	
	setPercent(num) {
		this.percent = num;
		return this;
	}
	
	setLaunch(num, num2, angle) {
		this.launch = num;//ax
		this.launchS = num2;// + b
		this.angle = angle;//The angle of the launch
		return this;
	}
	
	setHits(...boxes) {
		this.hits.hits = boxes;
		this.hits.resetMain();
		return this;
	}
	
	setProjectile(yes) {
		this.projectile = yes;
		return this;
	}
	
	setHitStun(num) {
		this.hitStun = num;
		return this;
	}
	
	setMaintain(yes) {
		this.maintain = yes;
		return this;
	}
	
	setFollow(yes) {
		this.follow = yes;
		return this;
	}
}
