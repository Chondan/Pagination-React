import React from 'react';
import PropTypes from 'prop-types';
import Flag from 'react-world-flags';

const CountryCard = ({
	country
}) => {

	const { code , region = null, name = {} } = country;

	return (
		<div className="country-card">
	    	<div className="country-flag">
		    	<Flag code={code} height="30" />
	    	</div>
	    	<div className="country-info">
	    		<div className="country-name">{name.common}</div>
	    		<div className="country-region">{region}</div>
	    	</div>
	    </div>
	);
}

CountryCard.propTypes = {
	country: PropTypes.shape({
		code: PropTypes.string.isRequired,
		region: PropTypes.string.isRequired,
		name: PropTypes.shape({
			common: PropTypes.string.isRequired
		}).isRequired
	}).isRequired
};

export default CountryCard;