const debounce = (func, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const clearStyles = (el) => {
	el.classList.remove('is-success');
	el.classList.remove('is-danger');
	el.classList.remove('is-dark');
};
