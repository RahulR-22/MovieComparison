const autocompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imgSrc}" alt="" />
		${movie.Title}(${movie.Year})
		`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				s: searchTerm,
				apikey: '8bad076f'
			}
		});
		if (response.data.Error) {
			return [];
		}
		return response.data.Search;
	}
};

createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});

createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

let leftmovie;
let rightmovie;
const onMovieSelect = async (movie, summaryTarget, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			i: movie.imdbID,
			apikey: '8bad076f'
		}
	});
	const Collection = await axios.get(`https://api.themoviedb.org/3/movie/${movie.imdbID}?`, {
		params: {
			api_key: 'eef12039db60c0dbd076b1feb057ce4c',
			language: 'en-Us'
		}
	});
	summaryTarget.innerHTML = movieTemplate(response.data, Collection.data.revenue, Collection.data.budget);
	if (side === 'left') leftmovie = response.data;
	else rightmovie = response.data;
	if (leftmovie && rightmovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];
		const leftSideValue = parseFloat(leftStat.dataset.value);
		const rightSideValue = parseFloat(rightStat.dataset.value);
		console.log(leftStat, rightStat);
		console.log(leftSideValue, rightSideValue);
		if (leftSideValue > rightSideValue) {
			clearStyles(leftStat);
			clearStyles(rightStat);
			rightStat.classList.add('is-danger');
			leftStat.classList.add('is-success');
		} else if (leftSideValue < rightSideValue) {
			clearStyles(leftStat);
			clearStyles(rightStat);
			leftStat.classList.add('is-danger');
			rightStat.classList.add('is-success');
		} else {
			clearStyles(leftStat);
			clearStyles(rightStat);
			leftStat.classList.add('is-dark');
			rightStat.classList.add('is-dark');
		}
	});
};
const movieTemplate = (movieDetail, boxOffice, budget) => {
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const totalAwards = movieDetail.Awards.split(' ').reduce((acc, curr) => {
		curr = parseInt(curr);
		if (!isNaN(curr)) acc += curr;
		return acc;
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" alt=""/>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}(${movieDetail.Year})</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>
		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">Imdb Rating(${movieDetail.imdbVotes} Votes)</p>
		</article>
		<article data-value=${totalAwards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>	
		<article data-value=${budget} class="notification is-primary">
			<p class="title">$${numberWithCommas(budget)}</p>
			<p class="subtitle">Budget</p>
		</article>
		<article data-value=${boxOffice} class="notification is-primary">
			<p class="title">$${numberWithCommas(boxOffice)}</p>
			<p class="subtitle">Box Office</p>
		</article>		
	`;
};
