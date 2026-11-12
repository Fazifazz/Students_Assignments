function logger(req, res, next) {
const start = Date.now(); 

res.on('finish', () => {

// runs when the response has been sent
const duration = Date.now() - start;
console.log(new Date().toISOString(), req.method, req.path, res.statusCode, `${duration}ms`); 
}) 

next();

}

module.exports = logger;