import React from 'react';
import './User.css';
import classNames from 'classnames';

// const User = ({ params }) => {
// 	return (
// 		<div>
// 		    <h1>{params.username}</h1>
// 		</div>
// 		);
// };

let Infos = [
	{name: "Elsa", following: ["Katherine", "Marshall"], photo: "http://lorempixel.com/50/50/people/1", country: "America", language: "English"},
	{name: "Katherine", following: ["Elsa", "Marshall"], photo: "http://lorempixel.com/50/50/people/9", country: "Taiwan", language: "Chinese"},
	{name: "Marshall", following: ["Elsa", "Katherine"], photo: "http://lorempixel.com/50/50/people/7", country: "Germany", language: "German"}
];

class User extends React.Component {
	static contextTypes = {
    	router: React.PropTypes.object.isRequired
  	};

	componentDidMount() {
	    this.setState({
	      	name: this.props.params.username
	    })
	}

  	componentWillMount() {
    	this.forceUpdate();
  	}

	constructor() {
		super();

		this.state = {
			name: "Elsa",
			index: 0
		}
		this.clickFollowing = this.clickFollowing.bind(this);
		this.clickFollowingHandler = this.clickFollowingHandler.bind(this);
		this.getPerson = this.getPerson.bind(this);
		this.clickIndex = this.clickIndex.bind(this);
		this.clickIndexHandler = this.clickIndexHandler.bind(this);
	}

	clickFollowing(name) {
    	console.log("handleClick: " + name);
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

	getPerson(name) {
		for (let i = 0, length = Infos.length; i < length; ++i)
			if (name === Infos[i].name)
				return Infos[i];
		return null;
	}

	clickIndex(index) {
		this.setState({index: index});
	}

	clickIndexHandler(index) {
		function func() {
	      	this.clickIndex(index);
	    }
	    func = func.bind(this);
	    return func;
	}

	render() {
		let person = this.getPerson(this.state.name);

		let icons = person.following.map(function(name) {
			let friend = this.getPerson(name);
			return (
				<div key={name} className="col-md-6">
					<div className="useravatar">
			            <img alt="" src={friend.photo} />
			        </div>
			        <div className="card-info" /*onClick={this.clickFollowingHandler(name)}*/>
			        	<span className="card-title">{name}</span>
			        </div>
		        </div>
	        	);
		}, this);

		let followings = [];
		for (let i = 0, length = icons.length; i < length; ++i) {
			let temp = {};
			if (i < length - 1) {
				temp = 	<div key={i} className="row" style={{textAlign: "center"}}>
							{[icons[i], icons[i + 1]]}
						</div>;
				++i;
			} else {
				temp = 	<div key={i} className="row" style={{textAlign: "center"}}>
							{icons[i]}
						</div>;
			}
			followings.push(temp);

		}
			

		return (
			<div className="col-lg-6 col-sm-6">
			    <div className="card hovercard">
			        <div className="card-background">
			            <img className="card-bkimg" alt="" src={person.photo} />
			        </div>
			        <div className="useravatar">
			            <img alt="" src={person.photo} />
			        </div>
			        <div className="card-info">
			        	<span className="card-title">{this.state.name}</span>
			        </div>
			    </div>
			    <div className="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
			        <div className="btn-group" role="group">
			            <button onClick={this.clickIndexHandler(0)} type="button" id="stars" className={classNames('btn', {'btn-primary': this.state.index === 0}, {'btn-default': this.state.index !== 0})} href="#tab1" data-toggle="tab"><span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
			                <div className="hidden-xs">Info</div>
			            </button>
			        </div>
			        <div className="btn-group" role="group">
			            <button onClick={this.clickIndexHandler(1)} type="button" id="favorites" className={classNames('btn', {'btn-primary': this.state.index === 1}, {'btn-default': this.state.index !== 1})} href="#tab2" data-toggle="tab"><span className="glyphicon glyphicon-heart" aria-hidden="true"></span>
			                <div className="hidden-xs">Favorites</div>
			            </button>
			        </div>
			        <div className="btn-group" role="group">
			            <button onClick={this.clickIndexHandler(2)} type="button" id="following" className={classNames('btn', {'btn-primary': this.state.index === 2}, {'btn-default': this.state.index !== 2})} href="#tab3" data-toggle="tab"><span className="glyphicon glyphicon-user" aria-hidden="true"></span>
			                <div className="hidden-xs">Following</div>
			            </button>
			        </div>
			    </div>

			    <div className="well">
			      	<div className="tab-content">
			        	<div className="tab-pane fade in active" id="tab1">
			          		<div className="row" style={{textAlign: "center"}}>
							  	<div className="col-md-4">Name</div>
							  	<div className="col-md-8">{person.name}</div>
							</div>
							<div className="row" style={{textAlign: "center"}}>
							  	<div className="col-md-4">Country</div>
							  	<div className="col-md-8">{person.country}</div>
							</div>
							<div className="row" style={{textAlign: "center"}}>
							  	<div className="col-md-4">Language</div>
							  	<div className="col-md-8">{person.language}</div>
							</div>
			        	</div>
			        	<div className="tab-pane fade in" id="tab2">
			          		<h3>None</h3>
			        	</div>
			        	<div className="tab-pane fade in" id="tab3">
			          		{
			          			followings
			          		}
			        	</div>
			      	</div>
			    </div>
    		</div>
			);
	}
}

export default User;