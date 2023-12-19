import { useState, useEffect } from 'react'
import Api from '../models/Api'

interface Results {
  isSignedIntoSpotify: boolean;
  isSignedIntoLastfm: boolean;
  spotifyUserId: string;
  lastfmUsername: string;
  fetching: boolean;
  error?: string;
}

function useGetMe(): Results {
  const [results, setResults] = useState<Results>({ isSignedIntoLastfm: false, isSignedIntoSpotify: false,
    spotifyUserId: '', lastfmUsername: '', fetching: true })

  useEffect(() => {
    async function fetchMe() {
      try {
        const results = await Api.me()
        setResults({ ...results, fetching: false })
      } catch (err: any) {
        console.error('failed to fetch authenticated user', err)
        setResults({ fetching: false, error: err.message, isSignedIntoLastfm: false, isSignedIntoSpotify: false,
          spotifyUserId: '', lastfmUsername: '' })
      }
    }

    fetchMe()
  }, [])

  return results
}

export default useGetMe
