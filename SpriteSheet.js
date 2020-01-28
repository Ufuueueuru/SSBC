class SpriteSheet {
	constructor(img, width, height) {
		this.img = img;
		this.width = width;
		this.height = height;
		this.imgs = [];
		this.load();
	}
	
	load() {
		this.imgs = [];
		for(var i = 0;i < this.frameCount();i ++) {
			var w = ceil(this.img.width / this.width);
			var h = floor(i/w)*this.height;
			var remain = (i%w)*this.width;
			
			this.imgs[i] = this.img.get(remain, h, this.width, this.height);//in java use .getSubImage()
		}
	}
	
	get(i) {
		return this.imgs[i];
	}
	
	xFrames() {
		return ceil(this.img.width / this.width);
	}
	
	yFrames() {
		return ceil(this.img.height / this.height);
	}
	
	frameCount() {
		var w = this.img.width / this.width;
		var h = this.img.height / this.height;
		
		return w*h;
	}
	
	//javascript stuff
	draw(i, x, y, wi=this.width, he=this.height) {
		
		image(this.imgs[i], x, y, wi, he);
	}
	drawXY(ix, iy, x, y, wi, he) {
		image(this.img, x, y, wi, he, ix*this.width, iy*this.height, this.width, this.height);
	}
	//javascript stuff
}
class Sequence extends SpriteSheet {
	constructor(img, width, height) {
		super(img, width, height);
		
		this.animations = [];
		
		this.current = 0;
		
		this.frame = 0;
		
		this.fpsCounter = 0;
	}
	
	addAnimation(start, stop, fps) {
		this.animations.push(new Anim(start, stop, fps));
	}
	
	setAnimation(num) {
		if(this.current < this.animations.length && this.current !== num) {
			this.current = num;
			this.frame = this.animations[this.current].start;
			this.fpsCounter = 0;
		}
	}
	
	animate() {
		this.fpsCounter += this.animations[this.current].fps;
		while(this.fpsCounter >= 60) {
			if(this.frame >= this.animations[this.current].stop) {
				this.frame = this.animations[this.current].start;
			} else if(this.frame < this.animations[this.current].start) {
				this.frame = this.animations[this.current].start;
			} else {
				this.frame ++;
			}
			this.fpsCounter -= 60;
		}
	}
	
	draw(x, y, wi=this.width, he=this.height) {
		image(this.imgs[this.frame], x, y, wi, he);
	}
	
}

class Anim {
	constructor(start, stop, fps) {
		this.start = start;
		this.stop = stop;
		this.fps = fps;//Assumes 60 fps
	}
}