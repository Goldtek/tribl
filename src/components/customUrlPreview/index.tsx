import React from 'react';
import { View } from 'react-native';
import truncate from 'lodash/truncate';

import {
  Container,
  DetailsContainer,
  TitleUrl,
  Title,
  Description,
  Thumbnail
} from './styles';

type Props = {
  title_link: string;
  title: string | undefined;
  image_url: any;
  thumb_url: any;
  text: string | undefined;
};

export const CustomUrlPreview = (props: Props) => {
  const getDomain = (url: string) => {
    let domain = url && url.replace('https://', '').replace('http://', '');

    if (!domain) return url;

    const indexOfSlash = domain.indexOf('/');

    if (indexOfSlash === -1) return domain;

    return domain.slice(0, indexOfSlash);
  };

  return (
    <Container>
      <DetailsContainer>
        <TitleUrl>{getDomain(props.title_link)}</TitleUrl>
        <Title>
          {truncate(props.title, {
            length: 50,
            omission: '...'
          })}
        </Title>
        <View>
          <Thumbnail
            source={{
              // @ts-ignore
              url: props.image_url || props.thumb_url
            }}
            resizeMode="cover"
          />
        </View>
        <Description>
          {truncate(props.text, {
            length: 100,
            omission: '...'
          })}
        </Description>
      </DetailsContainer>
    </Container>
  );
};
