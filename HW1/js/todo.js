// 根據 HTML 上面的 class 先選起來放
// 選取 class="new-todo"
var inputElement = document.getElementsByClassName('new-todo')[0];
// 選取 class="todo-list"
var todoListElement = document.getElementsByClassName('todo-list')[0];
// 選取 class="todo-count"
var countElement = document.getElementsByClassName('todo-count')[0];

// 初始化 counter
var count = 0;

// 監聽 input 發生鍵盤按鍵按下去的事件
inputElement.addEventListener('keydown', function(event) {
  // 按了 enter
  if (event.which == 13 || event.keyCode == 13) {
    // 取得 input 的值
    var inputValue = event.target.value;

    // 建立一個 li 並放進去 todo 的 html
    var listItem = document.createElement('li');
    listItem.innerHTML = createTodoHTML(inputValue);
    todoListElement.appendChild(listItem);

    // 清掉輸入框
    event.target.value = '';

    // 把 count 遞增並更新顯示狀態
    count = count + 1;
    showCountDisplay(count);
  }
});

// 建立 todo 的模板方法
function createTodoHTML(title) {
  return '<div class="view">'
    +      '<input class="toggle" type="checkbox">'
    +      '<label>' + title + '</label>'
    +      '<button class="destroy"></button>'
    +    '</div>';
}

// 更新 count 顯示
function showCountDisplay(count) {
  if (count > 1) {
    countElement.innerHTML = '<strong>' + count + '</strong> items left';
  } else if (count === 1) {
    countElement.innerHTML = '<strong>1</strong> item left';
  } else {
    countElement.innerHTML = 'no item';
  }
}

// 對整個 todo list 監聽 click 事件
// 再判斷 target 是誰
// 這稱為 event delegation
// 會對之後加進去的 element 也有效果
todoListElement.addEventListener('click', function(event) {
  var target = event.target;
  // 判斷是不是 <input class="toggle">
  if (target && target.nodeName === 'INPUT' && target.className === 'toggle') {
    var liNode = target.parentNode.parentNode;
    // 如果是被勾選的話
    if (target.checked) {
      liNode.className = 'completed';
      count = count - 1;
    // 如果是取消勾選的話
    } else {
      liNode.className = '';
      count = count + 1;
    }
    showCountDisplay(count);
  // 判斷是不是 <button class="destroy">
  } else if (target && target.nodeName === 'BUTTON' && target.className === 'destroy') {
    var liNode = target.parentNode.parentNode;
    if (liNode.className !== 'completed') {
      count = count - 1;
      showCountDisplay(count);
    }
    liNode.parentNode.removeChild(liNode);
  }
});



/* More */
// 選取 class="clear-completed"
var clearButton = document.getElementsByClassName('clear-completed')[0];

// 監聽 clearButton 發生 click 事件
clearButton.addEventListener('click', function() {
  // 選取 class="completed" 的 todo item
  var completedTodos = todoListElement.querySelectorAll('.completed');
  if (completedTodos.length) {
    // 他們的 parentNode 會一樣
    var parentNode = completedTodos[0].parentNode;
    // 一個一個移掉
    for (var i = 0, len = completedTodos.length; i < len; i++) {
      parentNode.removeChild(completedTodos[i]);
    };
  }
})