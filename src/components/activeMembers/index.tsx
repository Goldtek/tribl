import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import {
  GET_RECOMMENDED_MEMBERS,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import ActiveMember from './widget';
import Skeleton from './widget/skeleton';
import { PAGINATION_DEFAULT } from '../../constants';
import removeDuplicateMembers from '../../utils/removeDuplicatePassports';

import {
  MyPassportInterface,
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
  const { bottom } = useSafeAreaInsets();

  const { data: recommendedData } = useQuery<
    RecommendedMembersRequestInterface
  >(GET_RECOMMENDED_MEMBERS, {
    variables: {
      input: { limit: PAGINATION_DEFAULT * 3 }
    }
  });

  const recommendedMembers = recommendedData?.recommendedMembers?.data;
  const filterRecommendedMebers = removeDuplicateMembers(
    recommendedMembers?.slice()
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const blockedUsers = userDetails?.privacy?.blocked;

  const filteredUsers = filterRecommendedMebers?.filter(
    (users) => !blockedUsers?.some((userTwo) => users.id == userTwo.id)
  );

  const activeList = filteredUsers?.slice().sort((a, b) => {
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
          marginTop: RFValue(90)
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
          data: activeList || [],
          renderItem: _renderItem,
          ListEmptyComponent: <Skeleton />,
          showsVerticalScrollIndicator: false,
          keyExtractor: ({ id }: PassportInterface) => id,
          contentContainerStyle: { flexGrow: 1, paddingBottom: 120 + bottom }
        }}
      />
    </Portal>
  );
}

export default React.memo(ActiveModal);
