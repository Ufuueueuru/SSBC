var marioChar = {
	
	character: "Mario",
	airjumps: 1,
	weight: 1,
	walkSpeed: 0.7,
	runSpeed: 0.5,
	airSpeed: 0.25,
	fallSpeed: 1,
	fastFallSpeed: 0.3,
	
	maxShieldHealth: 50,
	shieldRegen: 0.1,
	
	shortHopPower: 8,
	jumpPower: 14,
	doubleJumpPower: 12,
	
	sheet: marioSheet,
	frameWidth: 24,
	frameHeight: 24,
	displayHeight: 48,
	displayWidth: 48,
	sequence: mario,
	
	spec: {
		charge: 0,
		charging: true,
		attackNow: false,
		power: 80,
		
		run: function() {
			if(this.power < 80 && frameCount % 13 === 0) {
				this.power ++;
			}
		}
	},
	
	attacks: {
		grab: {
			create: function(p) {
				p.attacking = "grab";
				return Attack.createAttack(p).setLength(2, 6, 26).setPercent(0).setLaunch(0, 0, Math.PI/2+Math.PI/4*(p.dir?1:-1)).setHitStun(0).setHits(new Rect(15*(p.dir?-1:1), 0, 12, 8)).setGrab(true);
			},
			run: function(p, a) {
			}
		},
		dash: {
			create: function(p) {
				p.attacking = "dash";
				return Attack.createAttack(p).setLength(12, 9, 17).setPercent(4.3).setLaunch(1.2, 5, Math.PI/2+Math.PI/4*(p.dir?1:-1)).setHitStun(15).setHits(new Rect(15*(p.dir?-1:1), 12, 15, 8));
			},
			run: function(p, a) {
				if(p.id === a.id && a.length > 0) {
					p.dx *= 1.13;
				}
			}
		},
		jab: {
			create: function(p) {
				p.attacking = "jab";
				return Attack.createAttack(p).setLength(3, 2, 20).setPercent(2.2).setLaunch(0, 0.5, Math.PI/3+Math.PI/3*(p.dir?1:0)).setHitStun(15).setHits(new Rect(15*(p.dir?-1:1), 0, 20, 8));
			},
			run: function(p, a) {
				if(p.id === a.id && a.length === 0) {
					if(p.con.attack.clicked()) {
						if(a.percent === 2.2) {
							a.resetPlayers();
							a.percent = 1.7;
							a.length = 3;
							a.end = 20;
							a.startup = 2;
						} else if(a.percent === 1.7) {
							a.launch = 0.3;
							a.launchS = 6;
							a.hitStun = 10;
							a.resetPlayers();
							a.percent = 4;
							a.length = 3;
							a.startup = 2;
							a.end = 10;
							a.hits.hits[0].width = 40;
							a.hits.resetMain();
						}
					}
				}
			}
		},
		dtilt: {
			create: function(p) {
				p.attacking = "dtilt";
				return Attack.createAttack(p).setLength(2, 5, 13).setPercent(8).setLaunch(0.3, 6, Math.PI/2-Math.PI/64*(p.dir?1:-1)).setHitStun(29).setHits(new Rect(19*(p.dir?-1:1), 12, 24, 12));
			},
			run: function(p, a) {
				if(p.id === a.id && a.length > 0) {
					
				}
			}
		},
		ftilt: {
			create: function(p) {
				p.attacking = "ftilt";
				return Attack.createAttack(p).setLength(2, 5, 18).setPercent(7).setLaunch(1.2, 4, Math.PI/2+Math.PI/3*(p.dir?1:-1)).setHitStun(11).setHits(new Rect(17*(p.dir?-1:1), 3, 18, 15));
			},
			run: function(p, a) {
				if(p.id === a.id && a.length > 0) {
					
				}
			}
		},
		utilt: {
			create: function(p) {
				p.attacking = "utilt";
				return Attack.createAttack(p).setLength(4, 5, 15).setPercent(5.5).setLaunch(0.2, 5.4, Math.PI/2+Math.PI/228*(p.dir?1:-1)).setHitStun(29).setHits(new Rect(7*(p.dir?-1:1), -9, 26, 38));
			},
			run: function(p, a) {
				if(p.id === a.id && a.length > 0) {
					
				}
			}
		},
		nair: {
			create: function(p) {
				p.attacking = "nair";
				return Attack.createAttack(p).setLength(30, 3, 9).setPercent(8).setLaunch(0.7, 3, Math.PI/4+Math.PI/2*(p.dir?1:0)).setHitStun(11).setHits(new Rect(14*(p.dir?-1:1), 14, 20, 15), new Rect(-5*(p.dir?-1:1), 12, 10, 14));
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.length < 19) {
						a.percent = 5.7;
					}
					p.setAnimate("nair");
				}
			}
		},
		dair: {
			create: function(p) {
				p.attacking = "dair";
				p.fastFall = false;
				return Attack.createAttack(p).setLength(30, 7, 52).setPercent(0.7).setLaunch(0, 2.5, Math.PI/2-Math.PI/8*(p.dir?-1:1)).setHitStun(7).setHits(new Rect(0, -5, 35, 50)).setMaintain(true);
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.length > 0 && a.startup === 0) {
						p.dy = (5*p.dy - 5)/6;
						p.dx /= 1.1;
						p.setAnimate("dair");
					}
					if(a.length <= 2) {
						a.angle = Math.PI/2+Math.PI/28*(p.dir?-1:1);
						a.launch = 0.7;
						a.launchS = 3;
						p.setAnimate("free fall");
					}
				}
			}
		},
		fair: {
			create: function(p) {
				p.attacking = "fair";
				return Attack.createAttack(p).setLength(10, 17, 20).setPercent(14).setLaunch(1.5, 5, -5*Math.PI/12 - Math.PI/6*(p.dir?1:0)).setHitStun(9).setHits(new Rect(10*(p.dir?-1:1), 0, 15, 20));
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.length > 0) {
						p.setAnimate("fair");
					} else {
						p.setAnimation(0);
					}
				}
			}
		},
		uair: {
			create: function(p) {
				p.attacking = "uair";
				return Attack.createAttack(p).setLength(8, 4, 3).setPercent(7).setLaunch(0.1, 7, Math.PI/2-Math.PI/38*(p.dir?-1:1)).setHitStun(29).setHits(new Rect(0, -24, 15, 8), new Rect(0, -20, 30, 8), new Rect(-11, -8, 10, 12), new Rect(11, -8, 10, 12));
			},
			run: function(p, a) {
				if(p.id === a.id) {
					p.setAnimate("uair");
				}
			}
		},
		bair: {
			create: function(p) {
				p.attacking = "bair";
				return Attack.createAttack(p).setLength(12, 4, 15).setPercent(10.5).setLaunch(1, 1.7, 5*Math.PI/6-4*Math.PI/6*(p.dir?1:0)).setHitStun(15).setHits(new Rect(-20*(p.dir?-1:1), 10, 15, 24));
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.length > 0) {
						p.setAnimate("bair");
					} else {
						p.setAnimation(0);
					}
				}
			}
		},
		nspecial: {
			create: function(p) {
				p.attacking = "nspecial";
				if(p.projectiles === 0) {
					p.projectiles ++;
					attacks.push(Attack.createAttack(p).setLength(0, 14, 15));
					return Attack.createAttack(p).setType("nspecial").setLength(88, 17, 0).setPercent(5).setLaunch(0.01, 3, Math.PI/2+Math.PI/4*(p.dir?1:-1)).setHitStun(16).setHits(new Rect(8*(p.dir?-1:1), 3, 9, 9)).setFollow(false).setVelocity(3.6*(p.dir?-1:1), 1.5).setProjectile(true);
				} else {
					return Attack.createAttack(p);
				}
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.startup > 0) {
						p.setAnimate("nspecial");
					}
					if(a.startup === 1) {
						p.attacking = "";
					}
					if(a.dy < 5 && a.startup === 0) {
						a.dy += 0.5;
					}
					for(var i = 0;i < world.blocks.length;i ++) {
						if(collideRectRect(a.hits.hits[0].x + a.x, a.hits.hits[0].y + a.y, a.hits.hits[0].width, a.hits.hits[0].height, world.blocks[i].x, world.blocks[i].y, world.blocks[i].width, world.blocks[i].height) && world.blocks[i].y - (a.hits.hits[0].y + a.y) > 5) {
							a.dy = -5.5;
							//a.y -= 5;
						}
					}
					if(a.startup === 0 && a.percent !== 0) {
						push();
						translate(a.x + a.hits.hits[0].x, a.y + a.hits.hits[0].y);
						if(p.dir) {
							scale(-1, 1);
						}
						image(fireball.get(floor(a.length/8)%4), 0, 0, 12, 12);
						pop();
					}
				}
			}
		},
		dspecial: {
			create: function(p) {
				p.attacking = "dspecial";
				if(p.spec.charge < 60 && !p.spec.attackNow) {
					p.spec.charging = true;
					return Attack.createAttack(p).setLength(60, 6, 0).setAerial(false).setType("dspecial");
				} else {
					for(var i = 0;i < p.spec.charge/3 - 5;i ++) {
						p.projectiles ++;
						attacks.push(Attack.createAttack(p).setLength(26, 6 + 2*i, 0).setPercent(0).setLaunch(0, 3, Math.PI/2+Math.PI/(2.5)*(p.dir?1:-1)).setHitStun(0).setHits(new Rect(2*(p.dir?-1:1), 0, 6, 6)).setFollow(false).setVelocity(10*(p.dir?-1:1) + random(-1, 1), random(-1.8, 1.8)).setProjectile(true).setMaintain(true).setType("dspecial"));
					}
					p.spec.attackNow = false;
					let charge = p.spec.charge;
					p.spec.charge = 0;
					return Attack.createAttack(p).setLength(charge + 10, 6, 6).setAerial(false).setType("dspecial");
				}
			},
			run: function(p, a) {
				if(p.id === a.id && a.type === "dspecial") {
					//if(p.startup === 0) {
					
					if(p.spec.charging) {
						p.spec.charge ++;
						p.setAnimate("dspecial");
						if(p.spec.charge === 60) {
							a.length = 0;
							p.spec.charging = false;
						}
						if(p.con.shield.pressed() || !p.ground) {
							a.length = 0;
							p.spec.charging = false;
						}
						//if(p.con.special.clicked() && a.startup < 50 && p.spec.charge > 30) {
							//a.length = 0;
							//p.spec.attackNow = true;
							//p.spec.charging = false;
							//attacks.push(p.attacks.dspecial.create(p));
						//}
					} else {
						if(p.con.up.pressed() && a.startup > 0 && a.dy > -7) {
							a.dy -= 0.3;
						}
						if(p.con.down.pressed() && a.startup > 0 && a.dy < 1) {
							a.dy += 0.3;
						}
						if(a.startup === 0 && a.launchS !== 0) {
							push();
							translate(a.x, a.y);
							if(!p.dir) {
								scale(-1, 1);
							}
							image(water.get(floor(a.length/4)%4), 0, 0, 12, 12);
							pop();
						}
					}
					//}
				}
			}
		},
		fspecial: {
			create: function(p) {
				p.attacking = "fspecial";
				if(p.spec.power > 20) {
					p.dx = 0;
					let power = floor(p.spec.power * 3/2) + 10;
					p.spec.power = 0;
					attacks.push(Attack.createAttack(p).setLength(8, 20, 8).setPercent(13.6).setLaunch(0, 0, 0).setHitStun(power/2).setHits(new Rect(-15*(p.dir?-1:1), 10, 20, 15)).setAerial(false));
					return Attack.createAttack(p).setLength(8, 16, 8).setPercent(3.9).setLaunch(0, 0, 0).setHitStun(power).setHits(new Rect(15*(p.dir?-1:1), 10, 15, 15)).setAerial(false);
				} else {
					return Attack.createAttack(p);
				}
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.end > 0) {
						p.setAnimate("fspecial");
						if(p.dy > 0) {
							p.dy = 0;
						}
					}
				}
			}
		},
		uspecial: {
			create: function(p) {
				p.attacking = "uspecial";
				return Attack.createAttack(p).setLength(10, 3, 0).setPercent(0.9).setLaunch(0, 11, Math.PI/2+Math.PI/58*(p.dir?1:-1)).setHitStun(9).setHits(new Rect(10*(p.dir?-1:1), -8, 32, 35)).setMaintain(true);
			},
			run: function(p, a) {
				if(p.id === a.id) {
					if(a.length > 5) {
						p.setAnimate("uspecial");
						p.dy = -10;
					}
					p.dx = -1.5 * (p.dir?1:-1);
					if(a.length <= 6) {
						a.launch = 1.35;
						a.launchS = 6;
						a.hits.hits[0].height = 50;
						a.hits.hits[0].width = 42;
						a.percent = 1.7;
						if(p.dy < 0) {
							p.setAnimate("uspecial");
						}
					}
					if(a.length === 0) {
						p.action = "free fall";
						p.actionLag = 9999;
					}
				}
			}
		},
	}
};