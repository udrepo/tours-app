class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    filter() {
      const queryObject = { ...this.queryStr };
      const excludedFileds = ["page", "sort", "limit", "fields"];
      excludedFileds.forEach((el) => delete queryObject[el]);
  
      let queryStr = JSON.stringify(queryObject);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryStr.sort)
        this.query = this.query.sort(this.queryStr.sort.split(',').join(' '));
      else this.query = this.query.sort("-createdAt");
      return this;
    }
  
    limitFields() {
      if (this.queryStr.fields)
        this.query = this.query.select(this.queryStr.fields.split(",").join(" "));
      else this.query = this.query.select("-__v");
      return this;
    }
  
    pagination() {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

  module.exports = APIFeatures;