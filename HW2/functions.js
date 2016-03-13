function getType(object) {
	var type = typeof(object);
	if (Array.isArray(object))	return "array";
	if (object === null)	return "null";
	if (object === undefined)	return "undefined";
	if (type === "function" || type === "object")	return type;
	if (isNaN(object)) {
		if (object > 0 || object <= 0)	return "number";
		return "NaN";
	}
	return typeof(object);
}

function counter() {
	var count = 0;
	return {
		getCount: function() {
			return count;
		},
		increase: function() {
			++count;
		},
		decrease: function() {
			--count;
		}
	};
}

function curringSum(num1) {
	return function(num2) {
		return function(num3) {
			return num1 + num2 + num3;
		}
	}
}