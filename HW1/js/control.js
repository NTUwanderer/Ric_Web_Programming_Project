var list = document.getElementById('todo-list');

var counter = document.getElementById('counter');

var clear_complete = document.getElementById('clear-complete');

var all_button = document.getElementById('all_button');
var active_button = document.getElementById('active_button');
var complete_button = document.getElementById('complete_button');

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
	var complete = '';
	var checked = '';
	var id = getTimeInMilli();
	var li = getLi(id, string, done);
	if (done === true) {
		complete = 'complete';
		checked = 'checked';
		addInDatas(id, string, true);
	} else {
		addInDatas(id, string, false);
	}
	list.appendChild(li);

	refreshCount();
}
function getLi(id, content, done) {
	var li = document.createElement('li');
	li.innerHTML = getLiHTML(content);
	li.setAttribute('data-id', id);
	if (done) {
		li.firstChild.firstChild.checked = true;
		li.setAttribute('class', 'completed');
	}
	return li;
}
function getLiHTML(content) {
	return	'<div class="view">' + 
				'<input class="toggle" type="checkbox"></input>' + 
				'<label>' + content + '</label>' + 
				'<button class="destroy"></button>' + 
			'</div>';
}
function getTimeInMilli() {
	var d = new Date();
	return d.getTime();
}

function refreshCount() {
	if (count === 0)
		counter.innerHTML = 'no item';
	else if (count === 1)
		counter.innerHTML = '<strong>1</strong> item left';
	else
		counter.innerHTML = '<strong>' + count + '</strong> items left';
}

list.addEventListener('click', function(event) {
  	var target = event.target;
  	if (target && target.nodeName === 'INPUT' && target.className === 'toggle') {
    	var liNode = target.parentNode.parentNode;
    	var id = liNode.getAttribute('data-id');
    	if (target.checked) {
      		liNode.className = 'completed';
      		clickCheckBox(id, true);
    	} else {
      		liNode.className = '';
      		clickCheckBox(id, false);
    	}
    	refreshCount();
  	} else if (target && target.nodeName === 'BUTTON' && target.className === 'destroy') {
    	var liNode = target.parentNode.parentNode;
		var id = liNode.getAttribute('data-id');
		deleteElement(id);
    	refreshCount();
    	liNode.parentNode.removeChild(liNode);
  	}
});

function cleanList() {
	list.innerHTML = null;
}

function rebuildList(complete) {
	cleanList();
	for (var i = 0, length = datas.length; i < length; ++i) {
		console.log(datas[i]);
		if (complete == null || datas[i][2] == complete) {
			var li = getLi(datas[i][0], datas[i][1], datas[i][2]);
			list.appendChild(li);
		}
	}
}

clear_complete.addEventListener('click', clearComplete);

function clearComplete() {
	console.log(datas);
	for (var i = 0, length = datas.length; i < length; ++i) {
		console.log('i:' + i + ', completed: ' + datas[i][2]);
		if (datas[i][2] == true) {
			datas.splice(i, 1);
			--length;	--i;
		}
	}
	console.log(datas);
	if (state === 0)		rebuildList(null);
	else if (state === 1)	rebuildList(false);
	else 					rebuildList(true);
}

all_button.addEventListener('click', function() {
	console.log('state' + state);
	if (state === 0)	return;
	else if (state === 1) {
		active_button.setAttribute('class', '');
	} else {
		complete_button.setAttribute('class', '');
	}
	state = 0;
	all_button.setAttribute('class', 'selected');

	rebuildList(null);
});
active_button.addEventListener('click', function() {
	console.log('state' + state);
	if (state === 1)	return;
	else if (state === 0) {
		all_button.setAttribute('class', '');
	} else {
		complete_button.setAttribute('class', '');
	}
	state = 1;
	active_button.setAttribute('class', 'selected');

	rebuildList(false);
});
complete_button.addEventListener('click', function() {
	console.log('state' + state);
	if (state === 2)	return;
	else if (state === 0) {
		all_button.setAttribute('class', '');
	} else {
		active_button.setAttribute('class', '');
	}
	state = 2;
	complete_button.setAttribute('class', 'selected');

	rebuildList(true);
});




