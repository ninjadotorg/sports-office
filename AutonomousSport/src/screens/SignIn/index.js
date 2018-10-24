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
  Surface,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import BaseScreen from '@/screens/BaseScreen';
import { connect } from 'react-redux';
import TextStyle,{screenSize} from '@/utils/TextStyle';
import { TAG as TAGHOME } from '@/screens/Home';
import { TAG as TAGSETUP } from '@/screens/Setup';
import { fetchUser,signIn,forGotPass, loginWithFirebase } from '@/actions/UserAction';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { Icon,Button } from 'react-native-elements';
import styles,{ color } from './styles';
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
      swap:"signin", 
      error:'',
      isSavedDevice:undefined,
      isCheckingRegular:true,
      loading:false,
      texts:{ 
        "signin":{"button":"Sign In","bottomText":"DON'T HAVE AN ACCOUNT ? ", "bottonBtn":"SIGN UP"},
        "signup":{"button":"Sign Up","bottomText":"ALREADY HAVE AN ACCOUNT ? ", "bottonBtn":"SIGN IN" },
        "forgot":{"button":"Forgot Password","bottomText":"ALREADY HAVE AN ACCOUNT ? ", "bottonBtn":"SIGN IN"}
       },
       eye: images.ic_eye,
       secureTextEntry: true,

    };
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

  componentDidMount() {
    // this.props.fetchUser();
    this.props.checkSaveDevice();
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


  componentWillReceiveProps(nextProps){
    console.log(TAG, ' componentWillReceiveProps - begin');
    const {user,isSavedDevice} = this.state;
    if(nextProps.race&&nextProps.race?.isSavedDevice !== isSavedDevice){
      console.log(TAG, ' componentWillReceiveProps - isSavedDevice =  ',isSavedDevice);
      if(nextProps.race?.isSavedDevice === true){
        this.setState({
          isSavedDevice: nextProps.race.isSavedDevice,
          isCheckingRegular:true
        });
        this.props.fetchUser();
      }else{
        this.replaceScreen(this.props.navigation,TAGSETUP);
      }
    }else if(JSON.stringify(nextProps?.user)!== JSON.stringify(user)){
      const userNext = nextProps?.user||{};
      console.log(TAG, ' componentWillReceiveProps - prevProps?.user =  ',userNext);
      const isLogged = !_.isEmpty(userNext.userInfo);
      const isLoggedFirebase = !_.isEmpty(userNext.firebaseInfo);
      this.setState({
        user: nextProps.user,
        loading:false
      });
      if(isLogged){
        if(isLoggedFirebase){
          this.receiveSignIn({isLogged:isLogged });
        }else{
          this.props.loginWithFirebase({email:userNext.userInfo.email,password:userNext.userInfo.fbtoken});
        }
      }else{
        this.setState({
          isCheckingRegular:false
        });
      }
      
    }
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
        this.replaceScreen(this.props.navigation,TAGHOME);
      }else{
        this.setState(
          {
            isCheckingRegular:false
          }
        );
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error?.toString()||''
      });
    }
  }
  changeFuncti = onClickView((data)=>{
    //const {swap} = this.state;
    // this.setState({
    //   swap:type
    //});
    this.setState({
       swap: data =="signin" ? "signup" : "signin",
       error:'',
       secureTextEntry:true,
    })
    
  });

  onPressEye = onClickView(()=>{
    let y = this.state.eye;
    y = (y == images.ic_eye ? images.ic_eye_flash : images.ic_eye );

    console.log(TAG,' onPressEye ',y);
    this.setState({
      eye:  y,
      secureTextEntry:  (y == images.ic_eye ? true : false ),
    });

  })
  
  onPressForgot = onClickView(()=>{
     
    this.setState({
      swap:"forgot"
    });

  } );

  onPressSignIn =  onClickView(async () => {
    console.log(TAG,' onPressSignIn ');
    const email = this.email?._lastNativeText||'';
    const password = this.password?._lastNativeText||'';
    const name = this.name?._lastNativeText|| '';

    console.log(TAG, ' - forGotPass - begin ', this.state.swap); 
    if(this.state.swap =="forgot"){
      if(Util.isEmailValid(email)){ 
          this.setState({ loading:true });
          
          //this.props.forGotPass({email});
          let response = await ApiService.forGotPass({ email });
          console.log(response);
          this.setState({ loading:false });

      }else{
        this.setState({ error:'Email is not correct!!' }); 
      }
    }else{

        if (email && password) {
          if(Util.isEmailValid(email)){
            this.setState({ loading:true });
            this.props.signIn({email,password,name});
          }else{
            this.setState({ error:'Email is not correct!!' }); 
          }
        } else {
          this.setState({ error:'Please input your email, password' });
        }
      }

  });
  renderSignInWithEmail = ()=>{
    const { error, loading,swap, texts } = this.state;
    
    return (
      
      <KeyboardAvoidingView
        style={[styles.containerStyle,{minHeight: (screenSize.height/2)}]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : (-screenSize.height/3 + scale(30))}
        contentContainerStyle={[{flex:1,flexGrow:1},{minHeight: (screenSize.height/2)}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      > 
        <View style={[styles.inputContainerStyle]}>
          {swap =="signup" ? ( 
            <View style={[styles.containerInput, {marginBottom:10 }]}>
              <Text style={[TextStyle.normalText,styles.textLabel]}>Name</Text>
              
              <TextInput
                underlineColorAndroid="transparent"
                ref={(name) => {
                  this.name = name;
                }}
                disableFullscreenUI={true}
                style={[TextStyle.normalText,styles.text,{flex:2}]}
                placeholderTextColor={color.placeHolder}
                placeholder="Alice Smith"
              />
          </View>
            
          ) : null}
          <View style={[styles.containerInput, {marginBottom:10 }]}>
            <Text style={[TextStyle.normalText,styles.textLabel]}>Email</Text>
            <TextInput
              ref={(email) => {
                this.email = email;
              }}
              disableFullscreenUI={true}
              style={[TextStyle.normalText,styles.text,{flex:2}]}
              underlineColorAndroid="transparent"
              placeholder="john@smith.com"
              placeholderTextColor={color.placeHolder}
              keyboardType="email-address"
            />
          </View>
          {swap !="forgot" ? ( 
          <View style={[styles.containerInput, {marginBottom:10 }]}>
            <Text style={[TextStyle.normalText,styles.textLabel]}>Password</Text>
            <TextInput
              placeholder="******"
              label="Password"
              placeholderTextColor={color.placeHolder}
              ref={(password) => {
                this.password = password;
              }}
              disableFullscreenUI={true}
              style={[TextStyle.normalText,styles.text,{flex:2}]}
              underlineColorAndroid="transparent"
              secureTextEntry = {this.state.secureTextEntry}
            />
          </View>
          ) : null } 

            <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, alignItems: 'center'}}>
                    {!error ? null : (
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
                  )}

                </View>
                <View style={{position:'absolute', right:0  }}> 
                     
                  {swap !="signup" ? null :

                    <TouchableOpacity  onPress={this.onPressEye} style={[styles.buttonStyle, {position:'absolute', right:2, 
                           marginTop:-70, backgroundColor:'transparent', width:48}]}>
                                    <Image source={this.state.eye}  /> 
                    </TouchableOpacity>

                     
                  }
                      {swap =="forgot" ? null : (
                      <Text
                      onPress={this.onPressForgot}
                        style={[TextStyle.normalText,  
                        {textAlign:'right', color:'#02BB4F'}]} 
                      >
                        Forgot password?
                      </Text> 
                    )}  
                </View>
            </View> 


        </View> 
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
    const { swap,texts,loading ,isCheckingRegular} = this.state;
    return (
      <ImageBackground style={styles.container} source={images.backgroundx}> 
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}> 
          {ViewUtil.SplashScreen({visible:isCheckingRegular})}
          <View style={styles.mainView}>
          <Text style={[TextStyle.extraText,styles.text,styles.textLogo, {marginTop: 110 }] }>{texts[swap].button}</Text>
            {this.renderSignInWithEmail()}  

            <View
                style={[
                  styles.socialBottomTextContainer,
                  styles.linkContainerMargin, 
                  styles.endScreenText
                ]}
              >
              <Button
                  loading={loading}
                  buttonStyle={[styles.buttonStyle, {marginBottom:80}]}
                  title={texts[swap]["button"]}
                  textStyle={[TextStyle.mediumText, styles.textButton,{fontWeight: 'bold'}]}
                  containerViewStyle={{width: '100%', marginLeft: 0, marginRight: 0}}
                  onPress={this.onPressSignIn}
                />
                </View>
            <View
                style={[
                  styles.socialBottomTextContainer,
                  styles.linkContainerMargin, 
                  styles.endScreenText
                ]}
              >
                <Text
                  style={[TextStyle.smallText, styles.textButton, {color:'#91919c'}]}
                >  {  swap !="forgot"  ? texts[swap].bottomText : texts["signin"].bottomText}
                </Text>

                <Text
                  style={[TextStyle.smallText, styles.textButton, styles.link]}
                  onPress={()=>this.changeFuncti(swap) }
                >  {  swap !="forgot"  ? texts[swap].bottonBtn : texts["signin"].bottonBtn}
                </Text>
            </View>
              
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
    user:state.user,
    race:state.race
  }),
  {signIn:signIn, forGotPass:forGotPass, loginWithFirebase,fetchUser,checkSaveDevice}
)(SignInScreen);
