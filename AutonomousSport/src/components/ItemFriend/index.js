import React, { PureComponent } from 'react';
import { View, Text , Image } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { verticalScale } from 'react-native-size-matters';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles';
import { Config } from '@/utils/Constants';
import TextStyle, { scale } from '@/utils/TextStyle';
import User from '@/models/User';
import { makeFriend,makeInvited } from '@/actions/FriendAction';
import { onClickView } from '@/utils/ViewUtil';
import Util from '@/utils/Util';
import images from '@/assets';

export const TAG = 'ItemFriend';

class ItemFriend extends PureComponent {
  constructor(props) {
    super(props);
    var dataItem = props.dataItem || {}
    //dataItem['is_add_invited'] = false;
    this.state = {
      isLoading: false,
      dataItem:dataItem,
    };
  }
  componentDidMount() {}

  onClickMakeFriend = onClickView(() => {
    const { dataItem } = this.props;

    console.log("invited onClickMakeFriend", dataItem);

    if (this.props.inviteMode == false){

    if (dataItem?.id && !dataItem['is_maked_friend']) {
      this.setState({
        isLoading: true
      }); 
      this.props.makeFriend({ friendId: dataItem?.id }); 
    }
  }else{
      this.props.selectIdfn(dataItem?.id); 
       
      this.props.makeInvited({ friendId: dataItem?.id, invited: dataItem?.is_add_invited }); 


      this.setState({
        dataItem: dataItem,
      }); 

      

  }

  });

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(TAG, ' getDerivedStateFromProps begin = ', nextProps.dataItem);
  //   if (
  //     JSON.stringify(nextProps.dataItem) !== JSON.stringify(prevState.dataItem)
  //   ) {
  //     return {
  //       dataItem: nextProps.dataItem || {},
  //       isLoading: false
  //     };
  //   }
  //   return null;
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(TAG, ' componentWillReceiveProps begin = ', nextProps.dataItem);
    if (
      JSON.stringify(nextProps.dataItem) !== JSON.stringify(this.state.dataItem)
    ) {
      this.setState({
        dataItem: nextProps.dataItem || {},
        isLoading: false
      });
    }
  }

  render() {
    const { dataItem, isLoading } = this.state;
    console.log("invited", dataItem);
    return (
      <View style={[styles.container,
      {paddingTop:14, paddingBottom:14, paddingRight:verticalScale(0),paddingLeft:0,
       marginLeft:0, borderBottomWidth:1, borderBottomColor:'#76717f'}]}>
         
        {/* <Image
          source={images.user}
          style={{ width: scale(30), height: scale(30) }}
        />  */}

        <Avatar
          medium
          rounded
          overlayContainerStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 0,
            borderColor: 'white',  
          }}
          source={images.user}
          onPress={() => console.log('Works!')}
          activeOpacity={0.2}
          containerStyle={{ alignSelf: 'center', marginLeft:-8 }}
        />  

        <View style={{ marginHorizontal: 10, flex: 1, marginLeft: verticalScale(20) }}>
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
                textAlignVertical: 'center',
                paddingTop:2
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
              textAlignVertical: 'center',
              marginRight:verticalScale(24)
            }
          ]}
        >
          {`${dataItem.route} ${dataItem.textRouteUnit}`}
        </Text>
        
        {this.props.inviteMode ? 
            <Button
            rounded
            fontSize={12 * scale()}
            containerViewStyle={{
              marginRight: 0,
              alignSelf: 'center'
            }}  
            buttonStyle={{ height: verticalScale(24),width: verticalScale(80)  , borderWidth:1, borderColor: dataItem?.is_add_invited ? '#76717f' :"transparent" }}
            title={ this.state.dataItem?.is_add_invited ?  'Invited' :  'Invite' }
            onPress={this.onClickMakeFriend}
            backgroundColor={dataItem?.is_add_invited ? 'transparent' :'#02BB4F'}  
            rightIcon={ dataItem?.is_add_invited ? { name: 'ios-checkmark', type: 'ionicon' } : null }

            />  
        :
            <Button
              rounded
              fontSize={12 * scale()}
              containerViewStyle={{
                marginRight: 0,
                alignSelf: 'center'
              }}
              buttonStyle={{ height: verticalScale(24),width: verticalScale(80)  , borderWidth:1, borderColor: dataItem?.is_maked_friend ? '#76717f' :"transparent" }}
              title={ dataItem?.is_maked_friend ?  'Friend' :  'Add Friend' }
              onPress={this.onClickMakeFriend}
              backgroundColor={dataItem?.is_maked_friend ? 'transparent' :'#02BB4F'}  
              rightIcon={ dataItem?.is_maked_friend ? { name: 'ios-checkmark', type: 'ionicon' } : null }
            />
        } 

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
  { makeFriend,makeInvited }
)(ItemFriend);
