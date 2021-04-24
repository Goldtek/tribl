import React, { Fragment, useState, useEffect } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../config';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import {
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  JOIN_PRIVATE_COMMUNITY
} from '../../graphql/server/mutations';
import {
  GET_COMMUNITY_MEMBERS,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY
} from '../../graphql/server/query';
import { logEvent } from '../../utils/uxcamHelper';
import Storage from '../../libs/storage';
import { crashlytics } from '../../firebase/config';
import { CommunityInterface } from '../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularCommunityProp extends CommunityInterface {
  refetchCommunity: () => Promise<void>;
}

function PopularCommunity(props: PopularCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    id,
    name,
    avatar,
    isMember,
    isPrivate,
    isRequested,
    membersCount,
    refetchCommunity
  } = props;

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(
    t(`community.recommended.join`)
  );

  const handleNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props,
      showModal: modal,
      showModalCount: 1
    });
  };

  useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { input: { filter: { communityId: id } } }
  });

  useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY, {
    variables: { input: { communityId: id } }
  });

  useEffect(() => {
    if (isMember) {
      setButtonLabel(t(`community.recommended.leave`));
    } else if (isRequested) {
      setButtonLabel(t(`community.tabPanel.request`));
    } else {
      setButtonLabel(t(`community.recommended.join`));
    }
  }, [isMember, isRequested]);

  const [joinPrivateCommunity] = useMutation(JOIN_PRIVATE_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const handleJoin = async () => {
    logEvent('join community', { from: 'community' });
    try {
      Mixpanel.track('User Joins Tribe', {
        info: `User Joins ${name} Tribe`,
        'Activity Screen': 'Popular Community Card'
      });
      setLoading(true);
      await joinCommunity();
      refetchCommunity().then(() => setLoading(false));
      Storage.setTagModal({ community: [id] });
      setModal(true);
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleJoinPrivateTribe = async () => {
    logEvent('request to join private community', { from: 'community' });
    try {
      Mixpanel.track('User Requests To Join Tribe', {
        info: `User Request To Join ${name} Tribe`,
        'Activity Screen': 'Popular Community Card'
      });
      setLoading(true);
      await joinPrivateCommunity();
      refetchCommunity().then(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(error);
    }
  };

  const handleLeave = async () => {
    logEvent('leave community', { from: 'community' });
    try {
      Mixpanel.track('User Leaves Tribe', {
        info: `User Leaves ${name} Tribe`,
        'Activity Screen': 'Popular Community Card'
      });
      setLoading(true);
      await leaveCommunity();
      refetchCommunity().then(() => setLoading(false));
      Storage.removeTagModal(id);
      setModal(false);
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      style={{
        height: RFValue(100),
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{
            width: RFValue(90),
            height: RFValue(90),
            borderRadius: RFValue(5)
          }}
        />
        <TextContainer>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
              lineHeight: RFValue(20)
            }}
          >
            {name}
          </Title>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(19),
              color: colors.SECONDARY_TEXT
            }}
          >
            {membersCount <= 1
              ? `${membersCount} ${t(`community.tabPanel.member`)}`
              : `${membersCount} ${t(`community.tabPanel.member`)}s`}
          </Paragraph>

          <Button
            mode="text"
            disabled={isRequested ? true : false}
            loading={loading}
            onPress={
              isMember
                ? handleLeave
                : isPrivate
                ? handleJoinPrivateTribe
                : handleJoin
            }
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY,
              textTransform: 'uppercase',
              marginHorizontal: loading ? 15 : 0
            }}
            contentStyle={{ justifyContent: 'flex-start' }}
            style={{ width: '40%' }}
          >
            {buttonLabel}
          </Button>
        </TextContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(PopularCommunity, () => false);
