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
import {
  fetchUser,
  signIn,
  forGotPass,
  loginWithFirebase
} from '@/actions/UserAction';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { Icon, Button } from 'react-native-elements';
import styles, { color } from './styles';
import { checkSaveDevice } from '@/actions/RaceAction';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Util from '@/utils/Util';
import ApiService from '@/services/ApiService';
import images, { icons } from '@/assets';

export const TAG = 'SignInScreen';

class SignInScreen extends BaseScreen {
  static navigationOptions = {
    title: 'SignIn'
  };
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      swap: 'signin',
      error: '',
      isSavedDevice: undefined,
      isCheckingRegular: true,
      loading: false,
      texts: {
        signin: {
          button: 'Sign In',
          bottomText: 'DON\'T HAVE AN ACCOUNT ? ',
          bottonBtn: 'SIGN UP'
        },
        signup: {
          button: 'Sign Up',
          bottomText: 'ALREADY HAVE AN ACCOUNT ? ',
          bottonBtn: 'SIGN IN'
        },
        forgot: {
          button: 'Forgot Password',
          bottomText: 'ALREADY HAVE AN ACCOUNT ? ',
          bottonBtn: 'SIGN IN'
        }
      },
      eye: images.ic_eye,
      secureTextEntry: true
    };

    // this.pubnub.addListener({
    //   message: function(message) {
    //     console.log(TAG, ' addListenerPUB ', message);
    //   }
    // });

    // this.pubnub.subscribe({
    //   channels: ['velo_bike']
    // });
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(TAG, ' getDerivedStateFromProps - begin ');
  //   if(nextProps.race && nextProps.race.isSavedDevice !== prevState?.isSavedDevice){
  //     console.log(TAG, ' getDerivedStateFromProps - isSavedDevice = ', nextProps.race?.isSavedDevice);
  //     return {
  //       isSavedDevice: nextProps.race?.isSavedDevice
  //     };
  //   }else if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
  //     console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
  //     return {
  //       user: nextProps.user,
  //       loading:false
  //     };
  //   }
  //   return null;
  // }

  // testPushDataOnPubnub = async () => {
  //   const delay = time => new Promise(res => setTimeout(() => res(), time));
  //   await delay(5000);
  //   let publishConfig = {
  //     channel: 'velo_bike',
  //     message: {
  //       title: 'HIENTON ---- greeting',
  //       description: 'hello world!'
  //     }
  //   };
  //   this.pubnub.publish(publishConfig, (status, response) => {
  //     console.log(TAG, ' pubnub.publish - begin -status = ', status);
  //   });
  // };

  componentDidMount() {
    // this.props.fetchUser();
    this.props.checkSaveDevice();
    // this.testPushDataOnPubnub().then(() => {
    //   console.log(TAG, ' componentDidUpdate - test --------');
    // });
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

  // quickstart = async (
  //   projectId = 'smart-trash-188411',
  //   topicName = 'users'
  // ) => {
  //   console.log(`Topic ${topicName} begin.`);
  //   // Instantiates a client
  //   const pubsub = new PubSub({ projectId });

  //   // Creates the new topic
  //   const [topic] = await pubsub.createTopic(topicName);
  //   console.log(`Topic ${topic.name} created.`);
  // };
  componentWillReceiveProps(nextProps) {
    console.log(TAG, ' componentWillReceiveProps - begin');
    const { user, isSavedDevice } = this.state;
    if (nextProps.race && nextProps.race?.isSavedDevice !== isSavedDevice) {
      console.log(
        TAG,
        ' componentWillReceiveProps - isSavedDevice =  ',
        isSavedDevice
      );
      if (nextProps.race?.isSavedDevice === true) {
        this.setState({
          isSavedDevice: nextProps.race.isSavedDevice,
          isCheckingRegular: true
        });
        this.props.fetchUser();
      } else {
        this.replaceScreen(this.props.navigation, TAGSETUP);
      }
    } else if (JSON.stringify(nextProps?.user) !== JSON.stringify(user)) {
      const userNext = nextProps?.user || {};
      console.log(
        TAG,
        ' componentWillReceiveProps - prevProps?.user =  ',
        userNext
      );
      const isLogged = !_.isEmpty(userNext.userInfo);
      const isPressButton = this.state.loading;
      // hienton TODO
      const isLoggedFirebase = true || _.isEmpty(userNext.firebaseInfo);
      this.setState({
        user: _.isEmpty(userNext.userInfo) ? undefined : nextProps.user,
        loading: false
      });
      if (isLogged) {
        if (isLoggedFirebase) {
          this.receiveSignIn({ isLogged: isLogged });
        } else {
          // this.props.loginWithFirebase({
          //   email: userNext.userInfo.email,
          //   password: userNext.userInfo.fbtoken
          // });
        }
      } else {
        this.setState({
          isCheckingRegular: false
        });
        if (isPressButton) {
          this.showToastMessage('Please check again your information to login');
        }
      }
    }
  }

  receiveSignIn = async ({ isLogged = false, error = '' }) => {
    try {
      this.setState({
        loading: false,
        error,
        isLogged
      });
      if (isLogged) {
        this.replaceScreen(this.props.navigation, TAGHOME);
      } else {
        this.setState({
          isCheckingRegular: false
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error?.toString() || ''
      });
    }
  };
  changeFuncti = onClickView(data => {
    //const {swap} = this.state;
    // this.setState({
    //   swap:type
    //});
    this.setState({
      swap: data == 'signin' ? 'signup' : 'signin',
      error: '',
      secureTextEntry: true
    });
  });

  onPressEye = onClickView(() => {
    let y = this.state.eye;
    y = y == images.ic_eye ? images.ic_eye_flash : images.ic_eye;

    console.log(TAG, ' onPressEye ', y);
    this.setState({
      eye: y,
      secureTextEntry: y == images.ic_eye ? true : false
    });
  });

  onPressForgot = onClickView(() => {
    this.setState({
      swap: 'forgot'
    });
  });

  onPressSignIn = onClickView(async () => {
    console.log(TAG, ' onPressSignIn ');
    const email = this.email?._lastNativeText || '';
    const password = this.password?._lastNativeText || '';
    const name = this.name?._lastNativeText || '';

    console.log(TAG, ' - forGotPass - begin ', this.state.swap);
    if (this.state.swap == 'forgot') {
      if (Util.isEmailValid(email)) {
        this.setState({ loading: true });

        //this.props.forGotPass({email});
        let response = await ApiService.forGotPass({ email });
        console.log(response);
        this.setState({ loading: false });
      } else {
        this.showToastMessage('Email is not correct!!');
        this.setState({ error: 'Email is not correct!!' });
      }
    } else {
      if (email && password) {
        if (Util.isEmailValid(email)) {
          this.setState({ loading: true });
          this.props.signIn({ email, password, name });
        } else {
          this.setState({ error: 'Email is not correct!!' });
          this.showToastMessage('Email is not correct!!');
        }
      } else {
        this.setState({ error: 'Please input your email, password' });
        this.showToastMessage('Please input your email, password');
      }
    }
  });
  renderSignInWithEmail = () => {
    const { error, loading, swap, texts } = this.state;

    return (
      <KeyboardAvoidingView
        // style={[styles.containerStyle,{minHeight: (screenSize.height/2)}]}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : (-screenSize.height/3 + scale(30))}
        // contentContainerStyle={[{flex:1,flexGrow:1},{minHeight: (screenSize.height/2)}]}
        style={[styles.containerStyle]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <View style={[styles.inputContainerStyle]}>
          {swap == 'signup' ? (
            <View
              style={[
                styles.containerInput,
                { marginBottom: verticalScale(7) }
              ]}
            >
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
              />
            </View>
          ) : null}
          <View
            style={[styles.containerInput, { marginBottom: verticalScale(7) }]}
          >
            <Text style={[TextStyle.normalText, styles.textLabel]}>Email</Text>
            <TextInput
              ref={email => {
                this.email = email;
              }}
              disableFullscreenUI
              style={[TextStyle.normalText, styles.text, { flex: 2 }]}
              underlineColorAndroid="transparent"
              placeholder="john@smith.com"
              placeholderTextColor={color.placeHolder}
              keyboardType="email-address"
            />
          </View>
          {swap !== 'forgot' ? (
            <View
              style={[
                styles.containerInput,
                {
                  marginBottom: verticalScale(7),
                  alignItems: 'center'
                }
              ]}
            >
              <Text style={[TextStyle.normalText, styles.textLabel]}>
                Password
              </Text>
              <TextInput
                placeholder="******"
                label="Password"
                placeholderTextColor={color.placeHolder}
                ref={password => {
                  this.password = password;
                }}
                disableFullscreenUI
                style={[TextStyle.normalText, styles.text, { flex: 2 }]}
                underlineColorAndroid="transparent"
                secureTextEntry={this.state.secureTextEntry}
              />
              <TouchableOpacity onPress={this.onPressEye}>
                <Image
                  source={this.state.eye}
                  style={{ width: 24, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {/*!error ? null : (
                    <Text
                      style={[
                        TextStyle.normalText,
                        styles.errorItem,
                        styles.marginBottom10,
                        {textAlign:'left'  }
                      ]}
                    >
                      {error}
                    </Text>
                    )*/}
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              {swap == 'forgot' ? null : (
                <Text
                  onPress={this.onPressForgot}
                  style={[
                    TextStyle.normalText,
                    { textAlign: 'right', color: '#ffc500' }
                  ]}
                >
                  Forgot password?
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // render
  renderLoginSocial() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.socialButtonFB]}
          onPress={this.onPressFacebookLogin}
        >
          {this.state.loadingFacebook ? (
            this.loadingComponent
          ) : (
            <View style={styles.socialButton}>
              <Icon
                name="facebook-square"
                type="font-awesome"
                size={25}
                containerStyle={styles.socialButtonIcon}
                color={color.textSocial.facebook}
              />
              <Text style={[TextStyle.normalText, styles.socialButtonTextFB]}>
                Facebook
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.socialButtonGG]}
          onPress={this.onPressGoogleLogin}
        >
          {this.state.loadingGoogle ? (
            this.loadingComponent
          ) : (
            <View style={styles.socialButton}>
              <Icon
                name="google-plus-square"
                type="font-awesome"
                size={25}
                containerStyle={styles.socialButtonIcon}
                color={color.textSocial.google}
              />
              <Text style={[TextStyle.normalText, styles.socialButtonTextGG]}>
                Google
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const { swap, texts, loading, isCheckingRegular } = this.state;
    return (
      <ImageBackground style={styles.container} source={images.backgroundx}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          {ViewUtil.SplashScreen({ visible: isCheckingRegular })}
          <View style={styles.mainView}>
            <Text
              style={[
                TextStyle.extraText,
                styles.text,
                styles.textLogo,
                { marginTop: verticalScale(50) }
              ]}
            >
              {texts[swap].button}
            </Text>
            {this.renderSignInWithEmail()}

            <View style={[styles.bottomContainer]}>
              <Button
                type="solid"
                loading={loading}
                buttonStyle={[styles.buttonStyle, {}]}
                title={texts[swap]['button']}
                titleStyle={[
                  TextStyle.mediumText,
                  styles.textButton,
                  { fontWeight: 'bold', flex: 1, color: '#534c5f' }
                ]}
                onPress={this.onPressSignIn}
              />

              <View
                style={[
                  styles.socialBottomTextContainer,
                  styles.endScreenText,
                  {}
                ]}
              >
                <Text
                  style={[
                    TextStyle.smallText,
                    styles.textButton,
                    { color: '#91919c' }
                  ]}
                >
                  {swap != 'forgot'
                    ? texts[swap].bottomText
                    : texts['signin'].bottomText}
                </Text>

                <Text
                  style={[TextStyle.smallText, styles.textButton, styles.link]}
                  onPress={() => this.changeFuncti(swap)}
                >
                  {' '}
                  {swap != 'forgot'
                    ? texts[swap].bottonBtn
                    : texts['signin'].bottonBtn}
                </Text>
              </View>
            </View>
            {this.renderToastMessage()}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

SignInScreen.propTypes = {};

SignInScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user,
    race: state.race
  }),
  {
    signIn: signIn,
    forGotPass: forGotPass,
    loginWithFirebase,
    fetchUser,
    checkSaveDevice
  }
)(SignInScreen);
