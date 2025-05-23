import { BOOKMARK_ARTICLES, BOOKMARK_CLASSIFIED, BOOKMARK_STATIONS, SET_THEME } from '../allactionsTypes';

const initialState = {
    isDark: false,
    articles: [],
    classifields: [],
    chargingStations: []
};

export default function ThemeReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_THEME:
            return {
                ...state,
                isDark: payload,
            };
        case BOOKMARK_ARTICLES:
            return {
                ...state,
                articles: payload,
            };
        case BOOKMARK_STATIONS:
            return {
                ...state,
                chargingStations: payload,
            };
        case BOOKMARK_CLASSIFIED:
            return {
                ...state,
                classifields: payload,
            };
        default:
            return state;
    }
}
