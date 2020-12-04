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
import { GET_NEARBY_MEMBERS } from '../../graphql/server/query';
import NearbyMember from './widget';
import {
  NearbyMembersRequestInterface,
  PassportInterface
} from '../../graphql/types';
import Skeleton from './widget/skeleton';
import { PAGINATION_DEFAULT } from '../../constants';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeNearbyModal(): void;
}

function NearbyModal(props: ModalProp) {
  const { isVisible, closeNearbyModal } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: nearbyData } = useQuery<NearbyMembersRequestInterface>(
    GET_NEARBY_MEMBERS,
    { variables: { offset: 0, first: PAGINATION_DEFAULT } }
  );

  const NearbyMembers = nearbyData?.nearbyMembers;

  const filterMembers = NearbyMembers?.slice().sort((a, b) => {
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
    <NearbyMember key={item.id} {...item} closeNearbyModal={closeNearbyModal} />
  );

  return (
    <Portal>
      <StatusBar translucent animated style="light" />
      <Modalize
        ref={modalizeRef}
        onClose={closeNearbyModal}
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
              marginBottom: RFValue(20)
            }}
          >
            {t(`community.tabPanel.nearby`)}
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

export default React.memo(NearbyModal);
