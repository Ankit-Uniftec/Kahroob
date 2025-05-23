import axios from 'axios';

const URL = 'https://places.googleapis.com/v1/places:searchNearby'
// const API_KEY = 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0'
const API_KEY = 'AIzaSyBbrdDseUJ1KBfawyv75WvES521hKJgo78'

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': '*',
        // 'X-Goog-FieldMask': [
        //     'places.displayName',
        //     'places.formattedAddress',
        //     'places.location',
        //     'places.evChargeOptions',
        //     'places.photos',
        //     'places.rating',
        //     'places.currentOpeningHours',
        //     'places.business_status',
        //     'places.reviews',
        // ].join(','),
    }
}

const nearByPlaces = async (data) => {
    try {
        const response = await axios.post(URL, data, config);
        // console.log(response);
        return response.data;

    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
};


async function getDistanceAndDuration(originLat, originLon, destinationLat, destinationLon) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: `${originLat},${originLon}`,
                destinations: `${destinationLat},${destinationLon}`,
                key: API_KEY,
            },
        });

        const distance = response.data.rows[0].elements[0].distance.text;
        const duration = response.data.rows[0].elements[0].duration.text;

        return { distance, duration };
    } catch (error) {
        console.error('Error fetching distance and duration:', error);
        return null;
    }
}

const getCountryFromCoordinates = async (latitude, longitude) => {
    try {
        // Fetch country from coordinates using a reverse geocoding API
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
        );
        const data = await response.json();
        const country = data.results[0].address_components.find(
            (component) => component.types.includes('country')
        ).short_name;
        return country;
    } catch (error) {
        console.error('Error fetching country from coordinates:', error);
        return ''; // Return empty string in case of error
    }
};

export default { nearByPlaces, getDistanceAndDuration, getCountryFromCoordinates };