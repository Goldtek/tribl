import { useNavigationState } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessageListIcon from '../../../assets/icons/errorMessageListIcon';

import { ErrorText, RetryText, Container } from './styles';

type LoadingErrorWrapperProps = {
  text: string;
  onPress?: () => void;
};

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = (props) => {
  const { children, onPress, text } = props;
  return (
    <Container onPress={onPress}>
      {children}
      <ErrorText testID="loading-error">{text}</ErrorText>
    </Container>
  );
};

type LoadingErrorProps = {
  error?: boolean;
  loadNextPage?: () => Promise<void>;
  retry?: () => Promise<void> | void;
  listType?: 'channel' | 'message' | 'default';
};

const LoadingErrorIndicator: React.FC<LoadingErrorProps> = (props) => {
  const { t } = useTranslation();
  const { listType, retry = () => null } = props;

  const { routeNames, index } = useNavigationState((state) => state);
  const activeTab = routeNames[index];

  switch (listType) {
    case 'channel':
      return (
        <Container onPress={retry}>
          <ErrorMessageListIcon />
          <ErrorText testID="loading-error">
            {t(
              `community.chat.${
                activeTab === 'DirectMessageTab'
                  ? 'errorLoadingDMs'
                  : 'errorLoadingChannels'
              }`
            )}
          </ErrorText>
          <RetryText>⟳</RetryText>
        </Container>
      );
    case 'message':
      return (
        <LoadingErrorWrapper
          onPress={retry}
          text={t('Error loading messages for this channel ...')}
        />
      );
    default:
      return <LoadingErrorWrapper text={t('Error loading')} />;
  }
};

export default LoadingErrorIndicator;
