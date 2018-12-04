import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { BackHandler, AppState } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';

import Router from '@/routers';

import { addListener } from '@/containers/MainContainer';

const TAG = 'AppNavigation';
class AppNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
    // console.log(`${TAG} contructor ${this.props}`);
  }

  async componentDidMount() {
    // console.log(`${TAG} componentDidMount begin 01`);
    AppState.addEventListener('change', this.handleAppStateChange);
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async nextAppState => {
    try {
      const { dispatch } = this.props || {};
      if (
        this.state.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log(`${TAG} App foreground!`);
      } else {
        console.log(`${TAG} App background!`);
      }
      this.setState({ appState: nextAppState });
    } catch (error) {
      console.log(error);
    }
  };
  backAction = () => {
    const { dispatch, navigation } = this.props;
    if (this.isDrawerOpen(navigation)) {
      this.closeDrawer(dispatch);
      return true;
    }

    if (this.shouldCloseApp(navigation)) {
      return false;
    }

    this.goBack(dispatch);
    return true;
  };

  goBack = dispatch => {
    if (dispatch) {
      dispatch(NavigationActions.back());
    }
  };

  shouldCloseApp = navigation => {
    if (navigation) {
      if (navigation.index > 0) return false;

      if (navigation.routes) {
        return navigation.routes.every(this.shouldCloseApp);
      }
    }

    return true;
  };

  render() {
    const { dispatch, navigation } = this.props;
    return (
      <Router.StackRouter
        ref={ref => {
          this.navigator = ref;
        }}
        navigation={addNavigationHelpers({
          dispatch,
          state: navigation,
          addListener
        })}
      />
    );
  }
}

AppNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape().isRequired
};
const mapStateToProps = state => ({ navigation: state.navigation });

export default connect(mapStateToProps)(AppNavigation);
