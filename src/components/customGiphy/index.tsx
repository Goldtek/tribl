import React from 'react';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import { Container, Text } from './styles';

function CustomGiphy(props: any) {
  const { t } = useTranslation();

  return (
    <Container>
      <FastImage
        resizeMode={FastImage.resizeMode.stretch}
        source={{
          uri: props.image_url || props.thumb_url,
          priority: FastImage.priority.high
        }}
        style={{
          height: 160,
          width: 250,
          borderRadius: 10
        }}
      />
      <Text>{t('community.chat.giphyPlaceholder')}</Text>
    </Container>
  );
}

export default React.memo(CustomGiphy);
