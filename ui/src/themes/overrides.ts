const colors = {
  canvas: {
    default: '#FFD29D',
  },
  header: {
    bg: '#FFB563',
    text: '#C84630',
    logo: '#69140E',
  },
  border: {
    default: '#FFB563',
  },
  accent: {
    fg: '#4D5382',
  },
  lastfm: {
    fg: '#c8382f',
    bg: '#c43420',
    bgHover: '#b32e1c',
  },
  // https://developer.spotify.com/documentation/design
  spotify: {
    fg: '#1db954',
    bg: '#66d36e',
    bgHover: '#1ed760',
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
