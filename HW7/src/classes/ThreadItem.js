import React from 'react';

var aDay = 86400000;
var weekDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var month = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class ThreadItem extends React.Component {
  constructor() {
    super();
    this.click = this.click.bind(this);
    this.userProfile = this.userProfile.bind(this);
  }
  getTime(timeInMilli) {
    if (timeInMilli === null) return null;
    let date = new Date(timeInMilli),
        now  = new Date(),
        day1 = Math.floor(timeInMilli / aDay),
        day2 = Math.floor(now.getTime() / aDay);
    if (day1 > (day2 - 3)) {
      let hour = date.getHours(), min = date.getMinutes(), morning = "am";
      if (hour === 0) {
        hour = 12;
      } else if (hour === 12) {
        morning = "pm";
      }
      else if (hour > 12) {
        morning = "pm";
        hour -= 12;
      }
      if (min < 10)
        min = "0" + min;
      return ("" + hour + ":" + min + morning);
    }
    else if (day1 > (day2 - 10))
      return weekDay[date.getDay() - 1];
    else if (now.getFullYear() === date.getFullYear())
      return (month[date.getMonth()] + " " + date.getDate());
    else
      return ("" + (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getYear());
    
  }
  click() {
    this.props.changeTalkingTo(this.props.info.name);
  }
  userProfile() {
    this.props.clickProfile(this.props.info.name);
  }
  render() {
    // html -> jsx
    return (
      <li className="thread-item">
        <a className="_1ht5 _5l-3" onClick={this.click}>
          <div className="clearfix">
            <div className="thread-item_left">
              <img className="img-circle" onClick={this.userProfile} src={this.props.info.photo} width="50" height="50" alt="" />
            </div>
            <div className="thread-item_right">
              <div className="thread-from">{this.props.info.name}</div>
              <div>
                <span className="thread-content">{this.props.info.message}</span>
              </div>
              <span className="thread-time">{this.getTime(this.props.info.time)}</span>
            </div>
          </div>
        </a>
      </li>);
  }
}

export default ThreadItem;