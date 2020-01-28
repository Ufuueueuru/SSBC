function DKeys() {
	while(dkeys.length < keys.length || dkeys.length < 280) {
		dkeys.push({state: 0, decay: 0});
	}
	for(var i = 0;i < dkeys.length;i ++) {
		if(dkeys[i].decay === 0)
			dkeys[i].state = 0;
		if(dkeys[i].decay > 0 && !keys[i])
			dkeys[i].decay --;
		if(pkeys[i] !== keys[i]) {
			dkeys[i].state ++;
			dkeys[i].decay = 5;
		}
	}
}

//state goes up every press/lift of a key
