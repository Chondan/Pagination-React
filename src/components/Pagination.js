import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

const range = (start, end, step=1) => {
	let i = start;
	const range = [];

	while (i <= end) {
		range.push(i);
		i += step;
	}

	return range;
}

class Pagination extends Component {
	constructor(props) {
		super(props);
		const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

		this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
		this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

		// pageNeighbours can be: 0, 1, 2
		this.pageNeighbours = typeof pageNeighbours === 'number'
			? Math.max(0, Math.min(pageNeighbours, 2))
			: 0;

		this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

		this.state = { currentPage: 1 };
	}
	
	// Generate page numbers from currentPage
	fetchPageNumbers = () => {

		// first < negh(start) negh cur negh negh(end) > last
		const currentPage = this.state.currentPage;
		const pageNeighbours = this.pageNeighbours;
		const totalPages = this.totalPages;

		const totalNumbers = (pageNeighbours * 2) + 3;
		const totalBlocks = totalNumbers + 2;

		// if totalPages is too little
		if (totalPages < totalBlocks) return range(1, totalPages);

		// need to transform a currentPage to centerPage e.g. for currentPage 1, 2, 3 => the centerPage is 3 (neighbours = 1)
		// display -> 1 [2] 3 4 > 100, 1 < 3 [4] 5 > 100, 1 < 97 98 [99] 100
		const centerPage = 
			currentPage <= Math.ceil(totalPages / 2) 
			? (currentPage <= 2 + pageNeighbours ? 2 + pageNeighbours : currentPage) // currentPage is on left-side
			: (currentPage + 2 >= totalPages ? totalPages - pageNeighbours - 1 : currentPage); // currentPage is on right-side

		const startPage = centerPage - pageNeighbours;
		const endPage = centerPage + pageNeighbours;

		const hasLeftArrow = startPage > 2;
		const hasRightArrow = totalPages - endPage > 1;

		const pages = [
			1,
			hasLeftArrow ? LEFT_PAGE : null,
			...range(startPage, endPage),
			hasRightArrow ? RIGHT_PAGE : null,
			totalPages
		];
		return pages.filter(page => page);
	}

	handleClick = (page) => {
		this.setState({ currentPage: page });
		this.props.onPageChanged(page);
	}

	handleMoveLeft = () => {
		this.setState(state => ({ currentPage: state.currentPage - 1}));
		this.props.onPageChanged(this.state.currentPage - 1);
	}

	handleMoveRight = () => {
		this.setState(state => ({ currentPage: state.currentPage + 1 }));
		this.props.onPageChanged(this.state.currentPage + 1);
	}

	render() {

		if (!this.totalRecords || this.totalPages === 1) return null;

		const { currentPage } = this.state;
		const pages = this.fetchPageNumbers();

		return (
			<Fragment>
				<nav aria-label="Countries Pagination">
					<ul className="pagination">
						{
							pages.map((page, index) => {
								if (page === LEFT_PAGE) return (
									<li key={index} className="page-item">
                  						<span className="page-link" aria-label="Previous" onClick={this.handleMoveLeft}>
                    						<span aria-hidden="true">&laquo;</span>
                    						<span className="sr-only">Previous</span>
                  						</span>
                					</li>
								);
								if (page === RIGHT_PAGE) return (
									<li key={index} className="page-item">
                  						<span className="page-link" aria-label="Next" onClick={this.handleMoveRight}>
                    						<span aria-hidden="true">&raquo;</span>
                    						<span className="sr-only">Next</span>
                  						</span>
                					</li>
								);									
								return (
					                <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
					                	<span className="page-link" onClick={ () => this.handleClick(page) }>{ page }</span>
					                </li>
					            );
							})
						}
					</ul>
				</nav>
			</Fragment>
		);
	}
}

Pagination.propTypes = {
	totalRecords: PropTypes.number.isRequired,
	pageLimit: PropTypes.number,
	pageNeighbours: PropTypes.number,
	onPageChanged: PropTypes.func
}

export default Pagination;