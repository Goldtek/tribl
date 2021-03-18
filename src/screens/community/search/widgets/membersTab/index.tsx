import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react';
import { ScrollView, FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import RecommendedMembers from '../../../../../components/recommendedUser';
import {
  GET_NEARBY_MEMBERS,
  GET_RECOMMENDED_MEMBERS
} from '../../../../../graphql/server/query';
import NearbyModal from '../../../../../components/nearby';
import ActiveModal from '../../../../../components/activeMembers';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import {
  NearbyMembersRequestInterface,
  PassportInterface,
  RecommendedMembersRequestInterface
} from '../../../../../graphql/types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, RecommendedList, RecommendedListHeader } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function MemberSTabScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('ViewAllMembers');
  }, []);

  const [nearbyVisible, setNearbyVisble] = useState(false);

  const [visible, setVisible] = useState(false);

  const showNearbyModal = useCallback(
    (visible: boolean) => () => {
      setNearbyVisble(visible);
      return true;
    },
    []
  );

  const showActiveModal = useCallback(
    (visible: boolean) => () => {
      setVisible(visible);
      return true;
    },
    []
  );

  const { data: membersData } = useQuery<RecommendedMembersRequestInterface>(
    GET_RECOMMENDED_MEMBERS,
    {
      variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
    }
  );

  const recommendedMembers = membersData?.recommendedMembers?.data;

  const { data: nearbyData } = useQuery<NearbyMembersRequestInterface>(
    GET_NEARBY_MEMBERS,
    {
      variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
    }
  );

  const nearbyMembers = nearbyData?.nearbyMembers?.data;

  const _renderNearbyMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <RecommendedMembers key={item.id} {...item} />
    ),
    []
  );

  const _renderRecommendedMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <RecommendedMembers key={item.id} {...item} />
    ),
    []
  );

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      style={{ flexGrow: 1 }}
    >
      <Container>
        <RecommendedList>
          <RecommendedListHeader>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: 20,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {t(`community.recommended.members`)}
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={showActiveModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 15,
                padding: 5
              }}
            >
              <Fragment>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize',
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 5
                  }}
                >
                  {t(`community.tabPanel.view`)}
                </Paragraph>
                <Feather
                  name="arrow-right"
                  size={RFValue(fonts.LARGE_SIZE)}
                  color={colors.PRIMARY_TEXT}
                />
              </Fragment>
            </TouchableRipple>
          </RecommendedListHeader>
          <FlatList
            data={recommendedMembers}
            horizontal={true}
            renderItem={_renderRecommendedMember}
            ListEmptyComponent={<RecommendedUserSkeleton skeletonSize={4} />}
            showsHorizontalScrollIndicator={false}
            keyExtractor={({ id }) => id}
            contentContainerStyle={{ marginTop: 20, paddingLeft: 15 }}
          />
        </RecommendedList>
        <RecommendedList>
          <RecommendedListHeader>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: 20,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {t(`community.tabPanel.nearby`)}
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={showNearbyModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 15,
                padding: 5
              }}
            >
              <Fragment>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize',
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 5
                  }}
                >
                  {t(`community.tabPanel.view`)}
                </Paragraph>
                <Feather
                  name="arrow-right"
                  size={RFValue(fonts.LARGE_SIZE)}
                  color={colors.PRIMARY_TEXT}
                />
              </Fragment>
            </TouchableRipple>
          </RecommendedListHeader>
          <FlatList
            data={nearbyMembers}
            horizontal={true}
            renderItem={_renderNearbyMember}
            ListEmptyComponent={<RecommendedUserSkeleton skeletonSize={4} />}
            showsHorizontalScrollIndicator={false}
            keyExtractor={({ id }) => id}
            contentContainerStyle={{ marginTop: 20, paddingLeft: 15 }}
          />
        </RecommendedList>
      </Container>
      <NearbyModal
        closeNearbyModal={showNearbyModal(false)}
        isVisible={nearbyVisible}
      />
      <ActiveModal
        closeActiveModal={showActiveModal(false)}
        isVisible={visible}
      />
    </ScrollView>
  );
}

export default React.memo(MemberSTabScreen);
