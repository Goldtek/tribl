import React from 'react';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity, ScrollView } from 'react-native';

import { useThemeContext } from '../../../../../theme';
import PopularCommunities from '../../../../../libs/popularCommunities/index.json';
import PopularCommunity from '../../../../../components/popularCommunity';
import { useNavigation } from '@react-navigation/native';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  CommunityWrapper,
  TitleWrapper,
  ViewWrapper,
  PopularContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CommunitySlideScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container>
        <Card
          onPress={() => navigation.navigate('SingleCommunityScreen')}
          style={{
            backgroundColor: colors.OFFWHITE,
            borderWidth: 0,
            shadowColor: colors.TRANSPARENT
          }}
        >
          <Card.Title
            title="featured community"
            titleStyle={{
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase',
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.LARGE_SIZE + 4,
              paddingLeft: RFValue(10)
            }}
          />
          <Card.Content>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: 'https://linkpicture.com/q/Rectangle-62-1.png',
                priority: FastImage.priority.high
              }}
              style={{
                width: '100%',
                height: RFValue(250)
              }}
            />
            <CommunityWrapper>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: 'https://linkpicture.com/q/Rectangle-62-1.png',
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(50),
                  height: RFValue(70)
                }}
              />
              <TitleWrapper>
                <Title
                  style={{
                    color: colors.BLACK,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: fonts.LARGE_SIZE + 1,
                    marginBottom: 0,
                    lineHeight: 23
                  }}
                >
                  The Wave
                </Title>
                <Paragraph
                  style={{
                    color: colors.GREY_TEXT,
                    fontSize: fonts.MEDIUM_SIZE + 1,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    marginTop: 0,
                    lineHeight: 15
                  }}
                >
                  40k members
                </Paragraph>
              </TitleWrapper>
              <Paragraph
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  color: colors.PRIMARY,
                  fontSize: fonts.MEDIUM_SIZE,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  textTransform: 'uppercase'
                }}
              >
                join
              </Paragraph>
            </CommunityWrapper>
          </Card.Content>
        </Card>
        <PopularContainer>
          <CommunityWrapper>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: fonts.LARGE_SIZE + 4,
                textTransform: 'uppercase'
              }}
            >
              popular communities
            </Title>
            <ViewWrapper>
              <Paragraph
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontSize: fonts.MEDIUM_SIZE,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  textTransform: 'capitalize'
                }}
              >
                view all
              </Paragraph>
              <TouchableOpacity onPress={() => {}}>
                <Feather
                  name="arrow-right"
                  size={fonts.LARGE_SIZE + 8}
                  color={colors.PRIMARY_TEXT}
                />
              </TouchableOpacity>
            </ViewWrapper>
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
