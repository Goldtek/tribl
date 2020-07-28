import React, { Fragment } from 'react';
import { NavigationInterface } from '../../../../types';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TouchableRipple
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useThemeContext } from '../../../../../theme';
import PopularCommunities from '../../../../../libs/popularCommunities/index.json';
import PopularCommunity from '../../../../../components/popularCommunity';
import RecommendedCommunity from '../../../../../components/recommendedCommunity';
import RecommendedCommunityData from '../../../../../libs/featuredCommunity/index.json';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, CommunityWrapper, PopularContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CommunitySlideScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  return (
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
          featured community
        </Title>
        <RecommendedCommunity
          avatar={RecommendedCommunityData.avatar}
          name={RecommendedCommunityData.name}
          members={RecommendedCommunityData.members}
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
              popular communities
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
                  view all
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
  );
}
