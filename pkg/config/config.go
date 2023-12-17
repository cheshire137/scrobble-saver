package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type LastfmConfig struct {
	ApiKey string `yaml:"api_key"`
	Secret string `yaml:"shared_secret"`
}

type Config struct {
	ServerPort   int          `yaml:"server_port"`
	FrontendPort int          `yaml:"frontend_port"`
	DatabasePath string       `yaml:"database"`
	Secret       string       `yaml:"secret"`
	Lastfm       LastfmConfig `yaml:"lastfm"`
}

func NewConfig(path string) (*Config, error) {
	var config Config
	err := readConfig(path, &config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}

func readConfig(path string, config *Config) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	decoder := yaml.NewDecoder(file)
	return decoder.Decode(config)
}
