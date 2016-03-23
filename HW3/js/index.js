"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoApp = function (_React$Component) {
  _inherits(TodoApp, _React$Component);

  function TodoApp() {
    _classCallCheck(this, TodoApp);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      uncomplete: 0,
      selected: 0,
      items: [
        // id(number), string(string), complete(boolean)

      ]
    };
    _this.update = _this.update.bind(_this);
    _this.check = _this.check.bind(_this);
    _this.destroy = _this.destroy.bind(_this);
    _this.clearComplete = _this.clearComplete.bind(_this);
    _this.myMap = _this.myMap.bind(_this);
    _this.changeSelected = _this.changeSelected.bind(_this);
    _this.selectAll = _this.selectAll.bind(_this);
    return _this;
  }

  TodoApp.prototype.update = function update(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      var string = e.target.value;
      console.log(string);
      if (string !== "") this.addTodo(string, false);
      e.target.value = "";
    }
  };

  TodoApp.prototype.addTodo = function addTodo(string, completed) {
    if (completed === false) {
      ++this.state.uncomplete;
      ReactDOM.findDOMNode(this.refs.selectAllInput).checked = false;
      console.log(ReactDOM.findDOMNode(this.refs.selectAllInput));
    }
    var id = getTimeInMilli();
    var items = this.state.items;
    items.push([id, string, completed]);
    this.setState({ items: items });
    // let li = <TodoItem data_id={id} content={string} />;
  };

  TodoApp.prototype.check = function check(id, complete) {
    var uncomplete = this.state.uncomplete;
    var items = this.state.items;
    for (var i = 0, length = items.length; i < length; ++i) {
      if (items[i][0] == id) {
        if (items[i][2] === false) --uncomplete;
        items[i][2] = complete;
        if (items[i][2] === false) ++uncomplete;
        this.setState({ uncomplete: uncomplete, items: items });
        break;
      }
    }
  };

  TodoApp.prototype.destroy = function destroy(id) {
    var uncomplete = this.state.uncomplete;
    var items = this.state.items;
    for (var i = 0, length = items.length; i < length; ++i) {
      if (items[i][0] == id) {
        if (items[i][2] === false) --uncomplete;
        items.splice(i, 1);
        this.setState({ uncomplete: uncomplete, items: items });
        break;
      }
    }
  };

  TodoApp.prototype.clearComplete = function clearComplete() {
    var items = this.state.items;
    for (var i = 0, length = items.length; i < length; ++i) {
      if (items[i][2] === true) {
        items.splice(i, 1);
        --length;--i;
      }
    }
    this.setState({ items: items });
  };

  TodoApp.prototype.myMap = function myMap(item) {
    if (shouldShow(this.state.selected, item[2])) return React.createElement(TodoItem, { key: item[0], data_id: item[0], content: item[1], completed: item[2], check: this.check, destroy: this.destroy });
    return null;
  };

  TodoApp.prototype.changeSelected = function changeSelected(e) {
    var i = 2,
        button = e.target.innerHTML;
    console.log(e.target);
    if (button === "All") i = 0;else if (button === "Active") i = 1;
    console.log(i);
    console.log(button);
    this.setState({ selected: i });
  };

  TodoApp.prototype.selectAll = function selectAll(e) {
    var select = e.target.checked;
    var items = this.state.items;
    for (var i = 0, length = items.length; i < length; ++i) {
      items[i][2] = select;
    }if (select === true) this.state.uncomplete = 0;else this.state.uncomplete = items.length;
    this.setState({ items: items });
  };

  TodoApp.prototype.render = function render() {
    var selected = ["", "", ""];
    selected[this.state.selected] = "selected";
    var theSelectedState = this.state.selected;
    return React.createElement(
      "section",
      { className: "todoapp" },
      React.createElement(
        "header",
        { className: "header" },
        React.createElement(
          "h1",
          null,
          "todos"
        ),
        React.createElement("input", { className: "new-todo", placeholder: "What needs to be done?", autofocus: true, onKeyPress: this.update })
      ),
      React.createElement(
        "section",
        { className: "main" },
        React.createElement("input", { ref: "selectAllInput", className: "toggle-all", type: "checkbox", onClick: this.selectAll }),
        React.createElement(
          "label",
          { htmlFor: "toggle-all" },
          "Mark all as complete"
        ),
        React.createElement(
          "ul",
          { ref: "todo_list", className: "todo-list" },
          this.state.items.map(this.myMap)
        )
      ),
      React.createElement(
        "footer",
        { className: "footer" },
        React.createElement(
          "span",
          { className: "todo-count" },
          refreshCount(this.state.uncomplete)
        ),
        React.createElement(
          "ul",
          { className: "filters" },
          React.createElement(
            "li",
            { onClick: this.changeSelected },
            React.createElement(
              "a",
              { className: selected[0] },
              "All"
            )
          ),
          React.createElement(
            "li",
            { onClick: this.changeSelected },
            React.createElement(
              "a",
              { className: selected[1] },
              "Active"
            )
          ),
          React.createElement(
            "li",
            { onClick: this.changeSelected },
            React.createElement(
              "a",
              { className: selected[2] },
              "Completed"
            )
          )
        ),
        React.createElement(
          "button",
          { className: "clear-completed", onClick: this.clearComplete },
          "Clear completed"
        )
      )
    );
  };

  return TodoApp;
}(React.Component);

var TodoItem = function (_React$Component2) {
  _inherits(TodoItem, _React$Component2);

  function TodoItem() {
    _classCallCheck(this, TodoItem);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this2.click = _this2.click.bind(_this2);
    _this2.destroy = _this2.destroy.bind(_this2);
    return _this2;
  }

  TodoItem.prototype.click = function click(e) {
    var checked = e.target.checked;
    this.props.check(this.props.data_id, checked);
  };

  TodoItem.prototype.destroy = function destroy() {
    this.props.destroy(this.props.data_id);
  };

  TodoItem.prototype.render = function render() {
    return React.createElement(
      "li",
      { className: this.props.completed ? "completed" : "" },
      React.createElement(
        "div",
        { className: "view change-color" },
        React.createElement("input", { className: "toggle", type: "checkbox", onClick: this.click, checked: this.props.completed }),
        React.createElement(
          "label",
          null,
          this.props.content
        ),
        React.createElement("button", { className: "destroy", onClick: this.destroy })
      )
    );
  };

  return TodoItem;
}(React.Component);

function shouldShow(selected, completed) {
  return selected === 0 || selected === 1 && completed === false || selected === 2 && completed === true;
}
function getTimeInMilli() {
  var d = new Date();
  return d.getTime();
}
function refreshCount(count) {
  if (count === 0) return 'no item';else if (count === 1) return '1 item left';else return '' + count + ' items left';
}

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById('root'));