import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './styles';
import TextStyle, { scale } from '@/utils/TextStyle';
import User from '@/models/User';
import images, { icons } from '@/assets';
import Room from '@/models/Room';

export const TAG = 'ItemRoom';

class ItemRoom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
      // checked: undefined
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    // if (nextProps.checked !== prevState.checked) {
    //   console.log(
    //     TAG,
    //     ' getDerivedStateFromProps checked = ' + nextProps.checked
    //   );
    //   return {
    //     checked: nextProps.checked
    //   };
    // }
    return null;
  }

  render() {
    const styleContainerItem = styles.containerItem;
    const { dataItem, parallaxProps } = this.props;
    // console.log(TAG, ' render dataItem = ', dataItem);
    const uri = dataItem?.Map?.cover || dataItem?.photo;
    const source = uri ? { uri } : images.bike;

    return (
      <TouchableOpacity
        style={styleContainerItem}
        onPress={() => {
          this.props.onItemSelected(dataItem.id);
        }}
      >
        <ParallaxImage
          source={source}
          containerStyle={[styles.imageContainer, {}]}
          style={[styles.image, { resizeMode: uri ? 'cover' : 'center' }]}
          parallaxFactor={0.35}
          showSpinner
          spinnerColor="rgba(255, 255, 255, 0.4)"
          {...parallaxProps}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            flex: 1,
            justifyContent: 'space-around',
            backgroundColor: 'rgba(40, 40, 40, 0.5)',
            padding: 10
          }}
        >
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'rgba(255,255,255,1)',
                textAlignVertical: 'center',
                fontWeight: 'bold'
              }
            ]}
          >
            {dataItem?.name || 'No Name'}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              {icons.bike({
                containerStyle: { marginRight: 10 }
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
                {`${dataItem?.miles} miles`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'flex-end'
              }}
            >
              {icons.groupUser({
                containerStyle: { marginRight: 10 }
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
                {`${dataItem?.RoomPlayers?.length || '0'}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ItemRoom.propTypes = {
  dataItem: PropTypes.instanceOf(Room).isRequired,
  checked: PropTypes.bool,
  parallaxProps: PropTypes.object
};

ItemRoom.defaultProps = {
  checked: false
};

export default connect(
  state => ({}),
  {}
)(ItemRoom);
