import React from 'react';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity, ScrollView } from 'react-native';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderContainer,
  TitleWrapper,
  BackWrapper
} from './styles';
import RecommendedMembers from '../../../../../components/recommendedUser';
import MembersData from '../../../../../libs/recommendedUsers/index.json';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
      <Container>
        <HeaderContainer>
          <TitleWrapper>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 4),
                textTransform: 'capitalize'
              }}
            >
              most active members
            </Title>
            <BackWrapper>
              <Paragraph
                style={{
                  marginLeft: 'auto',
                  marginRight: RFValue(5),
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.MEDIUM_SIZE,
                  textTransform: 'capitalize'
                }}
              >
                View All
              </Paragraph>
              <TouchableOpacity onPress={() => {}}>
                <Feather
                  name="arrow-right"
                  size={fonts.LARGE_SIZE + 8}
                  color={colors.PRIMARY_TEXT}
                />
              </TouchableOpacity>
            </BackWrapper>
          </TitleWrapper>
        </HeaderContainer>
        <ScrollView
          horizontal={true}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: RFValue(15),
            marginBottom: RFValue(15),
            paddingLeft: RFValue(10)
          }}
        >
          {MembersData.map((members, index) => (
            <RecommendedMembers
              key={index}
              avatar={members.avatar}
              name={members.name}
              address={members.address}
            />
          ))}
        </ScrollView>
        <HeaderContainer>
          <TitleWrapper>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 4),
                textTransform: 'capitalize',
                shadowColor: colors.TRANSPARENT
              }}
            >
              members nearby
            </Title>
            <BackWrapper>
              <Paragraph
                style={{
                  marginLeft: 'auto',
                  marginRight: RFValue(5),
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.MEDIUM_SIZE,
                  textTransform: 'capitalize'
                }}
              >
                View All
              </Paragraph>
              <TouchableOpacity onPress={() => {}}>
                <Feather
                  name="arrow-right"
                  size={fonts.LARGE_SIZE + 8}
                  color={colors.PRIMARY_TEXT}
                />
              </TouchableOpacity>
            </BackWrapper>
          </TitleWrapper>
        </HeaderContainer>
        <ScrollView
          horizontal={true}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: RFValue(15), paddingLeft: RFValue(10) }}
        >
          {MembersData.map((members, index) => (
            <RecommendedMembers
              key={index}
              avatar={members.avatar}
              name={members.name}
              address={members.address}
            />
          ))}
        </ScrollView>
      </Container>
    </ScrollView>
  );
}
