package util

import "fmt"

func LogInfo(format string, a ...interface{}) {
	fmt.Printf("ℹ️ "+format+"\n", a...)
}

func LogError(a ...interface{}) {
	fmt.Print("❌ ")
	fmt.Println(a...)
}

func LogSuccess(format string, a ...interface{}) {
	fmt.Printf("✅ "+format+"\n", a...)
}
