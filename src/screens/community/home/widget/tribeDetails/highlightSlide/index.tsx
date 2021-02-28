import React, { useState, Fragment, useEffect } from 'react';
import { NavigationInterface } from '../../../../../types';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  TouchableRipple,
  Text
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../../theme';
import { CREATE_NEW_TRIBE } from '../../../../../../graphql/server/mutations';
import GradientButton from '../../../../../../components/gradientButton';
import { Toast } from '../../../../../../components/rootToaster';
import cloudinaryUpload, {
  CloudinaryResponseType
} from '../../../../../../utils/cloudinaryUpload';
import { useNavigation } from '@react-navigation/native';
import { crashlytics } from '../../../../../../firebase/config';
import hexToRGB from '../../../../../../utils/hexToRGB';

import {
  CardContainer,
  TextContainer,
  TagContainer,
  Tags,
  AddTag,
  DescrptionCover,
  TagButtonCover
} from './styles';

interface newTribeDetailsScreenProp extends NavigationInterface {}

export default function newTribe(props: newTribeDetailsScreenProp) {
  const detail = props.route.communityDetails;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [state, setState] = useState({
    description: '',
    click: false,
    tags: new Map(),
    tagText: ''
  });

  const [avatar, setAvatar] = useState('');

  const avatarUpload = async () => {
    if (detail?.details.image.uri.length) {
      const formData = await cloudinaryUpload(detail?.details.image.imageData);

      const { secure_url } = (await formData.json()) as CloudinaryResponseType;

      setAvatar(secure_url);
    }
  };

  useEffect(() => {
    avatarUpload();
  }, [detail?.details.image.uri]);

  const handleSelect = (selected: string) => {
    if (!state.tags.has(selected)) {
      return setState({
        ...state,
        tags: new Map(state.tags.set(selected, selected)),
        click: false,
        tagText: ''
      });
    }

    state.tags.delete(selected);
    setState({
      ...state,
      tags: new Map(state.tags)
    });
  };

  const selectedTag = [...Array.from(state.tags.values())];

  const membersCount = 1 + detail?.admins?.length;

  const handleInputError = (error: string) => {
    Toast.show(t(`community.createTribe.${error}`));
  };

  enum privacyStatusOptions {
    PRIVATE,
    PUBLIC
  }

  const privacyStatus =
    detail?.details.private === true
      ? privacyStatusOptions[0]
      : privacyStatusOptions[1];

  const [createTribe, { loading }] = useMutation(CREATE_NEW_TRIBE, {
    variables: {
      payload: {
        name: detail?.details?.name,
        privacy: privacyStatus,
        interests: selectedTag,
        description: state.description,
        avatar: avatar,
        isPrivate: detail?.details.private,
        moderators: detail?.admins
      }
    }
  });

  const handleNavigation = async () => {
    if (!state.description) {
      return handleInputError('descrptionError');
    }
    if (!selectedTag?.length) {
      return handleInputError('tagError');
    }
    try {
      const { data } = await createTribe();
      if (data) {
        navigation.navigate('NewTribeScreen', {
          name: detail?.details?.name,
          image: avatar,
          memberCount: membersCount,
          tags: selectedTag,
          description: state.description,
          private: detail?.details.private,
          data: data
        });
      }
    } catch (error) {
      handleInputError('serverError');
      crashlytics.recordError(error);
    }
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="position"
        contentContainerStyle={{ flex: 1 }}
        keyboardVerticalOffset={RFValue(110)}
      >
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
                uri: detail?.details?.image?.uri,
                priority: FastImage.priority.high
              }}
              style={{ width: '100%', height: '100%', borderRadius: 2 }}
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
                uri: detail?.details?.image?.uri,
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
                {detail?.details?.name}
              </Title>
              <Paragraph
                style={{
                  fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  lineHeight: RFValue(10),
                  color: colors.SECONDARY_TEXT
                }}
              >
                {membersCount}{' '}
                {membersCount > 1
                  ? t(`community.createTribe.members`)
                  : t(`community.createTribe.member`)}
              </Paragraph>
              <DescrptionCover>
                <TextInput
                  mode="flat"
                  placeholder={t(
                    `community.createTribe.descriptionPlaceholder`
                  )}
                  multiline={true}
                  onChangeText={(description: string) =>
                    setState({ ...state, description: description })
                  }
                  underlineColor={colors.TRANSPARENT}
                  selectionColor={colors.TRANSPARENT}
                  style={{
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    color: colors.SECONDARY_TEXT,
                    backgroundColor: colors.WHITE,
                    borderBottomWidth: 0,
                    borderColor: colors.TRANSPARENT
                  }}
                />
              </DescrptionCover>
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
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.SECONDARY_TEXT,
                textAlign: 'center',
                paddingTop: RFValue(10)
              }}
            >
              {' '}
              {t(`community.createTribe.tagPlaceholder`)}
            </Text>
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
                {selectedTag?.length ? (
                  <Fragment>
                    {selectedTag?.map((tag) => (
                      <TagButtonCover>
                        <Button
                          key={tag}
                          onPress={() => handleSelect(tag)}
                          style={{
                            marginRight: RFValue(10),
                            marginTop: RFValue(10),
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
                          {tag} {'   '}
                          <Feather
                            name="x"
                            size={RFValue(13)}
                            color={colors.PRIMARY_TEXT}
                            style={{
                              paddingLeft: RFValue(30),
                              paddingRight: RFValue(50)
                            }}
                          />
                        </Button>
                      </TagButtonCover>
                    ))}
                  </Fragment>
                ) : null}
                {state?.click ? (
                  <TextInput
                    placeholder={t(`community.createTribe.interestPlaceholder`)}
                    onChangeText={(tagText: string) =>
                      setState({ ...state, tagText: tagText })
                    }
                    value={state.tagText}
                    onBlur={() => handleSelect(state.tagText)}
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      backgroundColor: colors.WHITE,
                      height: RFValue(30),
                      borderBottomWidth: 2,
                      borderColor: colors.PRIMARY,
                      textTransform: 'capitalize'
                    }}
                  />
                ) : (
                  <TouchableRipple
                    onPress={() => setState({ ...state, click: true })}
                  >
                    <AddTag>+</AddTag>
                  </TouchableRipple>
                )}
              </Tags>
            </TagContainer>
          </Card.Content>
          <GradientButton
            onPress={handleNavigation}
            style={{ height: RFValue(45) }}
            contentStyle={{ height: RFValue(45) }}
            gradientContainerstyle={{
              height: RFValue(45),
              marginTop: RFValue(50),
              marginHorizontal: RFValue(15),
              marginBottom: RFValue(15)
            }}
            loading={loading}
          >
            {t(`community.createTribe.create`)}
          </GradientButton>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
