import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import BaseScreen from '@/screens/BaseScreen';
import { connect } from 'react-redux';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import { TAG as TAGHOME } from '@/screens/Home';
import { TAG as TAGSETUP } from '@/screens/Setup';
import { TAG as TAGSIGNIN } from '@/screens/SignIn';
import {
  fetchUser,
  updateName,
  updatePassword,
  logout,
  updateDataPracticeInfo
} from '@/actions/UserAction';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { Button, Header } from 'react-native-elements';
import styles, { color } from './styles';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Util from '@/utils/Util';
import images, { icons } from '@/assets';
import { disconnectBluetooth } from '@/actions/RaceAction';
import DashboardProfile from '@/components/DashboardProfile';
import LocalDatabase from '@/utils/LocalDatabase';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';

export const TAG = 'ProfileScreen';

class ProfileScreen extends BaseScreen {
  static navigationOptions = {
    title: 'Profile'
  };
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      swap: 'profile',
      error: '',
      isSavedDevice: undefined,
      isCheckingRegular: true,
      loading: false,
      texts: {
        profile: {
          button: 'Your Profile',
          bottomText: 'LOGOUT',
          bottonBtn: 'Save'
        },
        update: { button: 'Update Password', bottomText: '', bottonBtn: 'Save' }
      },
      eye: images.ic_eye,
      secureTextEntry: true,
      eye2: images.ic_eye,
      secureTextEntry2: true,
      npassw: '',
      cpassw: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user,
        isLoading: false
      };
    }
    return null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.getUser();
    this.props.updateDataPracticeInfo();
  }

  // componentDidUpdate(prevProps,prevState){
  //   console.log(TAG, ' componentDidUpdate - begin');
  //   const {user,isSavedDevice} = this.state;
  //   console.log(TAG, ' componentDidUpdate - begin01 - ',prevProps);
  //   console.log(TAG, ' componentDidUpdate - begin02 - ',prevState);
  //   if(prevProps.race?.isSavedDevice !== isSavedDevice){
  //     console.log(TAG, ' componentDidUpdate - isSavedDevice =  ',isSavedDevice);
  //     if(isSavedDevice === true){
  //       this.props.fetchUser();
  //     }else{
  //       this.replaceScreen(this.props.navigation,TAGSETUP);
  //     }
  //   }else if(JSON.stringify(prevProps?.user)!== JSON.stringify(user)){
  //     console.log(TAG, ' componentDidUpdate - prevProps?.user =  ',prevProps?.user);
  //     this.receiveSignIn({isLogged:!_.isEmpty(user?.userInfo) });
  //   }
  // }

  changeFuncti = onClickView(data => {
    //const {swap} = this.state;
    // this.setState({
    //   swap:type
    //});
    this.setState({
      swap: data == 'profile' ? 'update' : 'profile',
      error: '',
      secureTextEntry: true,
      secureTextEntry2: true
    });
  });

  onPressEye = onClickView(index => {
    let y = this.state.eye;
    let y2 = this.state.eye2;
    if (index == 1) {
      y = y == images.ic_eye ? images.ic_eye_flash : images.ic_eye;
      this.setState({
        eye: y,
        secureTextEntry: y == images.ic_eye ? true : false
      });
    } else {
      y2 = y2 == images.ic_eye ? images.ic_eye_flash : images.ic_eye;
      this.setState({
        eye2: y2,
        secureTextEntry2: y2 == images.ic_eye ? true : false
      });
    }
  });

  onPressForgot = onClickView(() => {
    this.setState({
      swap: 'update'
    });
  });

  excuteDisconnect = async () => {
    const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
    console.log(TAG, ' excuteDisconnect get data = ', periBluetooth);
    if (periBluetooth && periBluetooth.peripheral) {
      console.log(TAG, ' excuteDisconnect begin');
      console.log(TAG, ' excuteDisconnect begin01');
      await this.props.disconnectBluetooth();
      console.log(TAG, ' excuteDisconnect begin02');

      console.log(TAG, ' excuteDisconnect begin03');
    }
  };

  onPressLogout = this.onClickView(async () => {
    try {
      this.setState({
        loading: true
      });
      await Util.excuteWithTimeout(this.excuteDisconnect(), 10);
    } catch (error) {
    } finally {
      await this.props.logout();
      this.setState({
        loading: false
      });
      this.replaceScreen(this.props.navigation, TAGSIGNIN);
    }
  });

  onPressSave = this.onClickView(async () => {
    const { swap } = this.state;
    if (swap == 'profile') {
      const name = this.name._lastNativeText;
      console.log(' onPressSave ', name);
      if (name) {
        this.setState({
          isLoading: true
        });
        await this.props.updateName(name);
      }
    } else {
      this.setState({
        isLoading: true
      });
      const cpassword = this.password._lastNativeText;
      const npassword = this.npassword._lastNativeText;
      const {status = 0,message} = await this.props.updatePassword(cpassword, npassword);
      const messageNotify = status === 1 ? 'Your password has been successfully updated' : message;
      console.log(TAG,'updatePassword message '+ messageNotify);
      this.showToastMessage(messageNotify);
    }

    this.setState({
      npassw: '',
      cpassw: '',
      isLoading: false
    });
  });

  renderProfilePage = () => {
    const { error, user, swap, texts } = this.state;
    const { userInfo = {} } = user || {};
    return (
      <KeyboardAvoidingView
        style={[styles.containerStyle]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <View style={[styles.inputContainerStyle]}>
          <Text
            style={[
              TextStyle.extraText,
              styles.text,
              styles.textLogo,
              { marginBottom: verticalScale(15) }
            ]}
          >
            {texts[swap].button}
          </Text>
          <Text
            style={[
              TextStyle.mediumText,
              { color: 'white', alignSelf: 'center', flexDirection: 'row' }
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>Email:</Text>
            {' '}
            {` ${userInfo?.email || ''}`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 34
            }}
          >
            <DashboardProfile
              kcal={Math.round((userInfo?.Profile?.kcal || 0) * 100) / 100}
              mile={Math.round((userInfo?.Profile?.miles || 0) * 1000) / 1000}
            />
          </View>

          <View style={[styles.containerInput, { marginBottom: 10 }]}>
            <Text style={[TextStyle.normalText, styles.textLabel]}>Name</Text>
            <TextInput
              underlineColorAndroid="transparent"
              ref={name => {
                this.name = name;
              }}
              disableFullscreenUI
              style={[TextStyle.normalText, styles.text, { flex: 2 }]}
              placeholderTextColor={color.placeHolder}
              placeholder="Alice Smith"
              defaultValue={userInfo?.fullname}
              keyboardType="default"
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {!error ? null : (
                <Text
                  style={[
                    TextStyle.normalText,
                    styles.errorItem,
                    styles.marginBottom10,
                    { textAlign: 'left' }
                  ]}
                >
                  {error}
                </Text>
              )}
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              {swap == 'update' ? null : (
                <Text
                  onPress={this.onPressForgot}
                  style={[
                    TextStyle.normalText,
                    { textAlign: 'right', color: '#ffc500' }
                  ]}
                >
                  Update password?
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  renderUpdatePassword = () => {
    const { error, user, loading, swap, texts } = this.state;
    const { userInfo = {} } = user || {};
    return (
      <KeyboardAvoidingView
        style={[styles.containerStyle, { minHeight: screenSize.height / 2 }]}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 64 : -screenSize.height / 3 + scale(30)
        }
        contentContainerStyle={[
          { flex: 1, flexGrow: 1 },
          { minHeight: screenSize.height / 2 }
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <View style={[styles.inputContainerStyle]}>
          <Text
            style={[
              TextStyle.extraText,
              styles.text,
              styles.textLogo,
              {
                marginBottom: verticalScale(15)
              }
            ]}
          >
            {texts[swap].button}
          </Text>
          <View style={[styles.containerInput, { marginBottom: 10 }]}>
            <Text style={[TextStyle.normalText, styles.textLabel]}>
              Current password
            </Text>
            <TextInput
              placeholder="******"
              label="Current password"
              placeholderTextColor={color.placeHolder}
              ref={password => {
                this.password = password;
              }}
              disableFullscreenUI
              style={[TextStyle.normalText, styles.text, { flex: 2 }]}
              underlineColorAndroid="transparent"
              secureTextEntry={this.state.secureTextEntry}
              defaultValue={this.state.cpassw}
            />
            <TouchableOpacity
              onPress={() => this.onPressEye(1)}
              style={[
                styles.buttonStyle,
                {
                  position: 'absolute',
                  marginTop: 20,
                  marginRight: 2,
                  right: 3,
                  backgroundColor: 'transparent'
                }
              ]}
            >
              <Image
                source={this.state.eye}
                style={{ width: 24, height: 16 }}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.containerInput, { marginBottom: 10 }]}>
            <Text style={[TextStyle.normalText, styles.textLabel]}>
              New password
            </Text>
            <TextInput
              placeholder="******"
              label="New password"
              placeholderTextColor={color.placeHolder}
              ref={npassword => {
                this.npassword = npassword;
              }}
              disableFullscreenUI
              style={[TextStyle.normalText, styles.text, { flex: 2 }]}
              underlineColorAndroid="transparent"
              secureTextEntry={this.state.secureTextEntry2}
              defaultValue={this.state.npassw}
            />
            <TouchableOpacity
              onPress={() => this.onPressEye(2)}
              style={[
                styles.buttonStyle,
                {
                  position: 'absolute',
                  marginTop: 20,
                  marginRight: 1,
                  right: 1,
                  backgroundColor: 'transparent'
                }
              ]}
            >
              <Image
                source={this.state.eye2}
                style={{ width: 24, height: 16 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {!error ? null : (
                <Text
                  style={[
                    TextStyle.normalText,
                    styles.errorItem,
                    styles.marginBottom10,
                    { textAlign: 'left' }
                  ]}
                >
                  {error}
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  renderLeftHeader = () => {
    return (
      <TouchableOpacity onPress={this.onPressBack}>
        <Image
          source={images.ic_backtop}
          style={{ width: 32, height: 32, marginTop: 12 }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { swap, texts, isLoading,loading } = this.state;
    return (
      <ImageBackground style={styles.container} source={images.backgroundx}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <Header
            backgroundColor="transparent"
            containerStyle={{
              borderBottomWidth: 0,
              position: 'absolute',
              left: 20,
              top: 20
            }}
            leftComponent={this.renderLeftHeader()}
          />
          <View style={styles.mainView}>
            {swap == 'profile'
              ? this.renderProfilePage()
              : this.renderUpdatePassword()}

            <View
              style={[styles.socialBottomTextContainer, styles.endScreenText]}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Button
                  loading={isLoading}
                  title={texts[swap]['bottonBtn']}
                  titleStyle={[TextStyle.mediumText, styles.textButton]}
                  buttonStyle={[
                    styles.buttonStyle,
                    { marginLeft: 0, marginRight: 0 }
                  ]}
                  onPress={this.onPressSave}
                />
              </View>
              <Text
                style={[TextStyle.smallText, styles.link]}
                onPress={this.onPressLogout}
              >
                {swap != 'profile'
                  ? texts[swap].bottomText
                  : texts['profile'].bottomText}
              </Text>
            </View>

            {ViewUtil.CustomProgressBar({ visible: loading })}
          </View>
          {this.renderToastMessage()}
        </ScrollView>
        {this.initDialogInvite()}
        
      </ImageBackground>
    );
  }
}

ProfileScreen.propTypes = {};

ProfileScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  {
    getUser: fetchUser,
    updateName,
    updatePassword,
    disconnectBluetooth,
    logout,
    updateDataPracticeInfo
  }
)(ProfileScreen);
