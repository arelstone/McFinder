export interface PlacesApiResponse {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        place_id: string;
        vicinity: string;
        rating: number;
        user_ratings_total: number;
    }
}