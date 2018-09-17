import React from 'react';
import { View, Text ,TextInput,ScrollView} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { connect } from 'react-redux';
import styles,{color} from './styles';
import images, { icons } from '@/assets';
import { TAG as TAGCREATE } from '@/screens/Create';
import { TAG as TAGSIGNIN } from '@/screens/SignIn';
import { Button, Header } from 'react-native-elements';
import TextStyle from '@/utils/TextStyle';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';
import { fetchUser,updateName } from '@/actions/UserAction';
import Util from '@/utils/Util';
import DashboardProfile from '@/components/DashboardProfile';
import LocalDatabase from '@/utils/LocalDatabase';
import BleManager from 'react-native-ble-manager';

export const TAG = 'ProfileScreen';


class ProfileScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isLoading:false
    };

    this.iconBack = icons.back({
      containerStyle: { marginHorizontal: 0 },
      onPress: this.onPressBack
    });
  }

 

  componentDidMount() {
    this.props.getUser();
  }

  renderCenterHeader = () => {
    return (
      <Text
        style={[
          TextStyle.bigText,
          {
            fontWeight:'bold',
            color: 'white',
            textAlignVertical: 'center',
            marginHorizontal: 10
          }
        ]}
      >
        Your Profile
      </Text>
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user,
        isLoading:false
      };
    }
    return null;
  }

  
  onPressLogout = this.onClickView(async ()=>{
    await Util.excuteWithTimeout(async ()=>{
      const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
      console.log(TAG, ' disconnectBluetooth get data = ', periBluetooth);
      if (periBluetooth && periBluetooth.peripheral) {
        await BleManager.disconnect(periBluetooth.peripheral);
      }
    },2);
    await LocalDatabase.logout();
    this.replaceScreen(this.props.navigation,TAGSIGNIN);
  });

  onPressSave = this.onClickView(() => {
    const name = this.name._lastNativeText;
    if(name){
      this.setState({
        isLoading:true
      });
      this.props.updateName(name);
    }
  });
  render() {
    const { user,isLoading } = this.state;
    const {userInfo = {}} = user ||{};
    // console.log(TAG,' render fullname =',userInfo.fullname);
    return (
      <ScrollView contentContainerStyle={{flex:1,flexGrow: 1}} style={{flexGrow: 1,flex:1}}>
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            leftComponent={this.iconBack}
            centerComponent={this.renderCenterHeader()}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1
            }}
          >
            <Text
              style={[
                TextStyle.mediumText,
                {
                  color: 'white',
                  textAlignVertical: 'center',
                  alignSelf: 'center'
                }
              ]}
            >
              {`Email: ${userInfo?.email || ''}`}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <DashboardProfile kcal={Math.round((userInfo?.profile?.kcal||0)*100)/100} mile={Math.round((userInfo?.profile?.miles||0)*1000)/1000} />
            </View>
          </View>
          
          <View style={styles.containerInput}>
              <Text style={[TextStyle.normalText,styles.textLabel]}>Name</Text>
              <TextInput
                ref={(name) => {
                  this.name = name;
                }}
                style={[TextStyle.normalText,styles.text,{flex:2,color:'white'}]}
                underlineColorAndroid="transparent"
                placeholder="john@smith.com"
                defaultValue={userInfo?.fullname}
                placeholderTextColor={color.placeHolder}
                keyboardType="default"
              />
        </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Button
              loading={isLoading}
              title="Save"
              buttonStyle={styles.button}
              textStyle={[TextStyle.mediumText, styles.textButton,{fontWeight: 'bold'}]}
              onPress={this.onPressSave}
            />
            <Text
              onPress={this.onPressLogout}
              style={[TextStyle.normalText, { color: 'white' }]}
            >
              Log out
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

ProfileScreen.propTypes = {};

ProfileScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser ,updateName}
)(ProfileScreen);
