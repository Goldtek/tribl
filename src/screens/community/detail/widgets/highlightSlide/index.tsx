import React, { useState, Fragment, useMemo } from 'react';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import MembersCard from '../../../../../components/recommendedUser';
import {
  GET_NEARBY_MEMBERS,
  GET_SINGLE_COMMUNITY
} from '../../../../../graphql/server/query';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import JoinCommunity from '../../../../../components/joinCommunity';
import Skeleton from './widget';

import {
  Container,
  CardContainer,
  TextContainer,
  TagContainer,
  Tags,
  TagText
} from './styles';

interface SingleCommunityScreenProp extends NavigationInterface {}

export default function SingleCommunity(props: SingleCommunityScreenProp) {
  const detail = props.route;
  const { communityDetails } = detail;
  const { id } = communityDetails;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ showJoinCommunityModal: false });

  const { data: nearbyData } = useQuery(GET_NEARBY_MEMBERS);

  const { loading, data: communityData } = useQuery(GET_SINGLE_COMMUNITY, {
    variables: { id }
  });

  const nearbyMembers = nearbyData?.nearbyMembers;
  const SingleCommunity = communityData?.Community[0];

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const _renderRecommendedMember = useMemo(
    () => ({ item, index }: any) => (
      <MembersCard
        key={item.id}
        {...item}
        index={index}
        lastChild={nearbyMembers?.length - 1}
      />
    ),
    []
  );

  return (
    <Fragment>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          {loading ? (
            <Skeleton />
          ) : (
            <Fragment>
              <Card style={{ marginTop: RFValue(5) }}>
                <Card.Content>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: SingleCommunity?.avatar,
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: '100%',
                      height: RFValue(100)
                    }}
                  />
                </Card.Content>
              </Card>
              <Card style={{ marginTop: RFValue(5) }}>
                <CardContainer>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: SingleCommunity?.avatar,
                      priority: FastImage.priority.high
                    }}
                    style={{ width: '25%', height: '50%' }}
                  />
                  <TextContainer>
                    <Title
                      style={{
                        color: colors.PRIMARY_TEXT,
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        fontSize: fonts.LARGE_SIZE,
                        textTransform: 'capitalize',
                        lineHeight: RFValue(19)
                      }}
                    >
                      {SingleCommunity?.name}
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: fonts.MEDIUM_SIZE - 1,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        lineHeight: RFValue(10),
                        color: colors.SECONDARY_TEXT
                      }}
                    >
                      {SingleCommunity?.membersCount}{' '}
                      {t(`community.tabPanel.member`)}
                    </Paragraph>
                    {SingleCommunity?.description ? (
                      <Paragraph
                        style={{
                          fontSize: fonts.MEDIUM_SIZE - 1,
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          lineHeight: RFValue(13),
                          color: colors.PRIMARY_TEXT
                        }}
                      >
                        {SingleCommunity?.description}
                      </Paragraph>
                    ) : null}
                  </TextContainer>
                  {SingleCommunity?.isMember ? (
                    <Button
                      mode="contained"
                      style={{
                        width: '22%',
                        height: RFValue(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                      }}
                      labelStyle={{
                        fontSize: fonts.LARGE_SIZE,
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        color: colors.WHITE,
                        textTransform: 'capitalize'
                      }}
                      onPress={() => {}}
                    >
                      {t(`community.tabPanel.leave`)}
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      style={{
                        width: '20%',
                        height: RFValue(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                      }}
                      labelStyle={{
                        fontSize: fonts.LARGE_SIZE,
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        color: colors.WHITE,
                        textTransform: 'capitalize'
                      }}
                      onPress={handleJoinCommunity}
                    >
                      {t(`community.tabPanel.join`)}
                    </Button>
                  )}
                </CardContainer>

                {SingleCommunity?.interests?.length ? (
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
                      {SingleCommunity?.interests.map((identity: any) => (
                        <TagText key={identity.id}>{identity.name}</TagText>
                      ))}
                    </Tags>
                  </TagContainer>
                ) : null}
              </Card>
            </Fragment>
          )}
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
                  marginTop: 20,
                  paddingHorizontal: 15,
                  backgroundColor: colors.WHITE
                }}
              />
            </Card.Content>
          </Card>
        </Container>
      </ScrollView>
      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
