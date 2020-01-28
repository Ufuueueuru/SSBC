class Controls {
	constructor(player) {
		this.player = player;
		if(gamepads[player.id]) {
			this.setPad(1);
		} else {
			this.setPad(0);
		}
		
		this.tap = true;
	}
	
	setPad(id) {
		this.connect = new Control(this.player, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
		if(id === 0) {
			this.up = new Control(this.player, 0, 38);
			this.down = new Control(this.player, 0, 40);
			this.left = new Control(this.player, 0, 37);
			this.right = new Control(this.player, 0, 39);
			this.attack = new Control(this.player, 0, 86);
			this.special = new Control(this.player, 0, 67);
			this.shield = new Control(this.player, 0, 88);
			this.grab = new Control(this.player, 0, 90);
			this.jump = new Control(this.player, 0, 38);
		}
		if(id === 1) {
			this.up = new Control(this.player, 1, 101);
			this.down = new Control(this.player, 1, 103);
			this.left = new Control(this.player, 1, 102);
			this.right = new Control(this.player, 1, 100);
			this.attack = new Control(this.player, 1, 1);
			this.special = new Control(this.player, 1, 0);
			this.shield = new Control(this.player, 1, 6, 7);
			this.grab = new Control(this.player, 1, 4, 5);
			this.jump = new Control(this.player, 1, 2, 3);
		}
	}
}

class Control {
	constructor(player, type, ...values) {
		this.values = Array.prototype.slice.call(values);
		this.type = type;
		this.player = player;
	}
	
	pressed() {
		for(var i = 0;i < this.values.length;i ++) {
			if(this.type === 0) {//Keyboard
				if(dkeys[this.values[i]].state >= 3 && keyIsDown(this.values[i])) {
					return 2;
				}
				if(keyIsDown(this.values[i])) {
					return 1;
				}
			}
			if(this.type === 1 && gamepads[this.player.id]) {//Controller
				var x1 = gamepads[this.player.id].axes[0];
				var y1 = gamepads[this.player.id].axes[1];
				var x2 = gamepads[this.player.id].axes[2];
				var y2 = gamepads[this.player.id].axes[3];
				if(this.values[i] === 100) {//Left joystick going right
					if(x1 > 0.8 + abs(y1) * 1/5) {
						return 2;
					}
					if(x1 > 0 + abs(y1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 101) {//Left joystick going up
					if(y1 < -0.8 + abs(x1) * 1/5) {
						return 2;
					}
					if(y1 < 0 - abs(x1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 102) {//Left joystick going left
					if(x1 < -0.8 - abs(y1) * 1/5) {
						return 2;
					}
					if(x1 < 0 - abs(y1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 103) {//Left joystick going down
					if(y1 > 0.8 - abs(x1) * 1/5) {
						return 2;
					}
					if(y1 > 0 + abs(x1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] < 18) {
					if(gamepads[this.player.id].buttons[this.values[i]].pressed) {//Button being pressed on joystick
						return 1;
					}
				}
			}
		}
		return 0;
	}
	
	clicked() {
		for(var i = 0;i < this.values.length;i ++) {
			if(this.type === 0) {//Keyboard
				if(dkeys[this.values[i]].state >= 3 && keyIsDown(this.values[i]) && !pkeys[this.values[i]]) {
					return 2;
				}
				if(keyIsDown(this.values[i]) && !pkeys[this.values[i]]) {
					return 1;
				}
			}
			if(this.type === 1 && gamepads[this.player.id]) {//Controller NOT DONE YET!!!!!!!!
				var x1 = gamepads[this.player.id].axes[0];
				var y1 = gamepads[this.player.id].axes[1];
				var x2 = gamepads[this.player.id].axes[2];
				var y2 = gamepads[this.player.id].axes[3];
				if(this.values[i] === 100) {//Left joystick going right
					if(x1 > 0.8 + abs(y1) * 1/5) {
						return 2;
					}
					if(x1 > 0 + abs(y1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 101) {//Left joystick going up
					if(y1 < -0.8 + abs(x1) * 1/5) {
						return 2;
					}
					if(y1 < 0 - abs(x1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 102) {//Left joystick going left
					if(x1 < -0.8 - abs(y1) * 1/5) {
						return 2;
					}
					if(x1 < 0 - abs(y1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] === 103) {//Left joystick going down
					if(y1 > 0.8 - abs(x1) * 1/5) {
						return 2;
					}
					if(y1 > 0 + abs(x1) * 3/5) {
						return 1;
					}
				}
				if(this.values[i] < 18) {
					if(gamepads[this.player.id].buttons[this.values[i]].pressed) {//Button being pressed on joystick
						return 1;
					}
				}
			}
		}
		return 0;
	}
	
}