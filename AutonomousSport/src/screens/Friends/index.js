import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Header, SearchBar, ButtonGroup } from 'react-native-elements';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import images, { icons } from '@/assets';
import { moderateScale, scale } from 'react-native-size-matters';
import ViewUtil from '@/utils/ViewUtil';
import ItemFriend from '@/components/ItemFriend';

export const TAG = 'FriendsScreen';

export default class FriendsScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Friends'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  componentDidMount() {}

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };
  renderLeftHeader = () => {
    return (
      <View style={styles.topBar}>
        {icons.back({
          containerStyle: { marginHorizontal: 0 },
          onPress: this.onPressBack
        })}
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              textAlignVertical: 'center',
              marginHorizontal: 10
            }
          ]}
        >
          Explore the world
        </Text>
        <SearchBar
          round
          icon={{ type: 'font-awesome', name: 'search' }}
          containerStyle={{
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            shadowColor: 'white',
            backgroundColor: 'transparent',
            flex: 1,
            borderWidth: 0
          }}
          placeholder="Find friend by email or name"
        />
      </View>
    );
  };

  renderItem = () => {
    return <ItemFriend />;
  };

  renderTabButton = () => {
    // const buttons = [{ element: component1 }, { element: component2 }];
    const buttons = ['Your Friends', 'All The World'];
    const { selectedIndex } = this.state;
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        textStyle={[TextStyle.normalText, styles.textStyleButton]}
        selectedTextStyle={[
          TextStyle.normalText,
          styles.selectedTextStyleButton
        ]}
        selectedButtonStyle={styles.selectedButtonStyle}
        containerStyle={styles.buttonGroup}
      />
    );
  };
  render() {
    return (
      <ImageBackground style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <View style={styles.containerTop}>
          {this.renderTabButton()}
        </View>
        
          <FlatList
            style={styles.list}
            data={['item', 'item', 'item', 'item', 'item', 'item','item', 'item', 'item', 'item', 'item', 'item']}
            renderItem={this.renderItem}
          />
        
      </ImageBackground>
    );
  }
}

FriendsScreen.propTypes = {};

FriendsScreen.defaultProps = {};
