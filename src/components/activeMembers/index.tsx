import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import { GET_RECOMMENDED_MEMBERS } from '../../graphql/server/query';
import ActiveMember from './widget';
import Skeleton from './widget/skeleton';

import {
  PassportInterface,
  RecommendedMembersRequestInterface
} from '../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeActiveModal(): void;
}

function ActiveModal(props: ModalProp) {
  const { isVisible, closeActiveModal } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: recommendedData } = useQuery<
    RecommendedMembersRequestInterface
  >(GET_RECOMMENDED_MEMBERS, {
    variables: { filter: { verified: true } }
  });

  const recommendedMembers = recommendedData?.recommendedMembers;

  const filterMembers = recommendedMembers?.slice().sort((a, b) => {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    isVisible ? openModal() : closeModal();
  }, [isVisible]);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ActiveMember key={item.id} {...item} closeActiveModal={closeActiveModal} />
  );

  return (
    <Portal>
      <StatusBar translucent animated style="light" />

      <Modalize
        ref={modalizeRef}
        onClose={closeActiveModal}
        modalStyle={{
          height: DEVICE_FULL_HEIGHT / 2,
          paddingTop: RFValue(30),
          paddingBottom: RFValue(20),
          marginTop: RFValue(55)
        }}
        HeaderComponent={
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              lineHeight: 20,
              marginLeft: RFValue(15),
              marginBottom: RFValue(30)
            }}
          >
            {t(`community.tabPanel.active`)}
          </Text>
        }
        flatListProps={{
          data: filterMembers || [],
          renderItem: _renderItem,
          ListEmptyComponent: <Skeleton />,
          showsVerticalScrollIndicator: false,
          keyExtractor: ({ id }: PassportInterface) => id,
          contentContainerStyle: { paddingBottom: 20 }
        }}
      />
    </Portal>
  );
}

export default React.memo(ActiveModal);
