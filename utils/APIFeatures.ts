import { blogsLimitPerPage } from "./constants";

class APIFeatures {
	constructor(query, queryStringData ) {
	this.limit = +queryStringData.limit;
	this.page = +queryStringData.page;
	this.query = query;
	}

	query;
	page: number;
	limit: number;

	paginate () {
		const page = this.page * 1 || 1;
		const limit = this.limit * 1 || blogsLimitPerPage;
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
