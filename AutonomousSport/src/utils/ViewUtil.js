import React from 'react';
import { ActivityIndicator, View, Text, Modal, Image } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { debounce } from 'lodash';
import { verticalScale, scale } from 'react-native-size-matters';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import images from '@/assets';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const TAG = 'ViewUtil';
export const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
};
export const delayCallingManyTime = (funcOnView, second = 1) => {
  return debounce(funcOnView, second * 1000);
};
const ViewUtil = {
  CustomProgressBar: ({ visible }) => (
    <Modal onRequestClose={() => null} visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#dcdcdc',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View
          style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}
        >
          <Text style={[TextStyle.mediumText, { fontWeight: '200' }]}>
            Loading
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  ),
  SplashScreen: ({ visible }) => (
    <Modal onRequestClose={() => null} visible={visible}>
      <View
        style={{
          backgroundColor: 'black',
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <RadialGradient
          colors={['#ffffff', '#232339']}
          radius={screenSize.height}
          style={{
            opacity: 0.4,
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
        />
        <View
          style={{ backgroundColor: 'transparent', flexDirection: 'column' }}
        >
          <Image
            source={images.logo}
            style={{ alignSelf: 'center', width: 58, height: 58 }}
          />
          <Text
            style={[
              TextStyle.extraText,
              {
                color: 'white',
                letterSpacing: verticalScale(12),
                marginTop: verticalScale(30)
              }
            ]}
          >
            VELO
          </Text>
        </View>
      </View>
    </Modal>
  ),
  ImageView: (props: Image.props, childsView = null) => {
    const ImageView = createImageProgress(FastImage);
    return (
      <ImageView
        resizeMode={FastImage.resizeMode.cover}
        source={{ priority: FastImage.priority.normal }}
        {...props}
      >
        {childsView}
      </ImageView>
    );
  },
  loadingComponent: (color = 'white') => (
    <ActivityIndicator animating size="small" color={color} />
  ),

  lineWithText: ({
    text = '',
    styleText = {},
    styleContainer = {},
    colorLine = '#E0E0E0'
  }) => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center'
          },
          styleContainer
        ]}
      >
        <View style={{ height: 1, flex: 1, backgroundColor: colorLine }} />
        {text ? (
          <Text style={[TextStyle.smallText, { color: '#7A7A7A' }, styleText]}>
            {text}
          </Text>
        ) : null}
        <View style={{ height: 1, flex: 1, backgroundColor: colorLine }} />
      </View>
    );
  },
  line: ({ styleContainer = {} }) => {
    return (
      <View
        style={[
          {
            height: 1,
            flex: 1,
            backgroundColor: 'white',
            marginTop: 4,
            marginBottom: 4
          },
          styleContainer
        ]}
      />
    );
  },
  line2: ({ styleContainer = {} }) => {
    return (
      <View
        style={[
          { height: 1, flex: 1, backgroundColor: 'white' },
          styleContainer
        ]}
      />
    );
  }
};

export default ViewUtil;
