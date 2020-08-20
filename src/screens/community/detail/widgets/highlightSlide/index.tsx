import React, { useState, Fragment } from 'react';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import MembersCard from '../../../../../components/recommendedUser';
import {
  GET_NEARBY_MEMBERS,
  GET_SINGLE_COMMUNITY
} from '../../../../../graphql/server/query';
import JoinCommunity from '../../../../../components/joinCommunity';

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

  const { data: communityData } = useQuery(GET_SINGLE_COMMUNITY, {
    variables: {
      id
    }
  });

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const NearbyMembers = nearbyData?.nearbyMembers;
  const SingleCommunity = communityData?.Community[0];

  return (
    <Fragment>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
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
                style={{ width: '20%', height: '50%' }}
              />
              <TextContainer>
                <Title
                  style={{
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
                    lineHeight: RFValue(13),
                    color: colors.SECONDARY_TEXT
                  }}
                >
                  {SingleCommunity?.membersCount}{' '}
                  {t(`community.tabPanel.member`)}
                </Paragraph>
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
              </TextContainer>
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
                    <TagText key={identity}>{identity}</TagText>
                  ))}
                </Tags>
              </TagContainer>
            ) : null}
          </Card>
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
              <ScrollView
                horizontal={true}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginTop: RFValue(15) }}
              >
                {NearbyMembers?.map((member: any, index: number) => (
                  <MembersCard
                    key={member.id}
                    {...member}
                    index={index}
                    lastChild={NearbyMembers.length - 1}
                  />
                ))}
              </ScrollView>
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
