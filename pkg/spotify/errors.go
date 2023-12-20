package spotify

type RequestError struct {
	StatusCode int
	Err        error
}

func NewRequestError(statusCode int, err error) *RequestError {
	return &RequestError{StatusCode: statusCode, Err: err}
}
