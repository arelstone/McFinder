// @ts-ignore
import { GOOGLE_API_KEY } from 'react-native-dotenv'

interface FetchPlaces {
  longitude: number;
  latitude: number;
  radius?: number;
  type?: string;
  keyword?: string;
  opennow?: boolean;
  rankby?: 'distance' | 'prominence';
};

export const fetchPlaces = async ({
  longitude,
  latitude,
  radius = 50000,
  type = 'restaurant',
  keyword = 'mcdonalds',
  opennow = true,
  // rankby = 'distance'
}: FetchPlaces) => {

  const params = [
    `location=${latitude},${longitude}`,
    `radius=${radius}`,
    `type=${type}`,
    `keyword=${keyword}`,
    `opennow=${opennow}`,
    // `rankby=${rankby}`,
    `key=${GOOGLE_API_KEY}`
  ].join('&');

  return await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`)
    .then(res => res.json())
    .then(res => res.results);
}
