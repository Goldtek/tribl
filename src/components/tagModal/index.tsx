import React, { useState, useEffect } from 'react';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import GradientButton from '../gradientButton';
import { TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { DEVICE_OS } from '../../utils/device';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import TagButton from './widget/tagButton';
import { tagScreenName } from '../../utils/uxcamHelper';
import { MyPassportInterface } from '../../graphql/types';
import { crashlytics } from '../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  BlurContentsContainer,
  ButtonContainer,
  BlurContents,
  ButtonWrapper
} from './styles';

function Tags(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    selectedTags: new Map(),
    selectedId: new Map()
  });

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  useEffect(() => {
    tagScreenName('AddTags');
    props.data;
  }, []);

  const identity = userDetails?.identity.map((item: any) => item.id);

  const interest = userDetails?.interest.map((item: any) => item.id);

  const allInterest = interest?.concat([
    ...Array.from(state.selectedId.values())
  ]);

  const [updatePassport, { loading }] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        interest: {
          add: allInterest
        }
      }
    }
  });

  const handleRequest = async () => {
    try {
      const { data } = await updatePassport();
      if (data) {
        props.displayTagModal(false);
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleSelect = (selected: string, id: string) => {
    if (!state.selectedTags.has(selected)) {
      return setState({
        ...state,
        selectedTags: new Map(state.selectedTags.set(selected, selected)),
        selectedId: new Map(state.selectedId.set(id, id))
      });
    }

    state.selectedTags.delete(selected);
    state.selectedId.delete(id);
    setState({
      ...state,
      selectedTags: new Map(state.selectedTags),
      selectedId: new Map(state.selectedId)
    });
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={DEVICE_OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <BlurContents>
          <BlurContentsContainer style={{ elevation: 6 }}>
            <TouchableWithoutFeedback
              onPress={props.onPress}
              style={{ marginLeft: 'auto' }}
            >
              <Feather
                name="x"
                size={22}
                color={colors.PRIMARY_TEXT}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableWithoutFeedback>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 8),
                lineHeight: RFValue(34),
                marginBottom: RFValue(10)
              }}
            >
              {t(`community.addTags.title`)}
            </Title>
            <Paragraph
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                lineHeight: RFValue(20),
                marginBottom: RFValue(15)
              }}
            >
              {t(`community.addTags.text`)}
            </Paragraph>

            <ButtonWrapper>
              {props.data?.map((tags: { name: string; id: string }) => (
                <TagButton
                  key={tags.id}
                  tag={tags.name}
                  selected={
                    state.selectedTags.get(tags.name) &&
                    state.selectedId.get(tags.id)
                  }
                  id={tags.id}
                  handleSelect={handleSelect}
                />
              ))}
            </ButtonWrapper>

            <ButtonContainer>
              <GradientButton
                loading={loading}
                onPress={handleRequest}
                labelStyle={{
                  color: colors.WHITE,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
                style={{ height: RFValue(40) }}
                contentStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: RFValue(40)
                }}
                gradientContainerstyle={{
                  maxHeight: RFValue(40),
                  height: RFValue(40),
                  width: '100%'
                }}
              >
                {t(`community.addTags.button`)}
              </GradientButton>
            </ButtonContainer>
          </BlurContentsContainer>
        </BlurContents>
      </KeyboardAvoidingView>
    </Container>
  );
}

export default React.memo(Tags);
