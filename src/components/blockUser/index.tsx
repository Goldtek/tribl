import React, { useState, useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Modal } from 'react-native';
import { Text, Title, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { BLOCK_REPORT_USER } from '../../graphql/server/mutations';
import { Mixpanel } from '../../config';
import { crashlytics } from '../../firebase/config';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { UserPassportInterface } from '../../graphql/types';

import { Container, Cover, ButtonContainer } from './styles';

interface BlockUserProps {
  blockModalVisible: boolean;
  closeModal(): void;
  data: any;
  refetch: VoidFunction;
  getBlockedDetails(details: boolean): void;
}

export default function BlockUserModal(props: BlockUserProps) {
  const { blockModalVisible, closeModal, data, refetch } = props;
  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const [block, setBlock] = useState(false);
  const firstName = data?.details?.firstName || data?.title.split(' ')[0];
  const passport = { ...data, ...data.details, firstName };

  const [getUserPassport] = useLazyQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT
  );

  useEffect(() => {
    props.getBlockedDetails(block);
  }, [block]);

  const note = `${passport?.firstName} ${t(
    `community.memberPassport.blockMessage`
  )} ${passport?.firstName}`;

  enum status {
    BLOCK
  }

  const [blockUser, { loading }] = useMutation(BLOCK_REPORT_USER, {
    variables: {
      payload: {
        passportId: passport?.id,
        status: status[0],
        notes: note
      }
    }
  });

  const handleBlock = async () => {
    try {
      Mixpanel.track('Block User', {
        info: `Block ${passport?.title}`,
        'Activity Screen': 'Member details screen'
      });
      await blockUser();
      setBlock(true);
      closeModal();
      refetch();
      if (data?.details?.id) {
        getUserPassport({ variables: { id: passport?.id } });
      }
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={blockModalVisible}
        onRequestClose={closeModal}
      >
        <Container>
          <Cover>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_MEDIUM,
                textTransform: 'capitalize',
                textAlign: 'center',
                paddingHorizontal: RFValue(10),
                marginBottom: RFValue(5)
              }}
            >{`${t(`community.memberPassport.block`)} ${
              passport?.title
            }`}</Title>
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR,
                textAlign: 'center',
                paddingHorizontal: RFValue(10)
              }}
            >{`${passport?.firstName} ${t(
              `community.memberPassport.blockMessage`
            )} ${passport?.firstName}`}</Text>
            <Divider
              style={{
                backgroundColor: colors.INPUT,
                width: '100%',
                height: 1,
                marginTop: RFValue(20)
              }}
            />
            <ButtonContainer>
              <Button
                onPress={closeModal}
                contentStyle={{
                  marginBottom: RFValue(10),
                  marginTop: RFValue(5)
                }}
              >
                {t(`community.memberPassport.cancel`)}
              </Button>
              <Divider
                style={{
                  backgroundColor: colors.INPUT,
                  height: '100%',
                  width: 1
                }}
              />
              <Button
                onPress={handleBlock}
                loading={loading}
                labelStyle={{ color: colors.RED }}
                contentStyle={{
                  marginBottom: RFValue(10),
                  marginTop: RFValue(5)
                }}
              >
                {t(`community.memberPassport.block`)}
              </Button>
            </ButtonContainer>
          </Cover>
        </Container>
      </Modal>
    </Container>
  );
}
