import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { debounce } from 'lodash';
import TextStyle, { scale } from '@/utils/TextStyle';

const TAG = 'ViewUtil';
export const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
};

const ViewUtil = {
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
