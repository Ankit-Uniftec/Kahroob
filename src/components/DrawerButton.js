import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Feather } from '@expo/vector-icons';
import ThemeConstant from '../constants/ThemeConstant';
import DrawerModal from './DarwerModal';

const DrawerButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
                style={{
                    width: scale(50),
                    height: scale(50),
                    aspectRatio: 1 / 1,
                    borderWidth: scale(1.4),
                    borderColor: ThemeConstant.PRIMARY_COLOR,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: scale(50),
                    backgroundColor: '#fff'
                }}>
                <Feather name="menu" size={scale(28)} color={ThemeConstant.PRIMARY_COLOR} />
            </TouchableOpacity>

            <DrawerModal open={isOpen} setOpen={setIsOpen} />

        </>
    )
}

export default DrawerButton