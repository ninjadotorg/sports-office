import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { verticalScale } from 'react-native-size-matters';
import styles from './styles';
import { Config } from '@/utils/Constants';
import TextStyle, { scale } from '@/utils/TextStyle';

export const TAG = 'ItemFriend';

class ItemFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    console.log(TAG, ' render room = ', this.room?.toJSON());
    return (
      <View style={styles.container}>
        <Avatar
          small
          rounded
          overlayContainerStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderColor: 'white'
          }}
          icon={{ type: 'font-awesome', name: 'user', color: 'white' }}
          onPress={() => console.log('Works!')}
          activeOpacity={0.2}
          containerStyle={{ alignSelf: 'center' }}
        />
        <View style={{ marginHorizontal: 10, flex: 1 }}>
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                textAlignVertical: 'center'
              }
            ]}
          >
            Explore the world
          </Text>
          <Text
            style={[
              TextStyle.normalText,
              {
                color: 'rgba(255,255,255,0.5)',
                textAlignVertical: 'center'
              }
            ]}
          >
            12 kcal
          </Text>
        </View>
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center'
            }
          ]}
        >
          12 miles
        </Text>
        <Button
          rounded
          fontSize={12 * scale()}
          containerViewStyle={{
            marginRight: 0,
            alignSelf: 'center'
          }}
          buttonStyle={{ height: verticalScale(18) }}
          title="Friend"
          backgroundColor="#02BB4F"
          rightIcon={{ name: 'envira', type: 'font-awesome' }}
        />
      </View>
    );
  }
}

ItemFriend.propTypes = {};

ItemFriend.defaultProps = {};
export default ItemFriend;
