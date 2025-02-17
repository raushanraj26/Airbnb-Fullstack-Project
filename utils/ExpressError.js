class ExpressError extends Error {
    constructor(statusCode, message) {
        // super(message);   //agr jyada wrong then isee uncommentkro
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;





