import React from 'react';
import { NavigationInterface } from '../../types';
import { Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import MembersCard from '../../../components/recommendedUser';
import MembersData from '../../../libs/recommendedUsers/index.json';
import { Container, CardContainer, TextContainer } from './styles';

interface SingleCommunityScreenProp extends NavigationInterface {}

export default function SingleCommunity(props: SingleCommunityScreenProp) {
  const { colors, fonts } = useThemeContext();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container>
        <Card style={{ marginTop: RFValue(5) }}>
          <Card.Content>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: 'https://www.linkpicture.com/q/Rectangle-159.png',
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
                uri: 'https://www.linkpicture.com/q/Rectangle-159.png',
                priority: FastImage.priority.high
              }}
              style={{
                width: RFValue(100),
                height: RFValue(100)
              }}
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
                black lives matter
              </Title>
              <Paragraph
                style={{
                  fontSize: fonts.MEDIUM_SIZE - 1,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  lineHeight: RFValue(13),
                  color: colors.DARK_TEXT
                }}
              >
                100k members
              </Paragraph>
              <Paragraph
                style={{
                  fontSize: fonts.MEDIUM_SIZE - 1,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  lineHeight: RFValue(13),
                  color: colors.PRIMARY_TEXT
                }}
              >
                We are a global community of block migrants and locals looking
                to make connections
              </Paragraph>
            </TextContainer>
            <Paragraph
              style={{
                marginLeft: 'auto',
                marginRight: RFValue(10),
                color: colors.PRIMARY,
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                alignSelf: 'flex-start',
                textTransform: 'uppercase',
                marginTop: RFValue(20)
              }}
            >
              join
            </Paragraph>
          </CardContainer>
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
              recommended members
            </Title>
            <ScrollView
              horizontal={true}
              alwaysBounceHorizontal={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: RFValue(15) }}
            >
              {MembersData.map((members, index) => (
                <MembersCard
                  key={index}
                  index={index}
                  lastChild={MembersData.length - 1}
                  avatar={members.avatar}
                  name={members.name}
                  address={members.address}
                />
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      </Container>
    </ScrollView>
  );
}
