class APIFeatures {
	constructor(query, queryString ) {
	this.limit = +queryString.limit;
	this.page = +queryString.page;
	this.query = query;
	}

	query;
	page: number;
	limit: number;

	paginate () {
		const page = this.page * 1 || 1;
		const limit = this.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit).select('-__v');

		return this;
	}
}

module.exports = APIFeatures;
