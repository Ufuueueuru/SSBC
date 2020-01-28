function preload() {
	loadImages();
}

function setup() {
	createCanvas(600, 500);
	
	camera = new Camera();
	
	frameRate(60);
	
	rectMode(CENTER);
	imageMode(CENTER);
	
	noSmooth();
	
	loadSequences();
	
	world = new World(new Block(0, 0, 500, 200, 0), new Block(-120, -185, 85, 10, 1), new Block(120, -185, 85, 10, 1), new Block(0, -275, 85, 10, 1));
	
	players[0] = new Player(0);
	players[1] = new Player(1);
	players[2] = new Player(2);
	players[3] = new Player(3);
	//players[0].con.jump = new Control(this.player, 0, 16);
	players[1].con.jump = new Control(this.player, 0, 87);
	players[1].con.up = new Control(this.player, 0, 87);
	players[1].con.down = new Control(this.player, 0, 83);
	players[1].con.left = new Control(this.player, 0, 65);
	players[1].con.right = new Control(this.player, 0, 68);
	players[1].con.attack = new Control(this.player, 0, 70);
	players[1].con.special = new Control(this.player, 0, 71);
	players[1].con.shield = new Control(this.player, 0, 72);
	players[0].con.attack = new Control(this.player, 0, 190);
	players[0].con.special = new Control(this.player, 0, 188);
	players[0].con.shield = new Control(this.player, 0, 77);
	players[2].con.setPad(1);
	players[3].con.setPad(1);
	players[0].x = -100;
	players[0].y = -150;
	players[1].x = 100;
	players[1].y = -150;
	players[2].x = 550;
	players[2].y = -150;
	players[3].x = 550;
	players[3].y = -150;
	
	players.splice(2, 2);
	
	noStroke();
	
	textSize(15);
	
	textAlign(CENTER, CENTER);
}

