import { useSelector } from 'react-redux';
import { lightThemeConstants, darkThemeConstants } from '../constants/ThemeConstant';

const useThemeConstants = () => {
    const { isDark } = useSelector((state) => state.ThemeReducer);

    return isDark ? darkThemeConstants : lightThemeConstants;
};

export default useThemeConstants;
