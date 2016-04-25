import React from 'react';
import ThreadItem from './ThreadItem';
import MessageItem from './MessageItem';


class ChatApp extends React.Component {
  constructor() {
    super();
    this.state = {
      talkingTo: "Elsa",
      friends: [
        // who, true: myself, time: milliSeconds
        {name: "Elsa", photo: "http://lorempixel.com/50/50/people/1", messages: [{message: "對阿", me: false, time: 1458964894000}, {message: "試著", me: false, time: 1458964894033}, {message: "靠左邊嘛", me: false, time: 1458964894100}, {message: "換我了", me: true, time: 1458964895900}, {message: "有看到嗎", me: true, time: 1458964896000}]},
        {name: "Katherine", photo: "http://lorempixel.com/50/50/people/9", messages: [{message: "Nice to meet you :\)", me: false, time: 1458964894000}, {message: "Me too xD", me: true, time: 1458964894100}]},
        {name: "Marshall", photo: "http://lorempixel.com/50/50/people/7", messages: [{message: "Hi, I'm Harvey.", me: true, time: 1450864895000}, {message: "Hello, I'm Marshall", me: false, time: 1450964349020}]}
      ]
    };
    this.findPersonByName = this.findPersonByName.bind(this);
    this.changeTalkingTo = this.changeTalkingTo.bind(this);
    this.update = this.update.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }
  findPersonByName(name) {
    let friends = this.state.friends;
    for (let i = 0, length = friends.length; i < length; ++i)
      if (name === friends[i].name)
        return friends[i];
  }
  changeTalkingTo(name) {
    this.setState({talkingTo: name});
  }
  update(e) {
    if (!e) e = window.event;
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13){
    	let string = e.target.value;
      console.log(string);
      if (string !== "")
        this.addMessage(string);
    	e.target.value = "";
    }
  }
  addMessage(message) {
    let friends = this.state.friends,
        name = this.state.talkingTo;
    for (let i = 0, length = friends.length; i < length; ++i) {
      if (name === friends[i].name) {
        if (i != 0) {
          let person = friends[i];
          friends.splice(i, 1);
          friends.unshift(person);
        }
        break;
      }
    }
    if (name !== friends[0].name) return;
    friends[0].messages.push({message: message, me: true, time: (new Date()).getTime()});
    
    this.setState({friends: friends});
  }
  render() {
    let people = [],
        friends = this.state.friends,
        talkingTo = this.findPersonByName(this.state.talkingTo);
    for (let i = 0, length = friends.length; i < length; ++i) {
      let messages = friends[i].messages;
      let person = {name: friends[i].name, photo: friends[i].photo, time: null, message: ""};
      if (messages.length != 0) {
        let message = messages[messages.length - 1];
        person.time = message.time;
        person.message = message.message;
      }
      people.push(person);
    }
    return (
      <div className="chat-app clearfix">
        <div className="chat-app_thread">
          <div className="heading">
            <h3 className="messenger-title">Messenger</h3>
          </div>
          <div className="thread-list">{
              people.map(person => <ThreadItem key={person.name} info={person} changeTalkingTo={this.changeTalkingTo} />, this)
         }</div>
        </div>
        <div className="chat-app_message">
          <div className="heading">
            <div className="current-target">{talkingTo.name}</div>
          </div>
          <div className="message-list">{
              talkingTo.messages.map((message, i) => <MessageItem message={message} key={i} />, this)
         }</div>
          <div className="footer">
            <input className="new-message" type="text"  placeholder="Type a message..." onKeyPress={this.update} />
          </div>
        </div>
      </div>);
  }
}

export default ChatApp;
