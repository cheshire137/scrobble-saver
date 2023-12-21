const colors = {
  canvas: {
    default: '#FFD29D',
  },
  header: {
    bg: '#FFB563',
    text: '#C84630',
    logo: '#69140E',
  },
  accent: {
    fg: '#4D5382',
  },
  lastfm: {
    fg: '#c8382f',
  },
  // https://developer.spotify.com/documentation/design
  spotify: {
    fg: '#1db954',
  },
};

const themeOverrides = {
  colors,
  colorSchemes: {
    light: {
      colors,
    },
  },
}

export default themeOverrides
