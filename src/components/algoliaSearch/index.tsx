import React, { useState, useCallback, ReactNode } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import SearchModal from '../searchModal';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

import { Container } from './style';
import { NavigationInterface } from '../../screens/types';

interface SearchInterface {
  indexName: string;
  children: React.ReactElement<ReactNode>;
}

function AlgoliaSearch(props: SearchInterface) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isVisible, setIsVisible] = useState(false);

  const showSearchModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);
      return true;
    },
    []
  );

  return (
    <Container>
      <View
        style={{
          marginHorizontal: 10,
          paddingHorizontal: 10,
          elevation: 0,
          borderColor: colors.INACTIVE,
          borderRadius: 4,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: RFValue(40)
        }}
        onStartShouldSetResponder={showSearchModal(true)}
      >
        <Octicons name="search" color={colors.PRIMARY_TEXT} size={20} />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.PRIMARY_TEXT,
            paddingHorizontal: RFValue(18)
          }}
        >
          {t(`community.chat.search`)}
        </Text>
      </View>
      <SearchModal
        isVisible={isVisible}
        indexName={props.indexName}
        closeSearchModal={showSearchModal(false)}
        //@ts-ignore
        navigation={navigation}
      >
        {props.children}
      </SearchModal>
    </Container>
  );
}

export default React.memo(AlgoliaSearch);
