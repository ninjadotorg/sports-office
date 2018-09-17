import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { verticalScale } from 'react-native-size-matters';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles';
import { Config } from '@/utils/Constants';
import TextStyle, { scale } from '@/utils/TextStyle';
import User from '@/models/User';
import { makeFriend } from '@/actions/FriendAction';

export const TAG = 'ItemFriend';

class ItemFriend extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // data: props.data
    };
  }
  componentDidMount() {}

  render() {
    const { dataItem } = this.props;
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
            {dataItem?.fullname || dataItem?.email || ''}
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
            {`${dataItem.kcal} Kcal`}
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
          {`${dataItem.route} ${dataItem.textRouteUnit}`}
        </Text>
        <Button
          rounded
          fontSize={12 * scale()}
          containerViewStyle={{
            marginRight: 0,
            alignSelf: 'center'
          }}
          buttonStyle={{ height: verticalScale(20) }}
          title={dataItem?.is_maked_friend ? 'Friend' : 'Add'}
          onPress={() => {
            if (dataItem?.id) {
              this.props.makeFriend(dataItem?.id);
            }
          }}
          backgroundColor="#02BB4F"
          rightIcon={{ name: 'envira', type: 'font-awesome' }}
        />
      </View>
    );
  }
}

ItemFriend.propTypes = {
  dataItem: PropTypes.instanceOf(User).isRequired
};

ItemFriend.defaultProps = {};

export default connect(
  state => ({}),
  { makeFriend }
)(ItemFriend);
