import React, { Fragment, useState } from 'react';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';
import PopularCommunities from '../../../../../libs/popularCommunities/index.json';
import PopularCommunity from '../../../../../components/popularCommunity';
import RecommendedCommunity from '../../../../../components/recommendedCommunity';
import RecommendedCommunityData from '../../../../../libs/featuredCommunity/index.json';
import JoinCommunity from '../../../../../components/joinCommunity';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, CommunityWrapper, PopularContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CommunitySlideScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ showJoinCommunityModal: false });

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
              marginBottom: RFValue(20)
            }}
          >
            {t(`community.tabPanel.featured`)}
          </Title>
          <RecommendedCommunity
            avatar={RecommendedCommunityData.avatar}
            name={RecommendedCommunityData.name}
            members={RecommendedCommunityData.members}
            onPress={handleJoinCommunity}
          />
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

            {PopularCommunities.map((community, index) => (
              <PopularCommunity
                key={index}
                name={community.name}
                avatar={community.avatar}
                members={community.members}
              />
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
