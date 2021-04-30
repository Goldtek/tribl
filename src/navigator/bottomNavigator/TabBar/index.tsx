import React, { Fragment } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import {
  MyPassportInterface,
  ShowMessageNotificationBadge
} from '../../../graphql/types';
import InboxIcon from '../../../../assets/icons/inboxIcon';
import { GET_MESSAGE_NOTIFICATION_BADGE } from '../../../graphql/cache/query';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import CommunityIcon from '../../../../assets/icons/communityIcon';
import { useTranslation } from 'react-i18next';
import { USER_DEFAULT_AVATAR } from '../../../constants';

import {
  Label,
  SafeArea,
  Container,
  BadgeWrapper,
  TabBarButton,
  IconContainer
} from './styles';
import { Entypo } from '@expo/vector-icons';

enum TabBarNames {
  InboxScreen = 'inbox',
  CommunityScreen = 'community',
  PassportScreen = 'passport'
}

const MyTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data } = useQuery<ShowMessageNotificationBadge>(
    GET_MESSAGE_NOTIFICATION_BADGE
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  return (
    <Container>
      <SafeArea insets={insets}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          //@ts-ignore
          const title = TabBarNames[route.name];
          const color = isFocused ? colors.PRIMARY : colors.SECONDARY_TEXT;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabBarButton
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              key={route.name}
            >
              <IconContainer>
                {title === TabBarNames.CommunityScreen && (
                  <CommunityIcon fillColor={color} height={20} />
                )}
                {title === TabBarNames.InboxScreen && (
                  <Fragment>
                    <Entypo name="chat" size={20} color={color} />
                    {data?.showMessageNotificationBadge && <BadgeWrapper />}
                  </Fragment>
                )}
                {title === TabBarNames.PassportScreen && (
                  <Fragment>
                    <FastImage
                      source={{
                        uri: userData?.myPassport.avatar || USER_DEFAULT_AVATAR,
                        priority: FastImage.priority.high
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 25 / 2
                      }}
                    />
                  </Fragment>
                )}
                <Label style={{ color }} numberOfLines={1}>
                  {t(`community.bottomLabels.${title}`)}
                </Label>
              </IconContainer>
            </TabBarButton>
          );
        })}
      </SafeArea>
    </Container>
  );
};

export default MyTabBar;
