import React, { Component } from 'react';
// import './App.css';
import './App.scss';
import Countries from 'countries-api';
import { CountryCard, Pagination } from './components';

class App extends Component {
	constructor(props) {
		super(props);
		const { pageNeighbours = 2, pageLimit = 18 } = props;
		this.state = {
			countries: [],
			currentCountries: [],
			currentPage: 1,
			totalPages: 0,
			pageNeighbours,
			pageLimit
		}
		this.onPageChanged = this.onPageChanged.bind(this);
	}

	getCurrentCountries(countries, currentPage) {
		const { pageLimit } = this.state;
		return {
			currentCountries: countries.length > pageLimit ? countries.slice((currentPage - 1) * pageLimit, currentPage * pageLimit) : countries
		}
	}

	componentDidMount() {
		const countries = Countries.findAll().data
		this.setState({
			countries,
			...this.getCurrentCountries(countries, this.state.currentPage),
			totalPages: countries.length
		});
	}

	onPageChanged(currentPage) {
		this.setState(state => {
			return {
				...this.getCurrentCountries(state.countries, currentPage)
			}
		});
	}

	render() {
		return (
			<div className="App">
		    	{
		    		this.state.countries.length > 0 &&
		    		<Pagination totalRecords={this.state.countries.length} pageNeighbours={this.state.pageNeighbours} pageLimit={this.state.pageLimit} 
			    		onPageChanged={this.onPageChanged}
			    	/>
			    }
		    	<div className="countries-box">
			    	{
			    		this.state.currentCountries.length > 0 && this.state.currentCountries.map(country => {
			    			const { name: { common }, cca2, region } = country;
			    			return <CountryCard key={cca2} country={{ code: cca2, region, name: { common } }} />;
		    			})
			    	}
		    	</div>
		    </div>
		);
	}
}

export default App;
