package util

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
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
	prefix := ""
	if r.URL.Scheme != "" {
		prefix = r.URL.Scheme + "://"
	}
	if r.URL.Host != "" {
		prefix = prefix + r.URL.Host
	}

	queryStr := r.URL.RawQuery
	suffix := r.URL.Path
	if queryStr != "" {
		suffix = suffix + "?" + queryStr
	}

	LogInfo("%s %s%s", r.Method, prefix, suffix)
}

func LogSuccess(format string, a ...interface{}) {
	fmt.Printf("✅ "+format+"\n", a...)
}

func Encode(input []byte) string {
	return base64.StdEncoding.EncodeToString(input)
}

func Decode(input string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(input)
}

func Encrypt(input string, secret string) (string, error) {
	plaintext := []byte(input)
	block, err := aes.NewCipher([]byte(secret))
	if err != nil {
		return "", err
	}
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	// The IV needs to be unique, but not secure. It's common to include it at the beginning of the ciphertext.
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)
	return Encode(ciphertext), nil
}

func Decrypt(input string, secret string) (string, error) {
	ciphertext, err := Decode(input)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher([]byte(secret))
	if err != nil {
		return "", err
	}
	if len(ciphertext) < aes.BlockSize {
		return "", fmt.Errorf("ciphertext too short")
	}
	// The IV needs to be unique, but not secure. It's common to include it at the beginning of the ciphertext.
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]
	stream := cipher.NewCFBDecrypter(block, iv)
	// XORKeyStream can work in-place if the two arguments are the same.
	stream.XORKeyStream(ciphertext, ciphertext)
	return string(ciphertext), nil
}

func ChunkSlice(list []string, chunkSize int) [][]string {
	var chunks [][]string
	for i := 0; i < len(list); i += chunkSize {
		end := i + chunkSize
		if end > len(list) {
			end = len(list)
		}
		chunks = append(chunks, list[i:end])
	}
	return chunks
}
