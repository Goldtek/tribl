import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { Title, Paragraph } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../../components/gradientButton';
import { useThemeContext } from '../../../../theme';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import {
  GET_ALL_INTEREST,
  GET_USER_PASSPORT
} from '../../../../graphql/server/query';
import {
  InterestInterface,
  MyPassportInterface
} from '../../../../graphql/types';
import InterestButton, { InterestsInterface } from './interestButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function InterestModal(props: any) {
  const { isVisible, closeIdentityModal } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [selectedInterests, setSelectedInterests] = useState<{
    [key: string]: InterestsInterface;
  }>({});

  const { data } = useQuery<InterestInterface>(GET_ALL_INTEREST);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  useEffect(() => {
    if (userDetails) {
      const interests = userDetails?.interest.reduce((acc, interests) => {
        //@ts-ignore
        if (!acc[interests.id]) {
          //@ts-ignore
          acc[interests.id] = interests;
        }
        return acc;
      }, {});

      setSelectedInterests({ ...selectedInterests, ...interests });
    }
  }, [userDetails]);

  const handleSelect = (interests: InterestsInterface) => {
    let action = 'removeInterest';
    if (!selectedInterests[interests.id]) {
      action = 'addInterest';
      props.interest(interests, action);
      return setSelectedInterests({
        ...selectedInterests,
        [interests.id]: interests
      });
    }

    props.interest(interests, action);
    const { [interests.id]: deletedInterests, ...rest } = selectedInterests;
    setSelectedInterests({ ...rest });
  };

  const interests = Array.from(new Set(data?.Interest?.data));

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClose={closeIdentityModal}
        modalStyle={{ marginTop: RFValue(30) }}
        modalHeight={DEVICE_FULL_HEIGHT}
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            paddingHorizontal: RFValue(15)
          }}
        >
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
              color: colors.PRIMARY_TEXT,
              lineHeight: RFValue(30),
              marginTop: 20
            }}
          >
            {t(`community.memberPassport.interestTitle`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`community.memberPassport.interestParagraph`)}
          </Paragraph>

          <Container
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: RFValue(20)
            }}
          >
            {interests?.map((interest) => {
              return (
                <InterestButton
                  key={interest.id}
                  interest={interest}
                  selected={Boolean(selectedInterests[interest.id])}
                  handleSelect={() => handleSelect(interest)}
                />
              );
            })}
          </Container>

          <Container
            style={{ marginTop: RFValue(10), marginBottom: RFValue(50) }}
          >
            <GradientButton onPress={() => closeModal()}>
              {t(`signup.identifyUserScreen.done`)}
            </GradientButton>
          </Container>
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(InterestModal);
