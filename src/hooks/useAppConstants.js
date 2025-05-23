import { useSelector } from 'react-redux';

const useAppConstants = () => {
  const { homeRoute, isKeyboardOpen } = useSelector((state) => state.AppReducer);
  return { homeRoute, isKeyboardOpen };
};

export default useAppConstants;
