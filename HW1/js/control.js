var list = document.getElementById('todo-list');

var counter = document.getElementById('counter');

var clear_complete = document.getElementById('clear-complete');

var all_button = document.getElementById('all_button');
var active_button = document.getElementById('active_button');
var complete_button = document.getElementById('complete_button');

var check_all = document.getElementById('check_all');

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
	var id = getTimeInMilli();
	if (done === true) {
		addInDatas(id, string, true);
	} else {
		addInDatas(id, string, false);
	}
	if (state !== 2) {
		var li = getLi(id, string, done);
		list.appendChild(li);
		check_all.checked = false;
	}
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
	return	'<div class="view change-color">' + 
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
  	var element = event.target;
  	if (element && element.nodeName === 'INPUT' && element.className === 'toggle') {
    	var li = element.parentNode.parentNode;
    	var id = li.getAttribute('data-id');
    	if (element.checked) {
      		clickCheckBox(id, true);
    		if (state === 1) {
    			list.removeChild(li);
    		} else {
    			li.className = 'completed';
    		}
    	} else {
    		clickCheckBox(id, false);
    		if (state === 2) {
    			list.removeChild(li);
    		} else {
    			li.className = '';
    		}
    	}
    	refreshCount();
  	} else if (element && element.nodeName === 'BUTTON' && element.className === 'destroy') {
    	var li = element.parentNode.parentNode;
		var id = li.getAttribute('data-id');
		deleteElement(id);
    	refreshCount();
    	li.parentNode.removeChild(li);
  	}
});

// list.addEventListener('mouseover', function(event) {
// 	var element = event.target;
// 	console.log(element.nodeName);
// 	if (element && element.nodeName === 'LI') {
// 		element.style.backgroundColor = "rgb(72, 72, 72)";
// 		element.style.color = 'white';
// 	}
// });

// list.addEventListener('mouseleave', function(event) {
// 	var element = event.target;
// 	console.log(element.nodeName);
// 	if (element && element.nodeName === 'UL') {
// 		element.style.backgroundColor = 'white';
// 		element.style.color = 'black';
// 	}
// });

function cleanList() {
	list.innerHTML = null;
}

function rebuildList() {
	cleanList();
	for (var i = 0, length = datas.length; i < length; ++i) {
		console.log(datas[i]);
		if (state === 0 || (state === 1 && datas[i][2] === false) || (state === 2 && datas[i][2] === true)) {
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
	rebuildList();
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

	rebuildList();
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

	rebuildList();
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

	rebuildList();
});

check_all.addEventListener('click', checkAll);

function checkAll() {
	var checked = check_all.checked;
	for (var i = 0, length = datas.length; i < length; ++i)
		datas[i][2] = checked;
	
	if (checked)
		count = 0;
	else
		count = datas.length;

	rebuildList();
	refreshCount();
}


