import React from 'react';
import { View } from 'react-native';

import { Container, DetailsContainer, TitleUrl, Title, Description, Thumbnail } from './styles';

export const CustomUrlPreview = (props: any )=> {
  const getDomain = (url: string )=> {
    let domain = url && url.replace('https://', '').replace('http://', '');

    if (!domain) {
      return url;
    }
    const indexOfSlash = domain.indexOf('/');
    if (indexOfSlash === -1) {
      return domain;
    }

    return domain.slice(0, indexOfSlash);
  };
  return (
    <Container>
      <DetailsContainer>
        <TitleUrl>{getDomain(props.title_link)}</TitleUrl>
        <Title>{props.title}</Title>
        <Description>{props.text}</Description>
      </DetailsContainer>
      <View>
        <Thumbnail
          source={{
            url: props.image_url || props.thumb_url,
          }}
          resizeMode="cover"
        />
      </View>
    </Container>
  );
};

