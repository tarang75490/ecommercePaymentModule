class HttpError extends Error {

    constructor(status, code, message, errorCause = null) {
        super(message)
        this.status = status
        this.code = code
        this.errorCause = errorCause
    }
}

module.exports = HttpError