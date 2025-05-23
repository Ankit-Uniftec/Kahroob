import { combineReducers } from "redux";
import Themereducer from './themereducer';
import AppReducer from './appReducer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import authReducer from "./authReducer";

const themePersistConfig = {
    key: 'theme',
    storage: AsyncStorage,
}

export default combineReducers({
    AuthReducer: persistReducer(themePersistConfig, authReducer),
    ThemeReducer: persistReducer(themePersistConfig, Themereducer),
    AppReducer
});