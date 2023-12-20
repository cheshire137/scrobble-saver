interface Props {
  results: any
}

const SpotifySearchResultDisplay = ({ results }: Props) => {
  return <div>{JSON.stringify(results)}</div>
}

export default SpotifySearchResultDisplay
