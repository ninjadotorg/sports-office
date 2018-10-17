import React from 'react';
import { ActivityIndicator, View, Text, Modal, Image } from 'react-native';
import { debounce } from 'lodash';
import TextStyle, { scale } from '@/utils/TextStyle';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const TAG = 'ViewUtil';
export const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
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
          <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  ),
  ImageView: (props: Image.props) => {
    const ImageView = createImageProgress(FastImage);
    return (
      <ImageView
        resizeMode={FastImage.resizeMode.cover}
        source={{ priority: FastImage.priority.normal }}
        {...props}
      />
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
          { height: 1, flex: 1, backgroundColor: 'white' },
          styleContainer
        ]}
      />
    );
  }
};

export default ViewUtil;
