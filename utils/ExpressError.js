class ExpressError extends Error {          //this class is used to create custom error messages 
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports = ExpressError;