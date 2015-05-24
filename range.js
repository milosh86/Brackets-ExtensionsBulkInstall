class RangeIterator {
	constructor(start, stop) {
		this.value = start;
		this.stop = stop;
	}
	
	[Symbol.iterator]() {
		return this;
	}
	
	next() {
		var value = this.value;
		if (value < this.stop) {
			this.value++;
			return {done: false, value};
		} else {
			return {done: true, undefined};
		}
	}
}

function range(start, stop) {
	return new RangeIterator(start, stop);
}

// vs

function* range(start, stop) {
	for (let i = start; i < stop; i++) {
		yield i;
	}
}