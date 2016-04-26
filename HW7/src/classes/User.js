import React from 'react';


const User = ({ params }) => {
	return (
		<div>
		    <h1>{params.username}</h1>
		</div>
		);
};
  


// User.propTypes = {
//   params: PropTypes.object.isRequired
// };

export default User;