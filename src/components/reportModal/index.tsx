import React, { useEffect, useRef, useState } from 'react';
import { Text, Title, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/react-hooks';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import GradientButton from '../gradientButton';
import Input from '../input';
import { BLOCK_REPORT_USER } from '../../graphql/server/mutations';
import { Mixpanel } from '../../config';
import { crashlytics } from '../../firebase/config';

import { HeaderContainer, ButtonCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeReportModal(): void;
  data: any;
}

function ReportModal(props: ModalProp) {
  const { isVisible, closeReportModal, data } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  enum status {
    REPORT
  }

  const [note, setNote] = useState('');

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    isVisible ? openModal() : closeModal();
  }, [isVisible]);


  const [reportUser, { loading }] = useMutation(BLOCK_REPORT_USER, {
    variables: {
      payload: {
        passportId: data?.details?.id,
        status: status[0],
        notes: note
      }
    }
  });

  const handleReport = async () => {
    try {
      Mixpanel.track('Report User', {
        info: `Report ${data?.title}`,
        'Activity Screen': 'Member details screen'
      });
      await reportUser();
      closeModal();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  return (
    <Portal>
      <StatusBar translucent animated style="light" />

      <Modalize
        ref={modalizeRef}
        onClose={closeReportModal}
        modalStyle={{
          height: DEVICE_FULL_HEIGHT / 2,
          paddingTop: RFValue(20),
          paddingBottom: RFValue(20),
          marginTop: RFValue(320)
        }}
        HeaderComponent={
          <HeaderContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 3),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                textAlign: 'center',
                lineHeight: 25
              }}
            >
              {t(`community.memberPassport.report`)}
            </Title>
            <Divider
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.INPUT,
                marginTop: RFValue(10)
              }}
            />
          </HeaderContainer>
        }
      >
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.LARGE_SIZE - 1),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            paddingHorizontal: RFValue(15),
            lineHeight: 25
          }}
        >
          {t(`community.memberPassport.reportHeader`)}
        </Title>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            paddingHorizontal: RFValue(15),
            marginVertical: RFValue(5)
          }}
        >
          {t(`community.memberPassport.reportText`)}
        </Text>
        <Input
          placeholder={t(`community.memberPassport.reportHeader`)}
          defaultValue={note}
          multiline={true}
          onChangeText={(note) => setNote(note)}
          textInputStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR
          }}
          contanierStyle={{
            height: RFValue(40),
            width: '92%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: RFValue(20)
          }}
        />
        <ButtonCover>
          <GradientButton
            loading={loading}
            onPress={note?.length ? handleReport : () => {}}
            style={{
              height: 50
            }}
            gradientContainerstyle={{
              height: 50,
              opacity: note?.length ? 1 : 0.7
            }}
            contentStyle={{
              height: 50
            }}
          >
            {t(`community.memberPassport.report`)}
          </GradientButton>
        </ButtonCover>
      </Modalize>
    </Portal>
  );
}

export default React.memo(ReportModal);
