import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import classNames from 'classnames';

import './Room.css';

const fourSeats = [
  'North',
  'East',
  'South',
  'West',
];

class Room extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const socket = io.connect('http://localhost:8080/');
    socket.on('msg', (data) => {
      console.log('reply: ', data);
    });


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

      imgLoaded: false,
      img: <img alt="loading" src="/public/images/cards.png" />,
      socket,
    };

    this.clickFollowing = this.clickFollowing.bind(this);
    this.clickFollowingHandler = this.clickFollowingHandler.bind(this);
    this.clickIndex = this.clickIndex.bind(this);
    this.clickIndexHandler = this.clickIndexHandler.bind(this);
    this.showCard = this.showCard.bind(this);
    this.showCards = this.showCards.bind(this);
    this.getBlankCard = this.getBlankCard.bind(this);
    this.getCard = this.getCard.bind(this);
    this.socketTest = this.socketTest.bind(this);
    this.sit = this.sit.bind(this);
    this.sitHandler = this.sitHandler.bind(this);

    this.socketTest();
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
          router.push(`${this.props.params.username}/lobby`);
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

  sit(index) {
    this.state.socket.emit('sit', index);
  }

  sitHandler(index) {
    function func() {
      this.sit(index);
    }
    func = func.bind(this);
    return func;
  }

  socketTest() {
    this.state.socket.emit('enter_room_request', this.state.name);
  }

  render() {
    // let cards = [];
    // for (let i = 0; i < this.state.cards.length; ++i) {
    //   cards.push(this.showCard(i));
    // }

    return (
      <div>
        <div className="myBoard">
          {
            this.state.seats.map((seat, index) =>
              <p className={`seat${index}`}>
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
        <p><button onClick={this.showCards}>Try it</button></p>
        <p><button onClick={this.socketTest}>Socket Test</button></p>
      </div>
    );
  }
}

Room.propTypes = {
  img_width: React.PropTypes.number,
  img_height: React.PropTypes.number,
  canvas_width: React.PropTypes.number,
  canvas_height: React.PropTypes.number,
};

Room.defaultProps = {
  img_width: 225,
  img_height: 315,
  canvas_width: 100,
  canvas_height: 140,
};

export default Room;
