import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';

import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGNEWROOM } from '@/screens/NewRoom';
import images, { icons } from '@/assets';
import RoomList from '@/components/RoomList';

export const TAG = 'CreateRoomScreen';
const component1 = () => <Text>Hello</Text>
const component2 = () => <Text>World</Text>
const component3 = () => <Text>ButtonGroup</Text>

const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }];
export const DATA_MAP_LIST = [
  {
    title: 'Map 1',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/UYiroysl.jpg'
  },
  {
    title: 'Map 2',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/UPrs1EWl.jpg'
  },
  {
    title: 'Map 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
    uri: 'https://i.imgur.com/MABUbpDl.jpg'
  },
  {
    title: 'Map 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/KZsmUi2l.jpg'
  },
  {
    title: 'Map 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/2nCt3Sbl.jpg'
  },
  {
    title: 'Map 6',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/lceHsT6l.jpg'
  }
];

export default class CreateRoomScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Create'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      mapList: [],
      selectedIndex:0
    };
  }

  componentDidMount() {}

  onPressCreateRoom = async () => {
    this.props.navigation.navigate(TAGNEWROOM);
    // try {
    //   const roomInfo = await ApiService.createRoom();
    //   console.log(TAG,' onPressCreateRoom roomInFo ' , roomInfo);
    //   if (roomInfo) {
        
    //   }
    // } catch (error) {}
  };
  
  onPressBack = ()=>{
    this.props.navigation.goBack();
  }
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
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
          Choose a race to start
        </Text>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={['Level 1','Level 2','Level 3','Level 4']} 
          textStyle={[TextStyle.normalText, styles.textStyleButton]}
          selectedTextStyle={[
            TextStyle.normalText,
            styles.selectedTextStyleButton
          ]}
          underlayColor="transparent"
          selectedButtonStyle={styles.selectedButtonStyle}
          containerStyle={styles.buttonGroup}
      />
        
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <RoomList />
        
        <View style={styles.containerBottom}>
          <Button
            title="Random"
            textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'#02BB4F'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
          <Button
            title="New Racing"
            buttonStyle={[styles.button,{backgroundColor:'#02BB4F'}]}
            textStyle={[TextStyle.mediumText,{fontWeight:'bold'}]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </View>
    );
  }
}

CreateRoomScreen.propTypes = {};

CreateRoomScreen.defaultProps = {};
