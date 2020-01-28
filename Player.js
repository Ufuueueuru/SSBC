class Player {
	constructor(player) {
		this.id = player;
		
		this.con = new Controls(this);//controls
		
		this.hit = new Hitbox(this, new Rect(0, 0, 26, 32));
		
		this.hitStun = 0;//How long the launch lasts
		this.launched = 0;//The intensity of the launch
		this.angle = 0;//The angle of the launch
		
		this.x = 0;
		this.y = 0;
		
		this.dx = 0;
		this.dy = 0;
		
		this.dir = 0;
		
		this.inv = 0;//Invincibility
		this.ledgeInv = true;
		
		this.percent = 0;
		
		this.projectiles = 0;
		
		this.ground = false;//If you are touching the ground
		this.fastFall = 0;//If you are fastfalling
		this.fallThrough = false;//True if falling through half-platforms
		
		this.onEdge = false;//If you are grabbing onto a ledge
		this.edgeWait = 0;//Waits after leaving a ledge to snap back
		this.edge = {};//Object that shows where the edge is
		this.kickedOff = false;//True if another player goes onto the same edge
		
		this.doubleJump = 0;//How many air jumps you have left
		
		this.tumble = false;//If you are in the tumble animation
		this.fallen = false;//After a tumble, you fall onto the ground
		
		this.moving = 0;
		this.moveCheck = 0;//Goes up when not moving; buffers the turnaround animation
		
		this.footBuffer = 0;//Goes down every frame; If above zero checks for a footstool
		this.footLeft = 5;//Counts down to limit number of footstools in air
		
		this.attacking = "";//What attack you are currently doing
		
		this.action = "";
		this.actionLag = 0;
		
		this.shielding = false;
		
		this.spark = 0;
		
		this.turnAround = 0;//Prevents you from turning around super fast
		this.jumpSquat = 0;//Goes up to stop the player from jumping until it becomes 4
		//If you hold jump for shorter than this counter takes to reach zero, SHORT HOP
		
		//Character specific traits
		this.character = "Mario";
		this.airJumps = 1;//How many jumps in the air you have
		this.weight = 1;//This is a percent .5 = 50% Decreases launch speed
		this.walkSpeed = 0.7;//How much dx adds each walking frame
		this.runSpeed = 0.5;//This is added to walkSpeed
		this.airSpeed = 0.25;//How fast you move in the air
		this.fallSpeed = 1;//How much gravity affects you
		this.fastFallSpeed = 0.3;
		
		this.maxShieldHealth = 50;//Max health of shield
		this.shieldRegen = 0.1;
		
		this.shortHopPower = 8;
		this.jumpPower = 14;
		this.doubleJumpPower = 12;
		
		this.anim = new Sequence(marioSheet, 24, 24);//The animation object of the player
		this.anim.animations = mario.animations;//Copy the anims from the desired animations array
		
		this.invAnim = new Sequence(invMarioSheet, 24, 24);
		this.invAnim.animations = mario.animations;
		
		this.displayHeight = 32;
		this.displayWidth = 32;
		//Character specific traits
		
		this.shieldHealth = 50;//The health of the shield
		
		this.spec = {...marioChar.spec};//Specific values for individual characters
		
		this.attacks = marioChar.attacks;
	}
	
	draw() {
		//fill(0);
		//rect(this.x, this.y, 32, 32);
		//this.hit.draw();
		push();
		translate(this.x, this.y-8);
		
		if(this.dir) {
			scale(-1, 1);
		}
		
		if(this.inv === 0 || frameCount % 10 < 3) {
			//this.anim.draw(this.x, this.y - 8, 48, 48);
			this.anim.draw(0, 0, 48, 48);
		} else {
			//this.invAnim.draw(this.x, this.y - 8, 48, 48);
			this.invAnim.draw(0, 0, 48, 48);
		}
		
		if(this.spark > 0) {
			image(spark.get(12-this.spark), 9, -4, 14, 14);
		}
		
		pop();
	}
	
	collideAttack(at) {
		for(var i = at.length-1;i >= 0;i --) {
			let a = at[i];
			
			if(this.attacking === "dash") {
				this.attacks.dash.run(this, a);
			}
			if(this.attacking === "jab") {
				this.attacks.jab.run(this, a);
			}
			if(this.attacking === "nair" || a.type === "nair") {
				this.attacks.nair.run(this, a);
			}
			if(this.attacking === "dair" || a.type === "dair") {
				this.attacks.dair.run(this, a);
			}
			if(this.attacking === "fair" || a.type === "fair") {
				this.attacks.fair.run(this, a);
			}
			if(this.attacking === "uair" || a.type === "uair") {
				this.attacks.uair.run(this, a);
			}
			if(this.attacking === "bair" || a.type === "bair") {
				this.attacks.bair.run(this, a);
			}
			if(this.attacking === "nspecial" || a.type === "nspecial") {
				this.attacks.nspecial.run(this, a);
			}
			if(this.attacking === "dspecial" || a.type === "dspecial") {
				this.attacks.dspecial.run(this, a);
			}
			if(this.attacking === "fspecial" || a.type === "fspecial") {
				this.attacks.fspecial.run(this, a);
			}
			if(this.attacking === "uspecial") {
				this.attacks.uspecial.run(this, a);
			}
			
			//text(a.launchS, 0, -300);
			
			if(a.id === this.id) {
				if(a.follow) {
					a.x = this.x;
					a.y = this.y;
				} else {
					if(a.startup === 0) {
						a.x += a.dx;
						a.y += a.dy;
					}
					if(a.projectile && a.startup !== 0) {
						a.x = this.x;
						a.y = this.y;
					}
				}
				
				if((this.action === "get up" || this.onEdge) && !a.projectile && a.aerial) {
					if(this.action === "get up") {
						this.actionLag = a.landing;
					}
					if(a.projectile) {
						this.projectiles --;
					}
					at.splice(i, 1);
					this.attacking = "";
				} else {
					if(a.startup > 0) {
						a.startup --;
					} else if(a.length > 0) {
						a.length --;
						//a.hits.draw();//debug
					} else if(a.end > 0) {
						a.end --;
					} else {
						if(a.projectile) {
							this.projectiles --;
						}
						at.splice(i, 1);
						if(!a.projectile) {
							this.attacking = "";
						}
					}
				}
			} else {
				let okay = true;//makes it not crash if the projectile disappears
				if(!a.players[this.id] && a.startup === 0 && a.length > 0 && !this.shielding && this.inv === 0) {
					if(a.hits.broad(this.hit)) {//broad phase
						if(collideHitHit(a.hits, this.hit)) {//narrow phase
							a.attack(this);//If they collide, attack the player
							if(a.projectile && !a.maintain) {
								players[a.id].projectiles --;
								at.splice(i, 1);
								okay = false;
							}
						}
					}

				}
				if(this.shielding && !a.players[this.id] && a.startup === 0 && a.length > 0 && okay) {
					if(a.hits.broad(this.hit)) {//broad phase
						if(collideHitHit(a.hits, this.hit)) {//narrow phase
							a.attackShield(this);
							if(a.projectile && !a.maintain) {
								players[a.id].projectiles --;
								at.splice(i, 1);
							}
						}
					}
				}
			}
		}
	}
	
	setAnimation(num) {//id for animation
		this.anim.setAnimation(num);
	}
	
	setAnimate(string) {//string for name of animation
		this.anim.setAnimation(animate(string));
	}
	
	setCharacter(name) {//name should be a character object (see Character.js)
		this.character = name.character;
		this.airJumps = name.airJumps;//How many jumps in the air you have
		this.weight = name.weight;//This is a percent .5 = 50% Decreases launch speed
		this.walkSpeed = name.walkSpeed;//How much dx adds each walking frame
		this.runSpeed = name.runSpeed;//This is added to walkSpeed
		this.airSpeed = name.airSpeed;//How fast you move in the air
		this.fallSpeed = name.fallSpeed;//How much gravity affects you
		this.fastFallSpeed = name.fastFallSpeed;
		
		this.maxShieldHealth = name.maxShieldHealth;//Max health of shield
		this.shieldRegen = name.shieldRegen;
		
		this.shortHopPower = name.shortHopPower;
		this.jumpPower = name.jumpPower;
		this.doubleJumpPower = name.doubleJumpPower;
		
		this.anim = new Sequence(name.sheet, name.frameWidth, name.frameHeight);
		this.anim.animations = name.sequence.animations;
	}
	
	actionFree() {
		switch(this.action) {
			case "shield":
				return false;
			case "brokenShield":
				return false;
			case "dropShield":
				return false;
			case "get up":
				return false;
			case "groundFoot":
				return false;
			case "roll right":
				return false;
			case "roll left":
				return false;
			case "spot dodge right":
				return false;
			case "spot dodge left":
				return false;
			case "off ledge right":
				return false;
			case "off ledge left":
				return false;
			case "roll up right":
				return false;
			case "roll up left":
				return false;
			case "land lag":
				return false;
			case "free fall":
				return false;
		}
		if(this.hitStun > 0) {
			return false;
		}
		if(this.attacking !== "") {
			return false;
		}
		if(this.shielding) {
			return false;
		}
		if(this.onEdge) {
			return false;
		}
		if(this.fallen) {
			return false;	
		}
		if(this.jumpSquat > 0) {
			return false;
		}
		return true;
	}
}