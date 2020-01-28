var menu = "menu";

var players = [];

var world;
var attacks = [];

var keys = [];
var pkeys = [];
var dkeys = [];

var camera;

//Images
var fireballSheet;
var fireball;

var sparkSheet;
var spark;

var waterSheet;
var water;

var marioSheet;
var mario;
var invMarioSheet;//Grey tinted image of the mario image
var invMario;

var shieldSheet;
var shieldTint;
var shield;

function animate(id) {//gives the id for an animation name
	switch(id) {
		case "stand right":
			return 0;
		case "stand left":
			return 0;//not right
		case "getup right":
			return 1;
		case "getup left":
			return 1;//not right
		case "run right":
			return 2;
		case "run left":
			return 2;//not right
		case "ledge right":
			return 3;
		case "ledge left":
			return 3;//not right
		case "shield right":
			return 4;
		case "shield":
			return 4;//not right
		case "tumble":
			return 5;
		case "rocking":
			return 6;
		case "fallen":
			return 7;
		case "turn left":
			return 8;
		case "turn right":
			return 8;//not right
		case "getup right slow":
			return 9;
		case "getup left slow":
			return 9;//not right
		case "roll right":
			return 10;
		case "roll left":
			return 10;//not right
		case "spot right":
			return 11;
		case "spot left":
			return 11;//not right
		case "off ledge right":
			return 12;
		case "off ledge left":
			return 12;//not right
		case "free fall":
			return 13;
		case "nspecial":
			return 14;
		case "dspecial":
			return 15;
		case "fspecial":
			return 16;
		case "uspecial":
			return 17;
		case "nair":
			return 18;
		case "dair":
			return 19;
		case "fair":
			return 20;
		case "uair":
			return 21;
		case "bair":
			return 22;
	}
}

function loadSequences() {
	mario = new Sequence(marioSheet, 24, 24);
	mario.addAnimation(3, 3, 0);//standing right     0
	mario.addAnimation(1, 3, 20);//getting up        1
	mario.addAnimation(5, 8, 8);//running right      2
	mario.addAnimation(0, 0, 0);//ledge right        3
	mario.addAnimation(54, 54, 0);//shielding right  4
	mario.addAnimation(12, 35, 110);//tumble         5
	mario.addAnimation(55, 64, 15);//rocking         6
	mario.addAnimation(65, 65, 0);//fallen           7
	mario.addAnimation(11, 11, 0);//turn right       8
	mario.addAnimation(1, 3, 10);//getting up slow   9
	mario.addAnimation(60, 64, 18);//dodging right   10
	mario.addAnimation(60, 64, 18);//spotdodge right 11
	mario.addAnimation(66, 76, 28);//ledgeup   right 12
	mario.addAnimation(9, 10, 30);//free fall        13
	
	mario.addAnimation(44, 44, 0);//nspecial         14
	mario.addAnimation(9, 10, 30);//dspecial         15
	mario.addAnimation(45, 52, 15);//fspecial        16
	mario.addAnimation(53, 53, 0);//uspecial         17
	
	mario.addAnimation(36, 36, 0);//nair             18
	mario.addAnimation(9, 10, 30);//dair             19
	mario.addAnimation(37, 40, 10);//fair            20
	mario.addAnimation(41, 41, 0);//uair             21
	mario.addAnimation(42, 43, 10);//bair            22
	
	invMarioSheet = createGraphics(marioSheet.width, marioSheet.height);
	invMarioSheet.tint(220, 220, 220, 150);
	invMarioSheet.image(marioSheet, 0, 0);
	invMarioSheet.noTint();
	invMario = new Sequence(invMarioSheet, 24, 24);
	invMario.animations = mario.animations;
	
	water = new SpriteSheet(waterSheet, 6, 6);
	
	fireball = new SpriteSheet(fireballSheet, 8, 8);
	
	spark = new SpriteSheet(sparkSheet, 7, 7);
	
	shieldTint = createGraphics(64, 160);
	shieldTint.tint(255, 255, 255, 128);
	shieldTint.image(shieldSheet, 0, 0);
	shieldTint.noTint();
	
	shield = new SpriteSheet(shieldTint, 32, 32);
}

