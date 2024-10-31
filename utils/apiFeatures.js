class ApiFeatures {
    constructor(query, queryStr) {      // query -> productModel?.find()
        this.query = query;             // queryStr -> value & keyword = req.query.keyword
        this.queryStr = queryStr;
    }

    search() {  // ^ -> search bar
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};
        console.log("keyword = >>", keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {  // ^ -> categories
        const queryCopy = { ...this.queryStr };

        // Remove unnecessary fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Call the category filter method
        this.categoryFilter(queryCopy);

        // Call the price filter method
        this.priceFilter(queryCopy);

        return this;
    }

    categoryFilter(queryCopy) {
        // Check if a category exists in the query and apply the filter
        if (queryCopy.category) {
            this.query = this.query.find({
                category: queryCopy.category,
            });
        }
        return this;
    }

    priceFilter(queryCopy) {
        if (queryCopy.price) {
            let queryStr = JSON.stringify(queryCopy);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

            this.query = this.query.find(JSON.parse(queryStr));
        }
        return this;
    }
    sortByPrice() {
        // Default sorting is ascending (low to high) if no priceSort query is provided
        const priceSort = this.queryStr.priceSort
            ? this.queryStr.priceSort === 'desc' ? '-price' : 'price'
            : 'price';  // Default to ascending order (low to high)
    
        this.query = this.query.sort(priceSort);
    
        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }

    // Method to check if products were found and throw an error if none
    async execute() {
        const products = await this.query;
        if (products.length === 0) {
            throw new Error("Products category not found");
        }
        return products;
    }
}

module.exports = ApiFeatures;
