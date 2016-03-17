var datas = [
	// id(number), string(string), complete(boolean)
];
var count = 0;
var state = 0; // all, active, complete
function deleteElement(id) {
	for (var i = 0, length = datas.length; i < length; ++i) {
		if (datas[i][0] == id) {
			console.log("delete element found...");
			console.log(datas[i]);
			if (!datas[i][2])
				--count;
			datas.splice(i, 1);
			break;
		}
	}
}
function addInDatas(id, string, complete) {
	datas.push([id, string, complete]);
	if (!complete)
		++count;
}
function clickCheckBox(id, complete) {
	for (var i = 0, length = datas.length; i < length; ++i) {
		if (datas[i][0] == id) {
			console.log("clickCheckBox element found...");
			if (!datas[i][2])
				--count;
			datas[i][2] = complete;
			if (!datas[i][2])
				++count;
			console.log(datas[i]);
			break;
		}
	}
}
