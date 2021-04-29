import React, { useState, Fragment } from 'react';
import { Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
//@ts-ignore
import { FlatFeed, Activity } from 'expo-activity-feed';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import { chatClient } from '../../../../../stream/types';
import { GET_USER_PASSPORT } from '../../../../../graphql/server/query';
import GradientButton from '../../../../../components/gradientButton';
import ActivityCard from '../activityCard';
import GeneralFeed from './widget/general';
import AdminFeed from './widget/admin';

import { Container, ModalCover } from './styles';

interface tribeScreenProp extends NavigationInterface {}

export default function TribeScreen(props: tribeScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [search, setSearch] = useState({ searchTerm: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const CustomActivity = (props: any) => {
    if (props?.activity?.activityType === 'COMMUNITY') {
      return (
        <Activity
          {...props}
          Header={null}
          Content={
            <ActivityCard
              activityType={props?.activity?.activityType}
              userAvatar={props?.activity?.passport?.avatar}
              tribeAvatar={props?.activity?.community?.avatar}
              message={props.activity.message}
              timeStamp={props.activity.time}
            />
          }
        />
      );
    } else {
      return null;
    }
  };

  const AdminCustomActivity = (props: any) => {
    if (
      props?.activity?.isAdmin == true &&
      props?.activity?.activityType === 'COMMUNITY'
    ) {
      return (
        <Activity
          {...props}
          Header={null}
          Content={
            <ActivityCard
              activityType={props?.activity?.activityType}
              userAvatar={props?.activity?.passport?.avatar}
              tribeAvatar={props?.activity?.community?.avatar}
              message={props.activity.message}
              timeStamp={props.activity.time}
            />
          }
        />
      );
    } else {
      return null;
    }
  };

  const showModal = () => {
    setModalVisible(!modalVisible);
  };

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const tribe = userDetails?.participantOf;
  const moderator = tribe?.filter((item: any) => item.isModerator);

  return (
    <Fragment>
      <Container>
        {moderator?.length ? (
          <TouchableOpacity
            onPress={showModal}
            style={{
              backgroundColor: colors.SHADOW,
              height: RFValue(40),
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                textAlign: 'center',
                marginLeft: 'auto'
              }}
            >
              {isAdmin
                ? t(`community.notification.adminTribe`)
                : t(`community.notification.general`)}
            </Text>
            <FontAwesome
              name="sliders"
              size={20}
              color={colors.PRIMARY_TEXT}
              style={{ marginLeft: 'auto', marginRight: RFValue(15) }}
            />
          </TouchableOpacity>
        ) : null}
        {isAdmin ? <AdminFeed /> : <GeneralFeed />}

        <Modal isVisible={modalVisible}>
          <ModalCover>
            <GradientButton
              onPress={() => {
                setIsAdmin(false);
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.general`)}
            </GradientButton>
            <GradientButton
              onPress={() => {
                setIsAdmin(true);
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.adminTribe`)}
            </GradientButton>
            <Button
              uppercase={false}
              mode="text"
              onPress={showModal}
              style={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
              contentStyle={{ backgroundColor: colors.WHITE }}
              labelStyle={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                color: colors.PRIMARY,
                margin: RFValue(20),
                textAlign: 'center',
                textTransform: 'capitalize'
              }}
            >
              {t(`community.notification.cancel`)}
            </Button>
          </ModalCover>
        </Modal>
      </Container>
    </Fragment>
  );
}
