import React, {
  Fragment,
  useMemo,
  useEffect,
  useCallback,
  useState
} from 'react';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import MembersCard from '../../../../../components/previewRecommendedUser';
import {
  GET_NOAUTH_NEARYBY_MEMBERS,
  GET_COMMUNITY_MEMBERS
} from '../../../../../graphql/server/query';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import {
  CommunityInterface,
  PassportInterface,
  CommunityMembersRequestInterface
} from '../../../../../graphql/types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import hexToRGB from '../../../../../utils/hexToRGB';
import removeDuplicateMembers from '../../../../../utils/removeDuplicatePassports';
import SignupModal from '../../../../../components/signupModal';

import {
  Tags,
  TagText,
  Container,
  CardContainer,
  TextContainer,
  TagContainer
} from './styles';

interface singleCommunityScreenProp extends NavigationInterface {
  route: {
    communityDetails: CommunityInterface;
    communityRefetch: () => Promise<void>;
  };
}

export default function SingleCommunity(props: singleCommunityScreenProp) {
  const { communityDetails } = props.route;
  //@ts-ignore
  const location = communityDetails?.location;
  const {
    id,
    tags,
    name,
    avatar,
    isPrivate,
    description,
    membersCount
  } = communityDetails;

  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);

  const showSignupModal = useCallback(
    (visible: boolean) => () => {
      setVisible(visible);
      return true;
    },
    []
  );

  useEffect(() => {
    if (isFocused) {
      setVisible(true);
    }
  }, [isFocused]);

  useEffect(() => {
    tagScreenName('TribeDetailScreen');
  }, []);

  const { data: communityMembersData } = useQuery(GET_NOAUTH_NEARYBY_MEMBERS, {
    variables: {
      input: {
        communityId: id,
        currentLocation: {
          lat: location?.lat,
          long: location?.long,
          city: location?.city,
          state: location?.state,
          country: location?.country
        }
      }
    }
  });

  const { data: NearbyMembers } = useQuery(GET_NOAUTH_NEARYBY_MEMBERS, {
    variables: {
      input: {
        currentLocation: {
          lat: location?.lat,
          long: location?.long,
          city: location?.city,
          state: location?.state,
          country: location?.country
        }
      }
    }
  });

  const { data: communityMembers } = useQuery<CommunityMembersRequestInterface>(
    GET_COMMUNITY_MEMBERS,
    { variables: { input: { filter: { communityId: id } } } }
  );

  const participants = communityMembers?.communityMembers?.data;
  const communityNearbyMembers =
    communityMembersData?.noAuthNearbyMembers?.data;
  const nearbyMembersData = NearbyMembers?.noAuthNearbyMembers?.data;

  const filterNearbyMebers = removeDuplicateMembers(nearbyMembersData?.slice());

  const filterCommunityNearbyMembers = removeDuplicateMembers(
    communityNearbyMembers?.slice()
  );

  const filterParticiant = removeDuplicateMembers(participants?.slice());

  const nearbyMembers = filterCommunityNearbyMembers?.length
    ? filterCommunityNearbyMembers
    : filterParticiant?.length
    ? filterParticiant
    : filterNearbyMebers;

  const _renderRecommendedMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <MembersCard key={item.id} {...item} />
    ),
    []
  );

  return (
    <Fragment>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Container>
          <Fragment>
            <Card style={{ height: RFValue(230) }}>
              <Card.Content
                style={{
                  paddingHorizontal: RFValue(5),
                  paddingVertical: RFValue(5)
                }}
              >
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri: avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{ width: '100%', height: '100%', borderRadius: 4 }}
                />
                <Text
                  style={{
                    fontSize: RFValue(fonts.LARGE_SIZE - 1),
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    color: colors.BLACK,
                    backgroundColor: hexToRGB(colors.WHITE, 0.3),
                    position: 'absolute',
                    right: RFValue(15),
                    paddingHorizontal: RFValue(10),
                    paddingVertical: RFValue(5),
                    marginTop: RFValue(10),
                    textTransform: 'capitalize'
                  }}
                >
                  {isPrivate ? 'Private' : 'Public'}
                </Text>
              </Card.Content>
            </Card>
            <Card style={{ marginTop: RFValue(5) }}>
              <CardContainer>
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri: avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(50),
                    height: RFValue(50),
                    borderRadius: 4
                  }}
                />
                <TextContainer>
                  <Title
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                      lineHeight: RFValue(19)
                    }}
                  >
                    {name}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(10),
                      color: colors.SECONDARY_TEXT
                    }}
                  >
                    {membersCount <= 1
                      ? `${membersCount} ${t('community.tabPanel.member')}`
                      : `${membersCount} ${t('community.tabPanel.member')}s`}
                  </Paragraph>
                  {description ? (
                    <Paragraph
                      style={{
                        fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        lineHeight: 18,
                        color: colors.PRIMARY_TEXT
                      }}
                    >
                      {description}
                    </Paragraph>
                  ) : null}
                </TextContainer>
              </CardContainer>

              {tags?.length ? (
                <TagContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'uppercase'
                    }}
                  >
                    {t(`community.tabPanel.tag`)}
                  </Title>

                  <Tags>
                    {tags.map((identity: any) => (
                      <TagText key={identity.id}>{identity.name}</TagText>
                    ))}
                  </Tags>
                </TagContainer>
              ) : null}
            </Card>
          </Fragment>
          <Card style={{ marginTop: RFValue(5) }}>
            <Card.Content style={{ paddingLeft: 0 }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginTop: 0,
                  marginBottom: 0,
                  paddingLeft: 15
                }}
              >
                {t(`community.tabPanel.nearby`)}
              </Title>

              <FlatList
                data={nearbyMembers}
                horizontal={true}
                renderItem={_renderRecommendedMember}
                ListEmptyComponent={
                  <RecommendedUserSkeleton skeletonSize={4} />
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 5,
                  paddingHorizontal: 15,
                  paddingBottom: RFValue(100)
                }}
              />
            </Card.Content>
          </Card>
        </Container>
        <SignupModal
          closeSignupModal={showSignupModal(false)}
          isVisible={visible}
        />
      </ScrollView>
    </Fragment>
  );
}
