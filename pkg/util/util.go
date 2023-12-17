package util

import (
	"fmt"
	"net/http"
)

func LogInfo(format string, a ...interface{}) {
	fmt.Printf("ℹ️ "+format+"\n", a...)
}

func LogError(a ...interface{}) {
	fmt.Print("❌ ")
	fmt.Println(a...)
}

func LogRequest(r *http.Request) {
	queryStr := r.URL.RawQuery
	if queryStr == "" {
		LogInfo("%s %s", r.Method, r.URL.Path)
	} else {
		LogInfo("%s %s?%s", r.Method, r.URL.Path, r.URL.RawQuery)
	}
}

func LogSuccess(format string, a ...interface{}) {
	fmt.Printf("✅ "+format+"\n", a...)
}
