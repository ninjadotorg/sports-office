import React, { Component, PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { verticalScale } from 'react-native-size-matters';
import styles from './styles';
import TextStyle, { scale } from '@/utils/TextStyle';
import User from '@/models/User';
import { icons } from '@/assets';
import Map from '@/models/Map';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';

export const TAG = 'ItemMap';
class ItemMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      checked: undefined
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checked !== prevState.checked) {
      // console.log(
      //   TAG,
      //   ' getDerivedStateFromProps checked = ' + nextProps.checked
      // );
      return {
        checked: nextProps.checked
      };
    }
    return null;
  }

  render() {
    const { checked = false } = this.state;
    // console.log(TAG, ' render checked = ' + checked);
    const styleContainerItem = checked
      ? styles.containerItemsChecked
      : styles.containerItem;
    const { dataItem } = this.props;
    const uri = dataItem?.cover || dataItem?.photo || '';
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styleContainerItem}
          onPress={onClickView(() => {
            this.props.onItemSelected(dataItem.id);
          })}
        >
          <View style={styles.imageContainerIOS}>
            {ViewUtil.ImageView({
              style: styles.image,
              source: {
                uri: uri
              },
              resizeMode: FastImage.resizeMode.cover
            })}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
              backgroundColor: '#31314a',
              paddingHorizontal: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                TextStyle.mediumText,
                {
                  color: 'rgba(255,255,255,1)',
                  textAlignVertical: 'center',
                  fontWeight: 'bold'
                }
              ]}
            >
              {dataItem?.name || ''}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {icons.bike({
                containerStyle: { marginRight: verticalScale(10) },
                onPress: this.onPressBack
              })}
              <Text
                style={[
                  TextStyle.normalText,
                  {
                    color: '#ADAFB2',
                    textAlignVertical: 'center'
                  }
                ]}
              >
                {`${dataItem?.miles || '0'} miles`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

ItemMap.propTypes = {
  dataItem: PropTypes.instanceOf(Map).isRequired,
  checked: PropTypes.bool
};

ItemMap.defaultProps = {
  checked: false
};

export default connect(
  state => ({}),
  {}
)(ItemMap);
