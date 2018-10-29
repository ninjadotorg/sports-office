import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import Room from '@/models/Room';
import { Config } from '@/utils/Constants';
import TextStyle from '@/utils/TextStyle';
import ViewUtil from '@/utils/ViewUtil';

export const TAG = 'DashboardProfile';

class DashboardProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get room(): Room {
    return this.props?.room;
  }

  componentDidMount() {}

  render() {
    const { kcal, mile } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Text
            style={[
              TextStyle.mediumText,
              { color: 'white', textAlign: 'left', fontWeight: 'bold' }
            ]}
          >
            {kcal}
          </Text>
          <Text
            style={[
              TextStyle.normalText,
              { color: 'white', textAlign: 'left' }
            ]}
          >
            Kcal
          </Text>
        </View>
        <View>
          {ViewUtil.line({
            styleContainer: { flexDirection: 'row', width: 1 }
          })}
        </View>
        <View style={styles.item}>
          <Text
            style={[
              TextStyle.mediumText,
              { color: 'white', textAlign: 'left', fontWeight: 'bold' }
            ]}
          >
            {mile}
          </Text>
          <Text
            style={[
              TextStyle.normalText,
              { color: 'white', textAlign: 'left' }
            ]}
          >
            Miles
          </Text>
        </View>
      </View>
    );
  }
}

DashboardProfile.propTypes = {};

DashboardProfile.defaultProps = {};
export default DashboardProfile;
