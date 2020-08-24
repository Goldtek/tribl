import React, { Fragment, useState } from 'react';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import PopularCommunity from '../../../../../components/popularCommunity';
import RecommendedCommunity from '../../../../../components/recommendedCommunity';
import JoinCommunity from '../../../../../components/joinCommunity';
import {
  GET_RECOMMENDED_COMMUNITIES,
  GET_POPULAR_COMMUNITIES
} from '../../../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, CommunityWrapper, PopularContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function CommunitySlideScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ showJoinCommunityModal: false });

  const { data: communityData } = useQuery(GET_RECOMMENDED_COMMUNITIES);
  const { data: popularData } = useQuery(GET_POPULAR_COMMUNITIES);

  const community = communityData?.recommendedCommunities[2];
  const popular = popularData?.popularCommunities;

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  return (
    <Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Container>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              paddingLeft: RFValue(15),
              marginBottom: RFValue(15)
            }}
          >
            {t(`community.tabPanel.featured`)}
          </Title>
          <RecommendedCommunity {...community} onPress={handleJoinCommunity} />
          <PopularContainer>
            <CommunityWrapper>
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
                {t(`community.tabPanel.popular`)}
              </Title>

              <TouchableRipple
                onPress={() => {}}
                rippleColor={colors.PRIMARY}
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
                      marginRight: 5
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
            </CommunityWrapper>

            {popular?.map((community: any) => (
              <PopularCommunity key={community.id} {...community} />
            ))}
          </PopularContainer>
        </Container>
      </ScrollView>
      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}

export default React.memo(CommunitySlideScreen);
