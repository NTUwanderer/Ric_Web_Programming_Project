document.getElementById('input_text').onkeypress = function(e) {
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    console.log(keyCode);
    if (keyCode == '13'){
    	var string = this.value;
    	addTodoInList(string, false);
    	console.log(this.value);
    	this.value = null;
    }
}

function addTodoInList(string, done) {
	var list = document.getElementById('todo-list');
	var li = document.createElement('li');
	var complete = '';
	var checked = '';
	if (done === true) {
		complete = 'complete';
		checked = 'checked';
	}

		
	li.data-id = getTimeInMilli();


}
function getTimeInMilli() {
	var d = new Date();
	return d.getTime();
}
