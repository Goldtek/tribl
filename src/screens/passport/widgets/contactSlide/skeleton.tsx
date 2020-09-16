import React, {
  useState,
  useRef,
  useCallback,
  Fragment,
  useEffect
} from 'react';
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';
import {
  Button,
  IconButton,
  Title,
  Paragraph,
  TextInput,
  TouchableRipple
} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { MyPassportInterface } from '../../../../graphql/types';
import { useQuery } from '@apollo/react-hooks';
import formatMessageTime from '../../../../utils/timesince';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';
import IdentityModal from '../identityModal';

import {
  ContactContainer,
  FirstNameContainer,
  LastNameContainer,
  DOBContainer,
  Container,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  CitizenshipContainer,
  EditTextInput,
  AddIdentity
} from './styles';

function ContactSlideSkeleton(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: userData, loading } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );
  const userDetails = userData?.myPassport;

  return (
    <ContactContainer>
      <Container>
        <FirstNameContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`signup.passportScreen.firstName`)}
          </Title>
        </FirstNameContainer>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={200}
              height={10}
              borderRadius={2}
              marginTop={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Container>

      <Container>
        <LastNameContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`signup.passportScreen.lastName`)}
          </Title>
        </LastNameContainer>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={200}
              height={10}
              borderRadius={2}
              marginTop={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Container>

      <DOBContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginBottom: 0
          }}
        >
          {t(`signup.passportScreen.dob`)}
        </Title>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={200}
              height={10}
              borderRadius={2}
              marginTop={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </DOBContainer>

      <LocationContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginBottom: 10
          }}
        >
          {t(`signup.passportScreen.locality`)}
        </Title>

        <Location>
          <AntDesign
            name="home"
            color="#CACEE5"
            size={20}
            style={{
              padding: RFValue(12),
              borderRadius: 4,
              margin: 0,
              marginRight: 10,
              backgroundColor: colors.ACTION
            }}
          />
          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginBottom: 10
            }}
          >
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={200}
                  height={10}
                  borderRadius={2}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Paragraph>
        </Location>

        <Location>
          <SimpleLineIcons
            name="location-pin"
            color="#CACEE5"
            size={20}
            style={{
              padding: RFValue(12),
              borderRadius: 4,
              margin: 0,
              marginRight: 10,
              backgroundColor: colors.ACTION
            }}
          />
          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginBottom: 10
            }}
          >
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={200}
                  height={10}
                  borderRadius={2}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Paragraph>
        </Location>
      </LocationContainer>

      <IdentityContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginBottom: 10
          }}
        >
          {t(`signup.passportScreen.identity`)}
        </Title>
        <Identities>
          <TouchableRipple>
            <AddIdentity>+</AddIdentity>
          </TouchableRipple>
        </Identities>
      </IdentityContainer>
    </ContactContainer>
  );
}

export default React.memo(ContactSlideSkeleton);
