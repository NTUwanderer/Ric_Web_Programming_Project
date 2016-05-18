import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import classNames from 'classnames';

import './Room.css';

class Room extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const roomSocket = io.connect('http://localhost:8080/');

    this.state = {
      name: 'None',
      owner: 'None',
      seats: [null, null, null, null], // north, east, south, west
      username: props.params.username,
      observers: [],
      cards: [{ suit: 0, number: 1 },
              { suit: 1, number: 1 },
              { suit: 2, number: 11 },
              { suit: 3, number: 13 }],
      biddings: [],
      imgLoaded: false,
      img: <img alt="loading" src="/public/images/cards.png" />,
      socket: roomSocket,
      mySuit: null,
      status: 'not_yet_started', // bidding, 
      nextMovement: null,
      myTurn: null, // bid
    };

    this.clickFollowing = this.clickFollowing.bind(this);
    this.clickFollowingHandler = this.clickFollowingHandler.bind(this);
    this.clickIndex = this.clickIndex.bind(this);
    this.clickIndexHandler = this.clickIndexHandler.bind(this);
    this.showCard = this.showCard.bind(this);
    this.showCards = this.showCards.bind(this);
    this.getBlankCard = this.getBlankCard.bind(this);
    this.getCard = this.getCard.bind(this);

    this.socketListeners = this.socketListeners.bind(this);

    this.enterRoomRequest = this.enterRoomRequest.bind(this);
    this.sit = this.sit.bind(this);
    this.sitHandler = this.sitHandler.bind(this);

    this.afterLoadRoomInfo = this.afterLoadRoomInfo.bind(this);

    this.setSevenLevels = this.setSevenLevels.bind(this);
    this.bid = this.bid.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  componentDidMount() {
    const thisArg = this;
    fetch(`/api/rooms/${this.props.params.roomname}`)
      .then((res) => {
        if (res.status === 404) {
          const { router } = this.context;
          router.push(`/${this.props.params.username}/lobby`);
          return 'Not Found';
        } else {
          return res.json();
        }
      })
      .then((json) => {
        console.log('room: ', json);
        if (json === 'Not Found') {
          console.log('Error: Not Found but not 404...');
        } else {
          thisArg.setState(json);
          console.log(thisArg.state);
          thisArg.afterLoadRoomInfo();
        }
      })
      .catch((err) => {
        console.log('err', err);
      });

    const img = new Image();
    img.onload = () => {
      thisArg.setState({
        imgLoaded: true,
        img,
      });
      console.log('state: ', thisArg.state);
    };
    img.src = '/public/images/cards.png';
  }

  clickFollowing(name) {
    console.log('handleClick: ', name);
    const { router } = this.context;
    router.push(`/users/${name}`);
  }

  clickFollowingHandler(name) {
    function func() {
      this.clickFollowing(name);
    }
    func = func.bind(this);
    return func;
  }

  clickIndex(index) {
    this.setState({ index });
  }

  clickIndexHandler(index) {
    function func() {
      this.clickIndex(index);
    }
    func = func.bind(this);
    return func;
  }

  showCard(index) {
    const card = this.state.cards[index];
    let canvas;
    console.log('card: ', card);
    if (card.suit === null || card.number === null) {
      canvas = this.getBlankCard();
    } else {
      canvas = this.getCard(card.suit, card.number);
    }
    switch (index) {
      case 0:
        canvas.key = 'top_card';
        canvas.className += 'top_card';
        break;
      case 1:
        canvas.key = 'right_card';
        canvas.className += 'right_card';
        break;
      case 2:
        canvas.key = 'bottom_card';
        canvas.className += 'bottom_card';
        break;
      case 3:
        canvas.key = 'left_card';
        canvas.className += 'left_card';
        break;
      default:
        break;
    }
    return canvas;
  }

  showCards() {
    if (this.state.imgLoaded) {
      const canvases = [
        ReactDOM.findDOMNode(this.refs.top_card),
        ReactDOM.findDOMNode(this.refs.right_card),
        ReactDOM.findDOMNode(this.refs.bottom_card),
        ReactDOM.findDOMNode(this.refs.left_card),
      ];
      for (let i = 0; i < this.state.cards.length; ++i) {
        this.getCard(canvases[i], this.state.cards[i]);
      }
    }
  }

  getBlankCard() {
    const canvas = document.createElement('canvas');
    canvas.className = 'poker_card';
    canvas.innerHTML = 'Your browser does not support the HTML5 canvas tag.';

    return canvas;
  }

  getCard(canvas, card) { // suit: [0: club, 1: diamond, 2: heart, 3: spade], number: 1~13
    const suit = card.suit;
    const number = card.number;

    if (suit === null || number === null) {
      return;
    }
    let i = 0;
    switch (suit) {
      case 0:
        i = 3;
        break;
      case 1:
        i = 2;
        break;
      case 2:
        i = 0;
        break;
      case 3:
        i = 1;
        break;
      default:
        break;
    }

    const ctx = canvas.getContext('2d');
    if (this.state.imgLoaded) {
      ctx.drawImage(this.state.img, (number - 1) * this.props.img_width, i * this.props.img_height,
        this.props.img_width, this.props.img_height,
        0, 0, this.props.canvas_width, this.props.canvas_height);
    }
    // return canvas;
  }

  socketListeners() {
    const socket = this.state.socket;
    socket.on('msg', (data) => {
      console.log('msg: ', data);
    });
    socket.on('someone_sit_down', (data) => {
      const seats = this.state.seats;
      console.log('someone_sit_down: ', data);
      if (seats[data.index] !== null) {
        console.log('conflict: ', data.index,
          ' ', seats[data.index],
          ' ', data.username);
      } else {
        seats[data.index] = data.username;
        this.setState({ seats });
      }
    }, this);
    socket.on('deal_suit', (data) => {
      console.log('suit: ', data);
      this.setState({ mySuit: data });
    }, this);
    socket.on('status_change', (data) => {
      switch (data) {
        case 'start_bidding':
          this.setState({ status: 'bidding' });
          break;
        default:
          break;
      }
    }, this);
    socket.on('next_movement', (data) => {
      console.log('next_movement: ', data);
      const state = this.state;
      state.nextMovement = data.direction;
      if (data.username === state.username) {
        if (data.movement === 'bid') {
          state.myTurn = 'bid';
        }
      } else {
        state.myTurn = null;
      }
      this.setState(state);
    }, this);
  }

  sit(index) {
    this.state.socket.emit('sit', index);
  }

  sitHandler(index) {
    function func() {
      this.sit(index);
      console.log('Hey');
    }
    func = func.bind(this);
    return func;
  }

  afterLoadRoomInfo() {
    this.enterRoomRequest();
    this.socketListeners();
  }

  enterRoomRequest() {
    this.state.socket.emit('enter_room_request',
      { roomname: this.state.name, username: this.state.username }
    );
  }

  bid(e) {
    if (this.state.status === 'bidding' && this.state.myTurn === 'bid') {
      const string = e.target.innerHTML;
      const level = Number(string.slice(0, 1));
      const suitInWord = string.slice(1);
      let suit = 0;
      for (let i = 0; i < 5; ++i) {
        if (suitInWord === this.props.suitsInWords[i]) {
          suit = i;
          break;
        }
      }
      this.state.socket.emit('bid', {
        level,
        suit,
      });
    }
  }

  setSevenLevels() {
    const levels = [];
    for (let i = 0; i < 7; ++i) {
      const tds = [];
      for (let j = 0; j < 5; ++j) {
        const td = (<td className="col-md-2" onClick={this.bid}><p>
          {`${i + 1}${this.props.suitsInWords[j]}`}
        </p></td>);
        tds.push(td);
      }
      const tr = <tr>{tds}</tr>;

      levels.push(tr);
    }
    return levels;
  }

  render() {
    // let cards = [];
    // for (let i = 0; i < this.state.cards.length; ++i) {
    //   cards.push(this.showCard(i));
    // }
    const seats = this.state.seats;
    if (this.state.nextMovement !== null) {
      seats[this.state.nextMovement] += '*';
    }
    return (
      <div>
        <div className="myBoard">
          {
            seats.map((seat, index) =>
              <p key={`seat${index}`} className={`seat${index}`}>
                {
                  seat !== null ? seat
                  : <button onClick={this.sitHandler(index)}>Sit</button>
                }
              </p>
            , this)
          }
          <div className="myTable">
            <canvas ref="top_card" className="poker_card top_card" />
            <canvas ref="right_card" className="poker_card right_card" />
            <canvas ref="bottom_card" className="poker_card bottom_card" />
            <canvas ref="left_card" className="poker_card left_card" />
          </div>
        </div>

        <div className="container bid_result">
          <h2>Bidding Result</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="col-md-3">North</th>
                <th className="col-md-3">East</th>
                <th className="col-md-3">South</th>
                <th className="col-md-3">West</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.biddings.map((row) => (
                  <tr>
                    <td className="col-md-3"><p>
                      {`${row[0].level}${this.props.suitsInWords[row[0].suit]}`}
                    </p></td>
                    <td className="col-md-3"><p>
                      {`${row[1].level}${this.props.suitsInWords[row[1].suit]}`}
                    </p></td>
                    <td className="col-md-3"><p>
                      {`${row[2].level}${this.props.suitsInWords[row[2].suit]}`}
                    </p></td>
                    <td className="col-md-3"><p>
                      {`${row[3].level}${this.props.suitsInWords[row[3].suit]}`}
                    </p></td>
                  </tr>
                ), this)
              }
            </tbody>
          </table>
        </div>

        <div className="container bid_result">
          <h2>My Bidding Table</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="col-md-2">Club</th>
                <th className="col-md-2">Diamond</th>
                <th className="col-md-2">Heart</th>
                <th className="col-md-2">Spade</th>
                <th className="col-md-2">NT</th>
              </tr>
            </thead>
            <tbody>
              {
                this.setSevenLevels()
              }
            </tbody>
          </table>
        </div>

        <p><button onClick={this.showCards}>Try it</button></p>
      </div>
    );
  }
}

Room.propTypes = {
  img_width: React.PropTypes.number,
  img_height: React.PropTypes.number,
  canvas_width: React.PropTypes.number,
  canvas_height: React.PropTypes.number,
  suitsInWords: React.PropTypes.array,
};

Room.defaultProps = {
  img_width: 225,
  img_height: 315,
  canvas_width: 100,
  canvas_height: 140,
  fourSeats: [
    'North',
    'East',
    'South',
    'West',
  ],
  suitsInWords: [
    'C', 'D', 'H', 'S', 'NT',
  ],
};

export default Room;
