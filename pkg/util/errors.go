package util

type RequestError struct {
	StatusCode int
	Err        error
}

func NewRequestError(statusCode int, err error) *RequestError {
	return &RequestError{StatusCode: statusCode, Err: err}
}

func (e *RequestError) Error() string {
	return e.Err.Error()
}
