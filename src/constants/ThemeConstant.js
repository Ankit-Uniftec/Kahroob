import { scale } from "react-native-size-matters";

export default ThemeConstant = {
    PADDING_MAIN: scale(24),
    PRIMARY_COLOR: "#00CC44",
    FADED_BLACK: '#999999',
    BLACK: '#000000'

}

const lightThemeConstants = {
    PRIMARY_COLOR: "#00CC44",
    FADED_BLACK: '#999999',
    THEME: '#FFFFFF',
    TEXT_PRIMARY: '#000000',
};

const darkThemeConstants = {
    PRIMARY_COLOR: "#00CC44",
    FADED_BLACK: '#BBBBBB',
    THEME: '#000000',
    TEXT_PRIMARY: '#FFFFFF'
};

export {
    lightThemeConstants,
    darkThemeConstants
}