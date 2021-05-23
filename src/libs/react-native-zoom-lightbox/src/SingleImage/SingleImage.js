import React, { PureComponent, Fragment } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SwipeableViews from 'react-swipeable-views-native';
import PropTypes from 'prop-types';
import ImageCustom from '../ImageCustom';
import { USER_DEFAULT_AVATAR } from '../../../../constants';
import { chatClient } from '../../../../stream/types';

const ANIM_CONFIG = { duration: 200, useNativeDriver: false };
const { width, height } = Dimensions.get('window');

export default class SingleImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string,
    style: PropTypes.object,
    update: PropTypes.func,
    getAvatarDetails: PropTypes.func,
    loading: PropTypes.bool,
    userId: PropTypes.string
  };

  static defaultProps = { uri: USER_DEFAULT_AVATAR };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      origin: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      target: {
        x: 0,
        y: 0,
        opacity: 1
      },
      fullscreen: false,
      animating: false,
      panning: false,
      selectedImageHidden: false,
      slidesDown: false,
      avatar: {
        uri: '',
        secure_url: '',
        loading: false,
        formData: null,
        imageData: { uri: '', mime: undefined, cropRect: null }
      },
      loggedUserId: chatClient.user?.id
    };
    this.openAnim = new Animated.Value(0);
    this.pan = new Animated.Value(0);

    this.carouselItems = {};

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.state.animating,
      onStartShouldSetPanResponderCapture: () => !this.state.animating,
      onMoveShouldSetPanResponder: () => !this.state.animating,
      onMoveShouldSetPanResponderCapture: () => !this.state.animating,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.pan.setValue(gestureState.dy);

        if (Math.abs(gestureState.dy) > 15 && !this.state.panning) {
          this.pan.setValue(0);
          this.setState({ panning: true });
        }
      },
      onPanResponderRelease: this.handlePanEnd,
      onPanResponderTerminate: this.handlePanEnd
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState?.avatar?.uri !== this.state?.avatar?.uri) {
      this.props.getAvatarDetails(this.state.avatar, this.close);
    }
  }

  animateOpenAnimToValue = (toValue, onComplete) =>
    Animated.timing(this.openAnim, {
      ...ANIM_CONFIG,
      toValue
    }).start(() => {
      this.setState({ animating: false });
      if (onComplete) {
        onComplete();
      }
    });

  open = (index) => () => {
    const activeComponent = this.carouselItems[index].carouselItems[index];
    activeComponent.measure((rx, ry, width, height, x, y) => {
      this.setState(
        {
          fullscreen: true,
          animating: true,
          origin: { x, y, width, height },
          target: { x: 0, y: 0, opacity: 1 },
          index: index - 1
        },
        () => {
          this.animateOpenAnimToValue(1);
        }
      );
    });
  };

  close = () => {
    this.setState({ animating: true });
    this.carouselItems[this.state.index + 1].carouselItems[
      this.state.index + 1
    ].measure((rx, ry, width, height, x, y) => {
      this.setState({
        origin: { x, y, width, height },
        slidesDown: x + width < 0 || x > width
      });

      this.animateOpenAnimToValue(0, () => {
        this.setState({
          fullscreen: false,
          selectedImageHidden: false,
          slidesDown: false
        });
      });
    });
  };

  handlePanEnd = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) > 50) {
      this.setState({
        panning: false,
        target: {
          x: gestureState.dx,
          y: gestureState.dy,
          opacity: 1 - Math.abs(gestureState.dy / height)
        }
      });
      this.close();
    } else {
      Animated.timing(this.pan, {
        toValue: 0,
        ...ANIM_CONFIG
      }).start(() => this.setState({ panning: false }));
    }
  };

  getFullscreenOpacity = () => {
    const { panning, target } = this.state;

    return {
      opacity: panning
        ? this.pan.interpolate({
          inputRange: [-height, 0, height],
          outputRange: [0, 1, 0]
        })
        : this.openAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, target.opacity]
        })
    };
  };

  captureCarouselItem = (ref, idx) => {
    this.carouselItems[idx] = ref;
  };

  handleModalShow = () => {
    const { animating, selectedImageHidden } = this.state;

    if (!selectedImageHidden && animating) {
      this.setState({ selectedImageHidden: true });
    }
  };

  getSwipeableStyle = () => {
    const { fullscreen, origin, slidesDown, target } = this.state;

    if (!fullscreen) {
      return { flex: 1 };
    }

    const inputRange = [0, 1];

    return !slidesDown
      ? {
        left: this.openAnim.interpolate({
          inputRange,
          outputRange: [origin.x, target.x]
        }),
        top: this.openAnim.interpolate({
          inputRange,
          outputRange: [origin.y, target.y]
        }),
        width: this.openAnim.interpolate({
          inputRange,
          outputRange: [origin.width, width]
        }),
        height: this.openAnim.interpolate({
          inputRange,
          outputRange: [origin.height, height]
        })
      }
      : {
        left: 0,
        right: 0,
        height,
        top: this.openAnim.interpolate({
          inputRange,
          outputRange: [height, target.y]
        })
      };
  };

  handleAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (result.cancelled) return;
      const { type, width, height, base64 } = result;
      const uri = `data:${type}/jpg;base64,${base64}`;
      const imageData = {
        uri,
        mime: type,
        cropRect: { width, height }
      };
      this.setState({ avatar: { uri, imageData } });
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  renderDefaultHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 80,
        marginHorizontal: 20
      }}
    >
      <TouchableWithoutFeedback onPress={this.close}>
        <Text
          style={{
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Close
        </Text>
      </TouchableWithoutFeedback>

      {this.state?.loggedUserId === this.props?.userId ? (
        <TouchableOpacity
          onPress={
            this.state?.avatar?.uri ? this.props?.update : this.handleAvatar
          }
        >
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            <Fragment>
              {this.props?.loading == true ? (
                <ActivityIndicator
                  size="small"
                  color="blue"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 5
                  }}
                />
              ) : null}
              {this.state?.avatar?.uri ? 'Done' : 'Edit'}
            </Fragment>
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  renderFullscreenContent = (url) => () => {
    const { panning } = this.state;
    const containerStyle = [
      this.getSwipeableStyle(),
      panning && { top: this.pan }
    ];
    return (
      <Animated.View style={containerStyle} k>
        <ScrollView
          ref={(ref) => {
            if (ref) {
              ref.scrollResponderHandleStartShouldSetResponder = () => true;
            }
          }}
          contentContainerStyle={{ flex: 1 }}
          maximumZoomScale={2}
          alwaysBounceVertical={false}
        >
          <Image
            source={{ uri: url }}
            style={[{ flex: 1 }, { resizeMode: 'contain' }]}
            {...this.panResponder.panHandlers}
          />
        </ScrollView>
      </Animated.View>
    );
  };

  renderFullscreen = () => {
    const { animating, panning, fullscreen, avatar } = this.state;
    const opacity = this.getFullscreenOpacity();
    const { uri } = this.props;
    const image = avatar?.uri?.length ? avatar?.uri : uri;
    return (
      <Modal
        transparent
        visible={fullscreen}
        onShow={this.handleModalShow}
        onRequestClose={this.close}
      >
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'black'
            },
            opacity
          ]}
        />
        <SwipeableViews
          disabled={animating || panning}
          index={this.state.index}
          onChangeIndex={(index) => {
            this.setState({
              index
            });
          }}
        >
          {this.renderFullscreenContent(image)()}
        </SwipeableViews>
        <Animated.View
          style={[
            opacity,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }
          ]}
        >
          {this.renderDefaultHeader()}
        </Animated.View>
      </Modal>
    );
  };

  render() {
    const { fullscreen, selectedImageHidden, index, avatar } = this.state;
    const { uri, style } = this.props;
    const getOpacity = () => ({
      opacity: selectedImageHidden ? 0 : 1
    });

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.open(1)}>
          <View style={index + 1 === 1 ? getOpacity() : null}>
            <ImageCustom
              url={avatar?.uri?.length ? avatar?.uri : uri}
              style={[
                {
                  resizeMode: 'cover',
                  height: '100%',
                  width: '100%',
                  borderRadius: 8
                },
                style
              ]}
              ref={(ref) => this.captureCarouselItem(ref, index + 1)}
              index={index + 1}
            />
          </View>
        </TouchableWithoutFeedback>
        {fullscreen && this.renderFullscreen()}
      </View>
    );
  }
}
