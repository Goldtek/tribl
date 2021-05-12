import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Switch, TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import { Title, Text, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { CloudinaryUploadType } from '../../../../../utils/cloudinaryUpload';
import { Toast } from '../../../../../components/rootToaster';
import Input from '../../../../../components/input';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../../../../../components/gradientButton';
import { crashlytics } from '../../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Cover, PrivateCover, Container, AvatarCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

type StateType = {
  uri: string;
  loading: boolean;
  secure_url: string;
  formData: FormData | null;
  imageData: CloudinaryUploadType;
};

export default function CreateTribeScreen(props: ScreenProp) {
  const { navigation } = props;

  const { t } = useTranslation();
  const [name, setName] = useState('');
  const { colors, fonts } = useThemeContext();
  const [isEnabled, setIsEnabled] = useState(false);

  const [avatar, setAvatar] = useState<StateType>({
    uri: '',
    secure_url: '',
    loading: false,
    formData: null,
    imageData: { uri: '', mime: undefined, cropRect: null }
  });

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
  };

  const handleInputError = (error: string) => {
    Toast.show(t(`community.createTribe.${error}`));
  };

  useEffect(() => {
    const grantMediaPermission = async () => {
      if (Platform.OS !== 'web') {
        // @ts-ignore
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    };

    grantMediaPermission();
  }, []);

  const handleAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (result.cancelled) return;
      const { type, width, height, base64 } = result;
      const uri = `data:${type}/jpg;base64,${base64}`;
      const imageData = { uri, mime: type, cropRect: { width, height } };
      setAvatar({ ...avatar, uri, imageData });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleNavigation = () => {
    if (!name) {
      return handleInputError('nameError');
    }

    if (!avatar?.uri) {
      return handleInputError('avatarError');
    }

    navigation.navigate('AddAdminScreen', {
      name: name,
      image: avatar,
      private: isEnabled
    });
  };

  return (
    <ScrollView
      bounces={false}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: colors.WHITE,
        paddingBottom: RFValue(20)
      }}
    >
      <StatusBar translucent animated style="dark" />
      <Cover>
        <Title
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            marginTop: RFValue(10)
          }}
        >
          {t(`community.createTribe.createTribe`)}
        </Title>
        <Text
          style={{
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.SECONDARY_TEXT
          }}
        >
          {t(`community.createTribe.change`)}
        </Text>
        <Title
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            marginTop: RFValue(10)
          }}
        >
          {t(`community.createTribe.name`)}
        </Title>
        <Input
          defaultValue={name}
          onChangeText={(name) => setName(name)}
          placeholder={t(`community.createTribe.placeholder`)}
          contanierStyle={{ height: 45, paddingLeft: RFValue(10) }}
        />
      </Cover>
      <Divider style={{ marginTop: RFValue(20) }} />
      <Cover>
        <PrivateCover>
          <Title
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE + 3),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginTop: RFValue(10)
            }}
          >
            {isEnabled
              ? t(`community.createTribe.private`)
              : t(`community.createTribe.public`)}
          </Title>
          <Switch
            trackColor={{ false: colors.DISABLED, true: colors.ONLINE }}
            thumbColor={colors.WHITE}
            ios_backgroundColor={colors.DISABLED}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
          />
        </PrivateCover>
        <Text
          style={{
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.SECONDARY_TEXT
          }}
        >
          {isEnabled
            ? t(`community.createTribe.privateText`)
            : t(`community.createTribe.publicText`)}
        </Text>
      </Cover>
      <Divider style={{ marginTop: RFValue(20) }} />
      <AvatarCover>
        <TouchableHighlight
          onPress={handleAvatar}
          underlayColor={colors.PRIMARY}
          style={{
            width: RFValue(300),
            height: RFValue(200),
            borderColor: colors.PRIMARY,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: RFValue(10),
            marginTop: RFValue(15)
          }}
        >
          {avatar.uri ? (
            <FastImage
              source={{
                uri: avatar.uri,
                priority: FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Container
              style={{
                width: RFValue(80),
                height: RFValue(80),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.PRIMARY,
                borderRadius: RFValue(60)
              }}
            >
              <Container
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  borderRadius: RFValue(50),
                  backgroundColor: colors.DISABLED,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Feather
                  name="camera"
                  size={RFValue(17)}
                  color={colors.PRIMARY}
                />
              </Container>
            </Container>
          )}
        </TouchableHighlight>
      </AvatarCover>
      <Text
        style={{
          fontSize: RFValue(fonts.LARGE_SIZE - 2),
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize',
          textAlign: 'center',
          marginTop: RFValue(10)
        }}
      >
        {avatar.uri
          ? t(`community.createTribe.photoAdded`)
          : t(`community.createTribe.addPhoto`)}
      </Text>
      <Cover>
        <GradientButton
          onPress={handleNavigation}
          loading={avatar.loading}
          style={{ height: RFValue(45) }}
          contentStyle={{ height: RFValue(45) }}
          gradientContainerstyle={{
            height: RFValue(45),
            marginTop: RFValue(70)
          }}
        >
          {t(`community.createTribe.next`)}
        </GradientButton>
      </Cover>
    </ScrollView>
  );
}
