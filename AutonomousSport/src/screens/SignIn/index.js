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
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import BaseScreen from '@/screens/BaseScreen';
import { connect } from 'react-redux';
import TextStyle,{screenSize} from '@/utils/TextStyle';
import images, { icons } from '@/assets';
import { TAG as TAGHOME } from '@/screens/Home';
import { fetchUser,signIn } from '@/actions/UserAction';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { Icon,Button } from 'react-native-elements';
import styles,{ color } from './styles';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Util from '@/utils/Util';


export const TAG = 'SignInScreen';

class SignInScreen extends BaseScreen {
  static navigationOptions = {
    title: 'SignIn'
  };
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      swap:false,
      error:'',
      loading:false
    };
  }

  componentDidMount() {
    this.props.fetchUser();
  }
  componentDidUpdate(prevProps,prevState){
    const {user} = this.state;
    if(JSON.stringify(prevProps?.user)!== JSON.stringify(user)){
      // console.log(TAG, ' componentDidUpdate - user = ', user  + 'prevProps?.user =  ',prevProps?.user);
      console.log(TAG, ' componentDidUpdate - prevProps?.user =  ',prevProps?.user);
      this.receiveSignIn({isLogged:!_.isEmpty(user.userInfo) });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user,
        loading:false
      };
    }
    return null;
  }
  receiveSignIn = async ({isLogged=false,error=''}) =>{
    try {
      this.setState(
        {
          loading: false,
          error,
          isLogged
        }
      );
      if(isLogged){
        this.props.navigation.replace(TAGHOME);
        // Util.resetRoute(this.props.navigation,TAGHOME);
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error?.toString()||''
      });
    }
  }
  swap = onClickView(()=>{
    const {swap} = this.state;
    this.setState({
      swap:!swap
    });
  });
  onPressSignIn = onClickView(() => {
    console.log(TAG,' onPressSignIn ');
    const email = this.email?._lastNativeText||'';
    const password = this.password?._lastNativeText||'';
    const name = this.name?._lastNativeText|| '';
    if (email && password) {
      if(Util.isEmailValid(email)){
        this.setState({ loading:true });
        this.props.signIn({email,password,name});
      }else{
        this.setState({ error:'Email is not correct!!' }); 
      }
    } else {
      this.setState({ error:'Please input your email,password' });
    }
  });
  renderSignInWithEmail = ()=>{
    const { error, loading,swap } = this.state;
    const textForButton = swap ? 'Sign Up' : 'Sign In';
    return (
      
      <KeyboardAvoidingView
        style={[styles.containerStyle,{minHeight: (screenSize.width/3)}]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : (screenSize.width/-6 + scale(20))}
        contentContainerStyle={[{flex:1}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
      
        <Text style={[TextStyle.extraText,styles.text,styles.textLogo]}>{textForButton}</Text>
        <View style={styles.inputContainerStyle}>
          {swap ? (
            <View style={styles.containerInput}>
              <Text style={[TextStyle.normalText,styles.textLabel]}>Name</Text>
              
              <TextInput
                underlineColorAndroid="transparent"
                style={{flex:1}}
                ref={(name) => {
                  this.name = name;
                }}
                style={[TextStyle.normalText,styles.text,{flex:2}]}
                placeholderTextColor={color.placeHolder}
                placeholder="Alice Smith"
              />
          </View>
            
          ) : null}
          <View style={styles.containerInput}>
            <Text style={[TextStyle.normalText,styles.textLabel]}>Email</Text>
            <TextInput
              ref={(email) => {
                this.email = email;
              }}
              style={[TextStyle.normalText,styles.text,{flex:2}]}
              underlineColorAndroid="transparent"
              placeholder="john@smith.com"
              placeholderTextColor={color.placeHolder}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.containerInput}>
            <Text style={[TextStyle.normalText,styles.textLabel]}>Password</Text>
            <TextInput
              placeholder="******"
              label="Password"
              placeholderTextColor={color.placeHolder}
              ref={(password) => {
                this.password = password;
              }}
              style={[TextStyle.normalText,styles.text,{flex:2}]}
              underlineColorAndroid="transparent"
              secureTextEntry
            />
          </View>
        </View>

        {!error ? null : (
          <Text
            style={[
              TextStyle.normalText,
              styles.errorItem,
              styles.marginBottom10
            ]}
          >
            {error}
          </Text>
        )}

        <Button
          loading={loading}
          buttonStyle={styles.buttonStyle}
          title={textForButton}
          textStyle={[TextStyle.mediumText, styles.textButton,{fontWeight: 'bold'}]}
          onPress={this.onPressSignIn}
        />
        
      </KeyboardAvoidingView>
    );
  }
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
    const { swap } = this.state;
    return (
     
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}>
      
        <View style={styles.mainView}>
          {this.renderSignInWithEmail()}    

          <View
            style={[
              styles.socialBottomTextContainer,
              styles.linkContainerMargin
            ]}
          >
            <Text
              style={[
                TextStyle.smallText,
                styles.textButton,
                styles.socialBottomText
              ]}
            >
              {swap ? 'Already have an account ? ' : 'Don\'t have an account ? '} 

            </Text>
            <View style={styles.linkContainer}>
              <Text
                style={[TextStyle.smallText, styles.textButton, styles.link]}
                onPress={this.swap}
              >
                {swap ? 'Sign In' : 'Sign Up'}
              </Text>
            </View>
          </View>
          {swap ? null : (
            <View
              style={[
                styles.socialBottomTextContainer,
                styles.linkContainerMargin,
                styles.linkContainer,
                styles.endScreenText
              ]}
            >
              <Text
                onPress={this.onPressForgot}
                style={[TextStyle.smallText, styles.textButton, styles.link]}
              >
                Forgot password?
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

SignInScreen.propTypes = {};

SignInScreen.defaultProps = {};
export default connect(
  state => ({
    user:state.user
  }),
  {signIn:signIn,fetchUser}
)(SignInScreen);
