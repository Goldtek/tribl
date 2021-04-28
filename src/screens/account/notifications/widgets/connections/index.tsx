import React, { useEffect } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface GeneralSlideProp extends NavigationInterface {}

export default function GeneralSlide(props: GeneralSlideProp) {
  const { colors, fonts } = useThemeContext();

  useEffect(() => {
    tagScreenName('NotificationScreen');
  }, []);

  return (
    <Container>
      <Title
        style={{
          color: colors.PRIMARY_TEXT,
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          marginTop: RFValue(20),
          marginLeft: RFValue(10),
          textTransform: 'capitalize'
        }}
      >
        General Notification
      </Title>
    </Container>
  );
}
