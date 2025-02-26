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
		const limit = this.limit * 1 || 0;
		const skip = (page - 1) * limit;

			this.query = this.query.aggregate([
				{
					$facet: {
						data: [
							{$skip: skip},
							{$limit: limit},
							{$project: {__v: 0}}
						],
						totalCount: [
							{$count: 'count'}
						]
					}
				}
			]);

		return this;
	}
}

module.exports = APIFeatures;
