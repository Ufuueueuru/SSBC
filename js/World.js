class World {
	constructor(...blocks) {
		this.blocks = blocks;
	}
	
	collide(player) {
		let previous = player.ground;
		player.ground = false;
		//player.onEdge = false;
		for(var i in this.blocks) {
			//broad phase \/ (There will probably not be a narrow phase
			if(collideRectRect(player.hit.mainHit.x+player.x, player.hit.mainHit.y+player.y, player.hit.mainHit.width, player.hit.mainHit.height, this.blocks[i].x, this.blocks[i].y, this.blocks[i].width, this.blocks[i].height) && player.action !== "jump off ledge") {
				let dir = directionRectRect(player.hit.mainHit.x+player.x, player.hit.mainHit.y+player.y, player.hit.mainHit.width, player.hit.mainHit.height, this.blocks[i].x, this.blocks[i].y, this.blocks[i].width, this.blocks[i].height);
				if(dir === 0 && this.blocks[i].type === 0) {
					player.x = this.blocks[i].x + this.blocks[i].width/2 + player.hit.mainHit.width/2;
					if(player.hitStun > 0 && player.launched > 5) {
						player.dx = abs(player.dx);
					} else {
						player.dx = 0;
					}
				}
				if(dir === 1 && player.dy >= 0) {
					if(player.hitStun > 0 && player.launched > 7 && !player.shielding) {
						player.dy = -abs(player.dy);
					} else {
						if(this.blocks[i].type === 0 || !player.fallThrough) {
							if(!previous && (player.actionFree() || player.attacking !== "")) {
								player.setAnimation(1);//get up animation
								player.action = "get up";
								player.actionLag = 6;

								if(player.tumble && !player.con.shield.pressed()) {
									player.tumble = false;
									player.fallen = true;
									player.action = "";
									player.actionLag = 0;
								}
							}
							player.ground = true;
							player.y = this.blocks[i].y - this.blocks[i].height/2 - player.hit.mainHit.height/2;
						}
						if(player.x < this.blocks[i].leftEdge.x - 6) {
							if(player.dx < -4 || player.fallen || player.action === "brokenShield" || player.action === "roll right" || player.action === "roll left" || !player.con.left.pressed()) {
								player.x = this.blocks[i].leftEdge.x - 6;
								player.dx /= 2;
							}
							//add tripping animation
						}
						if(player.x > this.blocks[i].rightEdge.x + 6) {
							if(player.dx > 4 || player.fallen || player.action === "brokenShield" || player.action === "roll right" || player.action === "roll left" || !player.con.right.pressed()) {
								player.x = this.blocks[i].rightEdge.x + 6;
								player.dx /= 2;
							}
							//add tripping animation
						}
					}
				}
				if(dir === 2 && this.blocks[i].type === 0) {
					player.x = this.blocks[i].x - this.blocks[i].width/2 - player.hit.mainHit.width/2;
					if(player.hitStun > 0 && player.launched > 5) {
						player.dx = -abs(player.dx);
					} else {
						player.dx = 0;
					}
				}
				if(dir === 3 && this.blocks[i].type === 0) {
					player.y = this.blocks[i].y + this.blocks[i].height/2 + player.hit.mainHit.height/2;
				}
			}
			if(this.blocks[i].type === 0 && player.edgeWait === 0 && player.hitStun <= 0) {
				let before = player.onEdge;
				if(!player.ground && collideRectCircle(player.x + player.hit.mainHit.x, player.y + player.hit.mainHit.y, player.hit.mainHit.width, player.hit.mainHit.height, this.blocks[i].leftEdge.x, this.blocks[i].leftEdge.y, this.blocks[i].leftEdge.radius*2)) {
					player.edge = {
						x: this.blocks[i].leftEdge.x + 8,
						y: this.blocks[i].leftEdge.y - 4,
						dir: 0
					}
					player.dir = 0;
					player.onEdge = true;
					if(player.ledgeInv) {
						player.inv = 50;
						player.ledgeInv = false;
					}
					player.fallen = false;
					player.tumble = false;
				}
				if(!player.ground && collideRectCircle(player.x + player.hit.mainHit.x, player.y + player.hit.mainHit.y, player.hit.mainHit.width, player.hit.mainHit.height, this.blocks[i].rightEdge.x, this.blocks[i].rightEdge.y, this.blocks[i].rightEdge.radius*2)) {
					player.edge = {
						x: this.blocks[i].rightEdge.x - 8,
						y: this.blocks[i].rightEdge.y - 4,
						dir: 2
					}
					player.dir = 2;
					player.onEdge = true;
					if(player.ledgeInv) {
						player.inv = 40;
						player.ledgeInv = false;
					}
					player.fallen = false;
					player.tumble = false;
				}
				if(player.onEdge && !player.kickedOff && !before) {
					for(var u in players) {
						if(players[u].id !== player.id) {
							if(players[u].onEdge && player.edge.x === players[u].edge.x && player.edge.y === players[u].edge.y) {
								players[u].kickedOff = true;
							}
						}
					}
				}
			}
		}
	}
	
	draw() {
		for(var i in this.blocks) {
			fill(0);
			rect(this.blocks[i].x, this.blocks[i].y, this.blocks[i].width, this.blocks[i].height);
			fill(255, 50, 50, 100);
			ellipse(this.blocks[i].leftEdge.x, this.blocks[i].leftEdge.y, this.blocks[i].leftEdge.radius*2, this.blocks[i].leftEdge.radius*2);
			ellipse(this.blocks[i].rightEdge.x, this.blocks[i].rightEdge.y, this.blocks[i].rightEdge.radius*2, this.blocks[i].rightEdge.radius*2);
		}
	}
}

class Block extends Rect {
	constructor(x, y, width, height, type) {
		super(x, y, width, height);
		
		this.type = type;
		
		this.leftEdge = {
			x: x - width/2 - 4,
			y: y - height/2 + 19,
			radius: 8
		}
		
		this.rightEdge = {
			x: x + width/2 + 4,
			y: y - height/2 + 19,
			radius: 8
		}
	}
}
