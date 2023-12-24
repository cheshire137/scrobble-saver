const colors = {
  canvas: {
    default: '#fefefe',
  },
  header: {
    bg: '#BFC0C0',
    text: '#4F5D75',
    logo: '#2D3142',
  },
  accent: {
    fg: '#4F5D75',
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
