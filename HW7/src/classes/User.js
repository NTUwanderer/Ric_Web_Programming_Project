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

class User extends React.Component {
	componentDidMount() {
	    this.setState({
	      	name: this.props.params.username
	    })
	}

	constructor() {
		super();

		this.state = {
			name: "Elsa",
			index: 0
		}
		this.getProfilePhoto = this.getProfilePhoto.bind(this);
		this.clickIndex = this.clickIndex.bind(this);
		this.clickIndexHandler = this.clickIndexHandler.bind(this);
	}

	getProfilePhoto() {
		let name = this.state.name;
		if (name === "Elsa")	return "http://lorempixel.com/50/50/people/1";
		if (name === "Katherine")	return "http://lorempixel.com/50/50/people/9";
		if (name === "Marshall")	return "http://lorempixel.com/50/50/people/7";
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
		return (
			<div className="col-lg-6 col-sm-6">
			    <div className="card hovercard">
			        <div className="card-background">
			            <img className="card-bkimg" alt="" src={this.getProfilePhoto()} />
			        </div>
			        <div className="useravatar">
			            <img alt="" src={this.getProfilePhoto()} />
			        </div>
			        <div className="card-info"> <span className="card-title">{this.state.name}</span>

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
			          <h3>This is tab 1</h3>
			        </div>
			        <div className="tab-pane fade in" id="tab2">
			          <h3>This is tab 2</h3>
			        </div>
			        <div className="tab-pane fade in" id="tab3">
			          <h3>This is tab 3</h3>
			        </div>
			      </div>
			    </div>
    		</div>
			);
	}
}

export default User;