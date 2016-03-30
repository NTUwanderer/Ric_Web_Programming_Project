"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ChatApp: 原本的 HTML
var aDay = 86400000;
var weekDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var month = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var ChatApp = function (_React$Component) {
  _inherits(ChatApp, _React$Component);

  function ChatApp() {
    _classCallCheck(this, ChatApp);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      talkingTo: "Elsa",
      friends: [
      // who, true: myself, time: milliSeconds
      { name: "Elsa", photo: "http://lorempixel.com/50/50/people/1", messages: [{ message: "對阿", me: false, time: 1458964894000 }, { message: "試著", me: false, time: 1458964894033 }, { message: "靠左邊嘛", me: false, time: 1458964894100 }, { message: "換我了", me: true, time: 1458964895900 }, { message: "有看到嗎", me: true, time: 1458964896000 }] }, { name: "Katherine", photo: "http://lorempixel.com/50/50/people/9", messages: [{ message: "Nice to meet you :\)", me: false, time: 1458964894000 }, { message: "Me too xD", me: true, time: 1458964894100 }] }, { name: "Marshall", photo: "http://lorempixel.com/50/50/people/7", messages: [{ message: "Hi, I'm Harvey.", me: true, time: 1450864895000 }, { message: "Hello, I'm Marshall", me: false, time: 1450964349020 }] }]
    };
    _this.findPersonByName = _this.findPersonByName.bind(_this);
    _this.changeTalkingTo = _this.changeTalkingTo.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.addMessage = _this.addMessage.bind(_this);
    return _this;
  }

  ChatApp.prototype.findPersonByName = function findPersonByName(name) {
    var friends = this.state.friends;
    for (var i = 0, length = friends.length; i < length; ++i) {
      if (name === friends[i].name) return friends[i];
    }
  };

  ChatApp.prototype.changeTalkingTo = function changeTalkingTo(name) {
    this.setState({ talkingTo: name });
  };

  ChatApp.prototype.update = function update(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      var string = e.target.value;
      console.log(string);
      if (string !== "") this.addMessage(string);
      e.target.value = "";
    }
  };

  ChatApp.prototype.addMessage = function addMessage(message) {
    var friends = this.state.friends,
        name = this.state.talkingTo;
    for (var i = 0, length = friends.length; i < length; ++i) {
      if (name === friends[i].name) {
        if (i != 0) {
          var person = friends[i];
          friends.splice(i, 1);
          friends.unshift(person);
        }
        break;
      }
    }
    if (name !== friends[0].name) return;
    friends[0].messages.push({ message: message, me: true, time: new Date().getTime() });

    this.setState({ friends: friends });
  };

  ChatApp.prototype.render = function render() {
    var _this2 = this;

    var people = [],
        friends = this.state.friends,
        talkingTo = this.findPersonByName(this.state.talkingTo);
    for (var i = 0, length = friends.length; i < length; ++i) {
      var messages = friends[i].messages;
      var person = { name: friends[i].name, photo: friends[i].photo, time: null, message: "" };
      if (messages.length != 0) {
        var message = messages[messages.length - 1];
        person.time = message.time;
        person.message = message.message;
      }
      people.push(person);
    }
    return React.createElement(
      "div",
      { className: "chat-app clearfix" },
      React.createElement(
        "div",
        { className: "chat-app_left" },
        React.createElement(
          "div",
          { className: "heading" },
          React.createElement(
            "h3",
            { className: "messenger-title" },
            "Messager"
          )
        ),
        React.createElement(
          "div",
          { className: "thread-list" },
          people.map(function (person) {
            return React.createElement(ThreadItem, { key: person.name, info: person, changeTalkingTo: _this2.changeTalkingTo });
          })
        )
      ),
      React.createElement(
        "div",
        { className: "chat-app_right" },
        React.createElement(
          "div",
          { className: "heading" },
          React.createElement(
            "div",
            { className: "current-target" },
            talkingTo.name
          )
        ),
        React.createElement(
          "div",
          { className: "message-list" },
          " ",
          talkingTo.messages.map(function (message, i) {
            return React.createElement(MessageItem, { message: message, key: i });
          })
        ),
        React.createElement(
          "div",
          { className: "footer" },
          React.createElement("input", { className: "new-message", type: "text", placeholder: "Type a message...", onKeyPress: this.update })
        )
      )
    );
  };

  return ChatApp;
}(React.Component);

var ThreadItem = function (_React$Component2) {
  _inherits(ThreadItem, _React$Component2);

  function ThreadItem() {
    _classCallCheck(this, ThreadItem);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.click = _this3.click.bind(_this3);
    return _this3;
  }

  ThreadItem.prototype.getTime = function getTime(timeInMilli) {
    if (timeInMilli === null) return null;
    var date = new Date(timeInMilli),
        now = new Date(),
        day1 = Math.floor(timeInMilli / aDay),
        day2 = Math.floor(now.getTime() / aDay);
    if (day1 > day2 - 3) {
      var hour = date.getHours(),
          min = date.getMinutes(),
          morning = "am";
      if (hour === 0) {
        hour = 12;
      } else if (hour === 12) {
        morning = "pm";
      } else if (hour > 12) {
        morning = "pm";
        hour -= 12;
      }
      if (min < 10) min = "0" + min;
      return "" + hour + ":" + min + morning;
    } else if (day1 > day2 - 10) return weekDay[date.getDay() - 1];else if (now.getFullYear() === date.getFullYear()) return month[date.getMonth()] + " " + date.getDate();else return "" + (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getYear();
  };

  ThreadItem.prototype.click = function click() {
    this.props.changeTalkingTo(this.props.info.name);
  };

  ThreadItem.prototype.render = function render() {
    // html -> jsx
    return React.createElement(
      "li",
      { className: "thread-item" },
      React.createElement(
        "a",
        { className: "_1ht5 _5l-3", onClick: this.click },
        React.createElement(
          "div",
          { className: "clearfix" },
          React.createElement(
            "div",
            { className: "thread-item_left" },
            React.createElement("img", { className: "img-circle", src: this.props.info.photo, width: "50", height: "50", alt: "", className: "img" })
          ),
          React.createElement(
            "div",
            { className: "thread-item_right" },
            React.createElement(
              "div",
              { className: "thread-from" },
              this.props.info.name
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                { className: "thread-content" },
                this.props.info.message
              )
            ),
            React.createElement(
              "span",
              { className: "thread-time" },
              this.getTime(this.props.info.time)
            )
          )
        )
      )
    );
  };

  return ThreadItem;
}(React.Component);

var MessageItem = function (_React$Component3) {
  _inherits(MessageItem, _React$Component3);

  function MessageItem() {
    _classCallCheck(this, MessageItem);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  MessageItem.prototype.render = function render() {
    var string = this.props.message.me ? "message-item message-from-me" : "message-item message-from-other";
    return React.createElement(
      "div",
      { className: string },
      React.createElement(
        "span",
        null,
        this.props.message.message
      )
    );
  };

  return MessageItem;
}(React.Component);

ReactDOM.render(React.createElement(ChatApp, null), document.getElementById('root'));