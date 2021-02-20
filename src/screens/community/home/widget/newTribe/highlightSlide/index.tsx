import React, { useState, Fragment } from 'react';
import { NavigationInterface } from '../../../../../types';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../theme';
import GradientButton from '../../../../../../components/gradientButton';
import hexToRGB from '../../../../../../utils/hexToRGB';

import {
  CardContainer,
  TextContainer,
  TagContainer,
  Tags,
  TagButtonCover
} from './styles';
import { useNavigation } from '@react-navigation/native';

interface newTribeScreenProp extends NavigationInterface {}

export default function newTribe(props: newTribeScreenProp) {
  const detail = props.route.communityDetails;
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  enum privacyStatusOptions {
    PRIVATE,
    PUBLIC
  }

  const privacyStatus =
    detail?.private === true
      ? privacyStatusOptions[0]
      : privacyStatusOptions[1];

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'InviteToTribeScreen',
      params: {
        communityId: detail?.data?.createCommunity?.id
      }
    });
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <Card style={{ height: RFValue(200), width: '100%' }}>
        <Card.Content
          style={{
            paddingHorizontal: RFValue(1),
            paddingVertical: RFValue(1)
          }}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: detail?.image,
              priority: FastImage.priority.high
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 2
            }}
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
            {privacyStatus}
          </Text>
        </Card.Content>
      </Card>
      <Card style={{ marginTop: RFValue(5) }}>
        <CardContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: detail?.image,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(60),
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
              {detail?.name}
            </Title>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(10),
                color: colors.SECONDARY_TEXT
              }}
            >
              {detail?.memberCount}{' '}
              {detail?.memberCount > 1
                ? t(`community.createTribe.members`)
                : t(`community.createTribe.member`)}
            </Paragraph>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                fontFamily: fonts.WORK_SANS_REGULAR,
                textAlign: 'left',
                lineHeight: RFValue(13),
                color: colors.PRIMARY_TEXT
              }}
            >
              {detail?.description}
            </Paragraph>
            <TagContainer>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  paddingRight: RFValue(10)
                }}
              >
                {t(`community.tabPanel.tag`)}:
              </Title>
              <Tags>
                {detail?.tags?.length ? (
                  <Fragment>
                    {detail?.tags?.map((tag: string) => (
                      <TagButtonCover>
                        <Button
                          key={tag}
                          onPress={() => {}}
                          style={{
                            marginTop: RFValue(10),
                            marginRight: RFValue(10),
                            borderColor: colors.SECONDARY_TEXT,
                            borderWidth: 1,
                            borderRadius: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                          labelStyle={{
                            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                            fontSize: fonts.MEDIUM_SIZE,
                            color: colors.PRIMARY_TEXT,
                            textTransform: 'capitalize'
                          }}
                        >
                          {tag}
                        </Button>
                      </TagButtonCover>
                    ))}
                  </Fragment>
                ) : null}
              </Tags>
            </TagContainer>
          </TextContainer>
        </CardContainer>
      </Card>
      <Card style={{ marginTop: RFValue(5) }}>
        <Card.Content
          style={{
            paddingHorizontal: RFValue(10),
            paddingVertical: RFValue(1)
          }}
        >
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 1),
              textTransform: 'capitalize',
              marginTop: RFValue(10)
            }}
          >
            {t(`community.createTribe.invite`)}
          </Title>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.SECONDARY_TEXT
            }}
          >
            {t(`community.createTribe.inviteText`)}
          </Paragraph>
          <GradientButton
            onPress={handleNavigation}
            style={{ height: RFValue(40) }}
            contentStyle={{ height: RFValue(40) }}
            gradientContainerstyle={{
              height: RFValue(40),
              marginHorizontal: RFValue(25),
              marginBottom: RFValue(15)
            }}
          >
            {t(`community.createTribe.invite`)}
          </GradientButton>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