function loadImages() {
	marioSheet = loadImage("data:image/png;base64,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");
	waterSheet = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAbUlEQVQoU2NkYGBg0Ow58R9EXy+xYATR+AAjSLEAPx+KmuOpWmCNMINg8iBxRsvZ1/5L8rJiGHr9yVsGZINganDagG7Q88+/GcA24PIDulNhzsTrSWyBQZ4GbCbhdBKuYMXpaaoFK86IIzVpAACbelG1URuI4AAAAABJRU5ErkJggg==");
	fireballSheet = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAz0lEQVQ4T61TwRHCMAxTX3QiNoAxWKDzsABjwAZMBC845VCQdckdD/pxYzuybCsLADz2eK13LLQ885929imf8Z6YIA4k4ASnv1X1ijzvtgOe51sh4D6xpS0MdIPJ/ASis3wq2BhoBrQ98XQFLscKED4V6wCzy4XVB8SZDBmIulN1hh4fzmC0St+Ex/8DIPSc/k8tlMuDIWlLsyE3IbVgXFaf2bvncphfABNOythbSVH1BySppqxdtt6uVll04LS9aoJKXOUtuKS9qpLz0cn/BlWzvkxhI3YqAAAAAElFTkSuQmCC");
	
	sparkSheet = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAcCAYAAACOGPReAAAAuklEQVRIS2NkoAFgpIGZDEQbahNQ/f/IhlYM9W6xE/5/+/yagYtXlGHX4gKwPIoiI+e0/+f2zsLQCDIQphHdYGxytHcptcKXaJeSYiHRhgZkLf2/YVo0VvXociiKQDEJi0F0l5EiBzcUW9KAGUyqHNhQmCZYsoGlOZC3QGIwDBKHYZA+XHK0cymyN6kapoSSDNmxT4pGZEcM4SRFbrIZhkmKJrFPE0NJKYmQ0ym6Ptrk/dEkBQ9zasU+APZwh0Yiyw5IAAAAAElFTkSuQmCC");
	shieldSheet = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACgCAYAAAC8LWpcAAAD80lEQVR4Xu2dUXLbMBBD4zPl/kfImdJRWs6oGllcQODuOkZ/0pmGAvgASjbppI+PN//zePP5fxiAG4AS+P7+vhzyeLxUq+Jmx8S/vq6RfX7+/feVIJ6FQGjGAGyCs4kfsWwgCEOXdGchEPDnAJjJj1moIMwmfgY/2MJrAHcmr4Jwx0MggOcA7ggrl8MdHy8P4M7kgw08b4BCWNEChY9JC/oCUEw+0AIDOH3uKukHUlju4WIZuAHL6bsB/wgEnsn/haFchi+5BDYaCgjUY1AlztZ/jHt7AHeDCCw7vxmabgjdqWEggan+aMH2NbonAewLzPcD2BqqJr8nNNsXACY+LhsDgKRAmAi14AzEcSCxAxUHsL8zXzkmTMAAhANwAELxDpcygA4pVHpwAyrpd9B2AzqkUOnBDaik30HbDeiQQqUHN4CiL/yAAqUvHIQ1YMH7cWouwgDiAJCdoRWbIZE9CWIvIgYAmfyIVA0B8QBozwEgwsc+A0YulwLjIahtAHLy6hYw6QPL0OcCbsAVgTv1A2q4LITAjdBLYBn9X9GA8eoreianfgKM6zFLMVD/7fJ+HRB6M7IwgZA+2sRg+rEGMDUEDIQBlL4Z2kPY/v7snkC8G4MAHH0cBxMHs/N7wJlD4ftxCoBwEAdAaKD6UgZQnUC1vhtQnUC1vhtQnUC1vhtQnUC1vhtQnUC1vhtQnUC1vhtQnUC1vhtAJfDWGyJXG6Sr9gKPKQkDwJZAZHd4NQRxAHEAkcmPpFZBiHgAtWMAIsLHmoJGpvcixAOgbQBT8uNAAj0fBFKQewC03QA5/VU3Qt8DgF/nJV8C6H0AMBBq4PimSAtA7dg9YKEBCMAsCHDy2+UwAAsMwACGh7OBPh3GceINwDVajzCA1vEkmHMDEiC3lnADWseTYM4NSIDcWsINaB1Pgjk3IAFyawk3oHU8CebcgATIrSXcgNbxJJhzA2jIxw8pEDuytLZwIN6AZ79HJOsHpvZnFHsQZAAcgKufGiONQKGenRARhyL4wciCoylo4uNQRBgA1gADCJzQklUMN6HsQ1Kz+o0Z/GoAMwirJ79/AhzvA6Q2dg8YALavZwZ+bqtJ/9uc6HUIDkD8HA6v/UXfyANYZCj7sgaQTbybnhvQLZFsP25ANvFuem5At0Sy/bgB2cS76bkB3RLJ9uMGZBPvpucGdEsk248bkE28m54b0C2RbD9uQDbxbnpuAJ2I6GSG1hcN5Bog/IACPQ9RAK8NYJxPkgejP0eZVAJdGvD2APbpkafSXAM2YdEapBooHMQDEJqovJQBVNLvoO0GdEih0oMbUEm/g7Yb0CGFSg9uQCX9DtpuQIcUKj28fQP+AEqBYr8zIH/yAAAAAElFTkSuQmCC");
	
}