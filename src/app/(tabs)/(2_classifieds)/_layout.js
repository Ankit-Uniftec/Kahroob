import { Stack } from 'expo-router';
import Routes from '../../../constants/Routes';

const Layout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            {/* <Stack.Screen name={Routes.CLASSIFIED_INDEX} />
            <Stack.Screen name={Routes.CLASSIFIED_DETAIL} />
            <Stack.Screen name={Routes.CLASSIFIED_LISTING_MANUFACTURES} />
            <Stack.Screen name={Routes.CLASSIFIED_LISTING_MODELS} />
            <Stack.Screen name={Routes.CLASSIFIED_VEHICLES} /> */}
        </Stack>
    )
}

export default Layout;