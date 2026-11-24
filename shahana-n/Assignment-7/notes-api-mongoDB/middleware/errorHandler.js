
function errorHandler(err, req, res, next) {

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message); //err.erros object for invaidate errors

        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Duplicate key error (unique email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // err.keyValue object in mongodb error

        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === 'CastError') {   // cast error-invalid id as api/users/99999
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    // Custom errors
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
}

module.exports = errorHandler;
