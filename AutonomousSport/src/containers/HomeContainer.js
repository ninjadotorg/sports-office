import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import TextStyle from '@/utils/TextStyle';
import { colors } from '@/assets';
import * as screens from '@/screens';

const PracticeScreen = screens.PracticeScreen;
const TopRaceScreen = screens.TopRaceScreen;
export const TAG = 'HomeContainer';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    fontWeight: 'bold'
  },
  textStyleButton: {
    fontWeight: 'bold',
    color: colors.text_main_black_disable
  },
  selectedTextStyleButton: {
    fontWeight: 'bold',
    color: colors.text_main_black
  },
  buttonGroup: {
    borderColor: 'transparent',
    shadowColor: 'transparent',
    backgroundColor: colors.main_white,
    borderWidth: 0
  },
  buttonItemStyle: {
    paddingVertical: 15,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  selectedButtonStyle: {
    borderBottomWidth: 2.5,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    borderBottomColor: colors.main_red
  }
});
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    console.log('updateIndex-levelIndex', selectedIndex);
  };

  render() {
    const { selectedIndex } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <SegmentedControlTab
          values={['User progress', 'Leaderboard']}
          selectedIndex={selectedIndex}
          onTabPress={this.updateIndex}
          tabsContainerStyle={[styles.buttonGroup, {}]}
          tabStyle={styles.buttonItemStyle}
          tabTextStyle={[TextStyle.mediumText, styles.textStyleButton]}
          activeTabStyle={styles.selectedButtonStyle}
          activeTabTextStyle={[
            TextStyle.mediumText,
            styles.selectedTextStyleButton
          ]}
          borderRadius={0}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'transparent'
          }}
        >
          {selectedIndex === 0 ? <PracticeScreen /> : <TopRaceScreen />}
        </View>
      </View>
    );
  }
}

HomeContainer.propTypes = {};

export default HomeContainer;