function draw() {
	background(255);
	
	DKeys();
	
	gamepads = navigator.getGamepads();
	
	for(var i in players) {
		if(players[i].con.connect.pressed() && players[i].con.connect.type === 1) {
			players[i].con.setPad(1);
			players[i].con.connect.type = 0;//Might be temp
			players[i].con.connect.values = [13];//Might be temp
		}
		if(players[i].con.connect.pressed() && players[i].con.connect.type === 0) {//Might be temp
			players[i].con.setPad(0);
			players[i].con.connect.type = 1;
			players[i].con.connect.values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
		}
	}
	
	if(menu === "menu") {
		background(0);
		
		fill(255, 0, 0);
		textSize(50);
		text("Super Smash Bros. Cloud", 300, 100);
		
		fill(100, 100, 200);
		ellipse(100, 250, 100, 100);
		
		for(var i in players) {
			if(gamepads[i]) {
				fill(0);
				ellipse(100+gamepads[i].axes[0]*50, 250+gamepads[i].axes[1]*50, 10, 10);
			}
			fill(255);
			text(players[i].con.up.pressed(), 100, 70);
			text(players[i].con.right.pressed(), 130, 100);
			text(players[i].con.left.pressed(), 70, 100);
			text(players[i].con.down.pressed(), 100, 100);
			text(players[i].con.attack.pressed(), 170, 100);
			text(players[i].con.special.pressed(), 200, 100);
			text(players[i].con.shield.pressed(), 230, 100);
			text(players[i].con.grab.pressed(), 260, 100);
			text(players[i].con.jump.pressed(), 290, 100);
		}
		
		fill(255, 0, 0);
		textSize(30);
		
		text("Smash!", 100, 250);
		
		image(marioSheet, 200, 300, 400, 400);
		
		if(mouseIsPressed && dist(mouseX, mouseY, 100, 250) < 50) {
			menu = "fight";
		}
	}
	
	
	if(menu === "fight") {
		background(200);
		
		camera.move(players);
		
		push();
		translate(300 + camera.x * camera.scale, 275 + camera.y * camera.scale);
		scale(camera.scale);
		
		for(var i in players) {
			let p = players[i];//Making typing faster by passing a reference to the current player
			
			if(p.y > 300 || p.y < -700) {
				p.x = 0;
				p.y = -300;
				p.inv = 180;
				p.percent = 0;
				p.tumble = false;
				p.fallen = false;
			}
			
			p.anim.animate();
			
			p.invAnim.current = p.anim.current;
			p.invAnim.frame = p.anim.frame;
			
			p.draw();
			
			fill(0);
			
			if(p.hitStun === 0)
				text(round(p.percent*10)/10, -200 + 75*i, -300);
			
			fill(255, 0, 0, 100);
			
			if(p.actionFree() && p.turnAround <= 0 && !p.tumble && (!p.ground || (!p.con.left.pressed() && !p.con.right.pressed()))) {
				p.setAnimation(0);//if not doing anything, stand straight (add directions later)
			}
			
			/*rect(camera.right(), 0, 50, 500);//Debug to show camera windows
			rect(camera.inright(), 0, 5, 500);
			rect(camera.left(), 0, 50, 500);
			rect(camera.inleft(), 0, 5, 500);*/
			
			/*rect(0, camera.inup(), 500, 5);
			rect(0, camera.up(), 500, 10);
			rect(0, camera.indown(), 500, 5);
			rect(0, camera.down(), 500, 10);*/
			
			p.spec.run();
			
			p.collideAttack(attacks);
			
			if(p.con.attack.clicked() && p.attacking === "" && (p.actionFree() || p.jumpSquat >= 0)) {
				if(!p.ground || p.jumpSquat > 0 || p.con.jump.clicked()) {
					if(p.con.up.pressed()) {
						attacks.push(p.attacks.uair.create(p));
					} else if(p.con.right.pressed()) {
						if(p.dir === 0)
							attacks.push(p.attacks.fair.create(p));
						if(p.dir === 2)
							attacks.push(p.attacks.bair.create(p));
					} else if(p.con.left.pressed()) {
						if(p.dir === 2)
							attacks.push(p.attacks.fair.create(p));
						if(p.dir === 0)
							attacks.push(p.attacks.bair.create(p));
					} else if(p.con.down.pressed()) {
						attacks.push(p.attacks.dair.create(p));
					} else {
						attacks.push(p.attacks.nair.create(p));
					}
				}
				if(p.ground && p.actionFree()) {
					if((p.con.right.pressed() === 2 || p.con.left.pressed() === 2) && p.con.attack.pressed) {
						attacks.push(p.attacks.dash.create(p));
					}
				}
				if(p.ground && p.attacking === "" && p.actionFree()) {
					if(p.con.up.pressed()) {
						attacks.push(p.attacks.utilt.create(p));
					} else if(p.con.right.pressed()) {
						p.dir = 0;
						attacks.push(p.attacks.ftilt.create(p));
					} else if(p.con.left.pressed()) {
						p.dir = 2;
						attacks.push(p.attacks.ftilt.create(p));
					} else if(p.con.down.pressed()) {
						attacks.push(p.attacks.dtilt.create(p));
					} else {
						attacks.push(p.attacks.jab.create(p));
					}
				}
			}
			if(p.con.special.clicked() && p.attacking === "" && (p.actionFree() || p.jumpSquat >= 0)) {
				if(p.con.up.pressed()) {
					if(p.con.up.pressed() === 2) {
						if(p.con.left.pressed()) {
							p.dir = 2;
						}
						if(p.con.right.pressed()) {
							p.dir = 0;
						}
					}
					attacks.push(p.attacks.uspecial.create(p));
				} else if(p.con.right.pressed() || p.con.left.pressed()) {
					p.dir = p.con.right.pressed()?0:2;
					attacks.push(p.attacks.fspecial.create(p));
				} else if(p.con.down.pressed()) {
					attacks.push(p.attacks.dspecial.create(p));
				} else {
					attacks.push(p.attacks.nspecial.create(p));
				}
			}
			
			if(p.hitStun > 0) {
				//p.dx = Math.cos(p.angle) * p.launched;
				//p.dy = -Math.sin(p.angle) * p.launched;
				p.hitStun --;
				//if((p.dx*p.dx + p.dy*p.dy)**0.5 < 0.1) {
					//p.hitStun = 0;
				//}
			}
			
			if(p.inv > 0) {
				p.inv --;
			}
			
			if(p.shieldHealth < 0) {
				p.shieldHealth = 0;
			}
			
			if(p.shieldHealth <= 0) {
				p.shielding = false;
				p.dy = -10;
				p.hitStun = 0;
				p.action = "brokenShield";
				p.actionLag = 600 - 3*p.percent;
			}
			
			if(!p.shielding && p.shieldHealth < p.maxShieldHealth) {
				p.shieldHealth += p.shieldRegen;
			}
			
			if(p.shielding || p.action === "shield" || p.action === "dropShield") {
				p.setAnimate("shield");
			}
			
			if(p.action === "brokenShield") {
				if(!p.ground) {
					p.setAnimation(5);
				} else {
					p.setAnimation(6);
				}
			}
			
			if(p.tumble && p.hitStun === 0) {
				p.setAnimation(5);
			}
			
			if(p.fallen) {
				p.setAnimation(7);
			}
			
			if(p.shielding) {
				shield.draw(9-round(p.shieldHealth/p.maxShieldHealth*9), p.x, p.y, 64, 64);
				p.shieldHealth -= 0.1;
			}
			
			if(p.action === "roll right") {
				p.dx = min(p.actionLag / 2, 5);
			}
			if(p.action === "roll left") {
				p.dx = max(-p.actionLag / 2, -5);
			}
			
			
			if(p.jumpSquat <= 0) {//If not jump squatting, move the player, otherwise move the player less
				p.x += p.dx * 0.9;
			} else {
				p.x += p.dx * 0.45;
			}
			p.y += p.dy;
			
			world.collide(players[i]);
			
			p.dy += p.fallSpeed * p.weight * 0.4;//gravity
			
			if(p.jumpSquat <= 0 && p.turnAround === -1) {//If not jump squatting, add friction
				if(p.ground) {
					p.dx /= 1.2;//Friction to the x of the player
				} else {
					p.dx /= 1.03;
					if(p.action === "free fall") {
						p.dx /= 1.2;
					}
				}
			}
			p.dy /= 1 + 0.05;//Friction to the y of the player
			
			if(p.hitStun) {
				p.dx *= 1.04;
				p.dy *= 1.04;
			}
			
			if(abs(p.dx) < 0.05)
				p.dx = 0;
			if(abs(p.dy) < 0.05)
				p.dy = 0;
			
			if(p.actionLag === 0 && p.action !== "") {
				p.action = "";
			}
			if(p.actionLag > 0) {
				p.actionLag --;
			}
			//actions ending
			if(p.action === "brokenShield") {
				let close = ((600 - p.actionLag)/250)**2;//how close to finishing the shield break?
				p.anim.fpsCounter += 2 * close;
				if(p.con.right.pressed() || p.con.up.pressed() || p.con.left.pressed() || p.con.down.pressed()) {
					p.actionLag -= 0.4;
					p.anim.fpsCounter += 3 * close;
				}
				if(p.con.attack.clicked()) {
					p.actionLag -= 0.2;
					p.anim.fpsCounter += 2 * close;
				}
				if(p.con.special.clicked()) {
					p.actionLag -= 0.2;
					p.anim.fpsCounter += 2 * close;
				}
				if(p.con.grab.clicked()) {
					p.actionLag -= 0.2;
					p.anim.fpsCounter += 2 * close;
				}
				if(p.con.shield.pressed()) {
					p.actionLag -= 0.2;
					p.anim.fpsCounter += 2 * close;
				}
				if(p.con.jump.clicked()) {
					p.actionLag -= 0.2;
					p.anim.fpsCounter += 2 * close;
				}
				if(p.actionLag < 0) {
					p.actionLag = 0;
				}
			}
			
			if(p.action === "shield" && p.actionLag === 0) {
				p.shielding = true;
			}
			if(p.action === "dropShield" && p.actionLag === 0) {
				p.shielding = false;
			}
			//actions ending
			
			if(p.footBuffer > 0) {
				p.footBuffer --;
			}
			if(p.jumpSquat > 0) {
				p.jumpSquat --;
			}
			
			if(p.jumpSquat === -1) {//An additional frame for short hopping
				if(!p.con.jump.pressed()) {
					p.y += p.jumpPower - p.shortHopPower;
					p.dy = -p.shortHopPower;
					p.dy /= 1.1;
					p.ground = false;
					p.jumpSquat = -2;
				} else {
					p.jumpSquat = -2;
				}
			}
			if(p.con.jump.pressed() && p.jumpSquat === 0) {//jumps after jump squat
				p.dy = -p.jumpPower;
				p.ground = false;
				p.jumpSquat = -1;
			}
			if(!p.con.jump.pressed() && p.jumpSquat === 0) {//short hops after jump squat
				p.dy = -p.shortHopPower;
				p.ground = false;
				p.jumpSquat = -2;
			}
			
			if(p.edgeWait > 0) {
				p.edgeWait --;
			}
			
			if(p.onEdge) {
				p.setAnimation(3);
				p.dx = 0;
				p.dy = 0;
				p.fastFall = false;
				p.footLeft = 5;
				p.doubleJump = p.airJumps;
				p.tumble = false;
				p.y = p.edge.y;
				p.action = "";
				if(p.edge.dir === 0) {
					p.x = p.edge.x - 20;
				}
				if(p.edge.dir === 2) {
					p.x = p.edge.x + 20;
				}
				if(p.kickedOff) {
					p.dx = 3 * ((p.edge.dir === 2)?1:-1);
					p.dy = -10;
					p.kickedOff = false;
					p.onEdge = false;
					p.edgeWait = 10;
					p.inv = 8;
				} else if(p.con.jump.clicked() || p.con.up.clicked()) {
					p.onEdge = false;
					p.dy = -17;
					p.dx = 2*p.walkSpeed * ((p.edge.dir === 0)?1:-1);
					p.onEdge = false;
					p.edgeWait = 10;
					p.action = "jump off ledge";
					p.actionLag = 2;
					p.inv = 5;
				} else if(p.con.down.clicked()) {
					p.onEdge = false;
					p.edgeWait = 25;
					p.inv = 4;
					/*p.dy = -p.jumpPower;
					if(p.edge.dir === 2) {
						//p.dx = -2*p.walkPower;
					}
					if(p.edge.dir === 0) {
						//p.dx = 2*p.walkPower;
					}*/
				} else if(p.con.right.clicked() && p.dir === 0) {//if facing right
					p.onEdge = false;
					p.edgeWait = 20;
					p.action = "off ledge right";
					p.actionLag = 21;
					p.setAnimate("off ledge right");
					p.inv = 10;
					/*p.dy = -p.jumpPower;
					if(p.edge.dir === 2) {
						//p.dx = -2*p.walkPower;
					}
					if(p.edge.dir === 0) {
						//p.dx = 2*p.walkPower;
					}*/
				} else if(p.con.left.clicked() && p.dir === 2) {//if facing left
					p.onEdge = false;
					p.edgeWait = 20;
					p.action = "off ledge left";
					p.actionLag = 21;
					p.setAnimate("off ledge left");
					p.inv = 10;
					/*p.dy = -p.jumpPower;
					if(p.edge.dir === 2) {
						//p.dx = -2*p.walkPower;
					}
					if(p.edge.dir === 0) {
						//p.dx = 2*p.walkPower;
					}*/
				} else if(p.con.shield.clicked() && p.dir === 2) {//if facing left
					p.onEdge = false;
					p.edgeWait = 20;
					p.action = "roll up left";
					p.actionLag = 28;
					p.inv = 12;
					p.dir = 0;
					p.setAnimate("tumble");
					/*p.dy = -p.jumpPower;
					if(p.edge.dir === 2) {
						//p.dx = -2*p.walkPower;
					}
					if(p.edge.dir === 0) {
						//p.dx = 2*p.walkPower;
					}*/
				} else if(p.con.shield.clicked() && p.dir === 0) {//if facing left
					p.onEdge = false;
					p.edgeWait = 20;
					p.action = "roll up right";
					p.actionLag = 28;
					p.inv = 12;
					p.dir = 2;
					p.setAnimate("tumble");
					/*p.dy = -p.jumpPower;
					if(p.edge.dir === 2) {
						//p.dx = -2*p.walkPower;
					}
					if(p.edge.dir === 0) {
						//p.dx = 2*p.walkPower;
					}*/
				}
			}
			
			if(p.action === "off ledge right") {
				if(p.actionLag > 11) {
					p.dx = 1.5;
					p.dy = -3;
				}
			}
			if(p.action === "off ledge left") {
				if(p.actionLag > 11) {
					p.dx = -1.5;
					p.dy = -3;
				}
			}
			if(p.action === "roll up right") {
				if(p.actionLag > 20) {
					p.dx = 9;
					p.dy = -3;
				}
				if(p.actionLag < 5) {
					p.setAnimation(0);
					p.dir = 2; 
				}
			}
			if(p.action === "roll up left") {
				if(p.actionLag > 20) {
					p.dx = -9;
					p.dy = -3;
				}
				if(p.actionLag < 5) {
					p.setAnimation(0);
					p.dir = 0; 
				}
			}
			
			if(p.action === "free fall") {
				p.setAnimate("free fall");
			}
			
			if(p.ground) {
				if(p.action === "free fall") {
					p.action = "get up";
					p.actionLag = 6;
				}
				p.dy = 0;
				p.ledgeInv = true;
				p.fastFall = false;
				p.footLeft = 5;
				p.doubleJump = p.airJumps;
				p.tumble = false;
				
				if(p.con.shield.pressed() && p.actionFree()) {
					p.action = "shield";
					p.actionLag = 2;
				}
				if(p.shielding && !p.con.shield.pressed() && p.action === "") {
					p.action = "dropShield";
					p.actionLag = 11;
				}
				
				if(p.con.jump.clicked() && (p.actionFree() || p.action === "get up" || p.shielding) && p.attacking === "") {
					p.setAnimation(0);
					p.shielding = false;
					p.action = "";
					p.actionLag = 0;
					p.jumpSquat = 3;
				}
			} else {
				if(p.con.jump.clicked() && p.actionFree() && p.action === "") {
					if(p.doubleJump > 0) {
						p.dy = -p.doubleJumpPower;
						if(p.edgeWait > 0) {
							p.dy /= 1.3;
						}
						p.doubleJump --;
						p.tumble = false;
						p.fastFall = false;
						p.setAnimation(0);
					} else {
						p.footBuffer = 6;
					}
				}
			}
			
			if(p.fallen) {
				if(p.con.up.clicked()) {
					p.action = "get up";
					p.inv = 9;
					p.actionLag = 11;
					p.setAnimate("getup right slow");
					p.fallen = false;
				}
				if(p.con.right.clicked()) {
					p.inv = 6;
					p.action = "roll right";
					p.actionLag = 24;
					p.setAnimate("roll right");
					p.fallen = false;
				}
				if(p.con.left.clicked()) {
					p.inv = 6;
					p.action = "roll left";
					p.actionLag = 24;
					p.setAnimate("roll left");
					p.fallen = false;
				}
			}
			
			if(p.shielding) {
				if(p.con.right.clicked()) {
					p.inv = 6;
					p.action = "roll right";
					p.actionLag = 24;
					p.setAnimate("roll right");
					p.fallen = false;
					p.shielding = false;
				} else if(p.con.left.clicked()) {
					p.inv = 6;
					p.action = "roll left";
					p.actionLag = 24;
					p.setAnimate("roll left");
					p.fallen = false;
					p.shielding = false;
				} else if(p.con.down.clicked()) {
					p.inv = 11;
					p.action = "spot dodge right";
					p.setAnimate("spot right");
					p.actionLag = 15;
					p.fallen = false;
					p.shielding = false;
				}
			}
			
			if(p.fallThrough > 0) {
				p.fallThrough --;
				if(p.fastFall) {
					p.fallThrough = 0;
				}
			}
			
			if(p.con.down.pressed() === 2 && p.action !== "brokenShield" && !p.fallen && !p.tumble && p.action !== "spot dodge right" && p.action !== "spot dodge left") {
				p.fallThrough = 14;
			}
			/*if(players[i].con.up.pressed()) {
				players[i].dy -= 1;
				if(players[i].con.up.pressed() === 2) {
					players[i].dy -= 1;
				}
			}*/
			if(p.spark > 0) {
				p.spark --;
			}
			if(p.con.down.clicked() && p.dy > 0 && !p.tumble && !p.fastFall) {
				p.fastFall = true;
				p.spark = 12;
				/*if(players[i].con.down.pressed() === 2) {//No faster version of fast fall
					players[i].dy += 1;
				}*/
			}
			if(p.turnAround > 0) {//Turn around
				p.turnAround --;//Add turn around animation here
			}
			if(p.turnAround === 0) {
				p.moving = -p.moving;
				p.turnAround = -1;
			}
			if(p.fastFall) {
				p.dy += p.fastFallSpeed;
			}
			
			if(p.action === "get up") {
				if(p.con.left.pressed()) {
					p.dir = 2;
				}
				if(p.con.right.pressed()) {
					p.dir = 0;
				}
			}
			
			if(p.con.left.pressed() && p.turnAround <= 0 && !p.con.right.pressed()) {//Moving side to side
				if(p.ground) {
					if(p.actionFree()) {
						p.setAnimation(2);//Running right (change this to left later)
						p.dir = 2;
						if(p.moving === -1) {
							p.dx -= p.walkSpeed;
							if(p.con.left.pressed() === 2) {
								p.dx -= p.runSpeed;
							}
						} else if(p.moving === 0) {
							p.moving = -1;
							if(p.con.left.pressed() === 2) {
								p.dx = -8 * p.walkSpeed;
							}
						} else {
							p.turnAround = 6;
							p.setAnimate("turn left");
						}
					}
				} else {
					p.dx -= p.airSpeed / (p.hitStun?4:1);
				}
			}
			if(p.con.right.pressed() && p.turnAround <= 0 && !p.con.left.pressed()) {//Moving side to side
				if(p.ground) {
					if(p.actionFree()) {
						p.setAnimation(2);//Running right
						p.dir = 0;
						if(p.moving === 1) {
							p.dx += p.walkSpeed;
							if(p.con.right.pressed() === 2) {
								p.dx += p.runSpeed;
							}
						} else if(p.moving === 0) {
							p.moving = 1;
							if(p.con.right.pressed() === 2) {
								p.dx = 8 * p.walkSpeed;
							}
						} else {
							p.turnAround = 6;
							p.setAnimate("turn right");//add directions
						}
					}
				} else {
					p.dx += p.airSpeed / (p.hitStun?4:1);
				}
			}
			
			if(!p.con.right.pressed() && !p.con.left.pressed()) {//Not walking in a direction
				p.moveCheck ++;
			} else {
				p.moveCheck = 0;
			}
			
			if(p.moveCheck >= 3) {
				p.moving = 0;//Not walking in a direction
			}
			
			world.draw();//Draws the platforms
			
			for(var u in players) {
				if(u !== i && players[i].action !== "roll right" && players[i].action !== "roll left" && players[u].action !== "roll right" && players[u].action !== "roll left" && players[i].action !== "off ledge right" && players[i].action !== "off ledge left" && players[u].action !== "off ledge right" && players[u].action !== "off ledge left") {
					if(players[i].hit.broad(players[u].hit)) {//Broad Phase
						if(collideHitHit(players[i].hit, players[u].hit)) {//Narrow Phase
							//Note here: The fix phase (what's under this message) fixes based on the broad hitbox, not the actual hitbox (maybe fix this later?)
							let dir = players[i].hit.broadDirection(players[u].hit);
							if(/*dir === 0*/p.x > players[u].x && p.x-players[u].x < 20 && i < u && abs(players[u].y-p.y) < 10) {
								if(p.ground) {
									p.dx += 1.3;
									if(p.dx - 1.3 < 0) {
										p.dx /= 16;
									}
								}
								if(players[u].ground) {
									players[u].dx -= 1;
									if(players[u].dx + 1 > 0) {
										players[u].dx /= 16;
									}
								}
								//players[i].x = players[u].hit.mainHit.x + players[u].x + players[u].hit.mainHit.width/4 + players[i].hit.mainHit.width/4;
							}
							if(dir === 1) {
								if(p.footBuffer > 0 && p.footLeft > 0) {
									p.dy = -p.doubleJumpPower * (0.4 + 0.20*p.footLeft);
									p.footLeft --;
									if(!players[u].ground) {
										players[u].dy = 5;
										players[u].tumble = true;
										players[u].action = "groundFoot";
										players[u].actionLag = 3;
									} else {
										players[u].action = "groundFoot";
										players[u].actionLag = 15;
										players[u].setAnimate("getup right slow");
									}
								}
								//players[i].y = players[u].hit.mainHit.y + players[u].y - players[u].hit.mainHit.height/2 - players[i].hit.mainHit.height/2;
							}
							if(/*dir === 2*/p.x < players[u].x && players[u].x-p.x < 20 && i < u && abs(players[u].y-p.y) < 10) {
								if(p.ground) {
									p.dx -= 1;
									if(p.dx + 1 > 0) {
										p.dx /= 16;
									}
								}
								if(players[u].ground) {
									players[u].dx += 1;
									if(players[u].dx - 1 < 0) {
										players[u].dx /= 16;
									}
								}
								//players[i].x = players[u].hit.mainHit.x + players[u].x - players[u].hit.mainHit.width/4 - players[i].hit.mainHit.width/4;
							}
							if(p.x === players[u].x && p.ground && players[u].ground) {
								if(Math.random() > 0.5) {
									p.x += 0.1;
									players[u].x -= 0.1;
								} else {
									p.x -= 0.1;
									players[u].x += 0.1;
								}
							}
							if(dir === 3) {
								//players[i].y = players[u].hit.mainHit.y + players[u].y + players[u].hit.mainHit.height/2 + players[i].hit.mainHit.height/2;
							}
						}
					}
				}
			}
			
		}
		
		pop();
	}
	pkeys = keys.slice();
}

function keyPressed() {
	keys[keyCode] = true;
}

function keyReleased() {
	keys[keyCode] = false;
}