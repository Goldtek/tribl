import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

// IMPORT FOR ALL CUSTOM STYLES

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../../theme';

export default function EditGroupName(props: any) {
  const insets = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  return (
    <SafeAreaView>
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: 20,
            paddingHorizontal: 10,
            backgroundColor: colors.PRIMARY
          }}
          childrenStyle={{ paddingBottom: insets.bottom }}
          handlePosition="inside"
          adjustToContentHeight
        ></Modalize>
      </Portal>
    </SafeAreaView>
  );
}
