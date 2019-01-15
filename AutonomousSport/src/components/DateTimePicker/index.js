import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import Room from '@/models/Room';
import { Config, WEEK_DAY } from '@/utils/Constants';
import TextStyle from '@/utils/TextStyle';
import ViewUtil from '@/utils/ViewUtil';
import { icons, colors } from '@/assets';

export const TAG = 'DateTimePicker';

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  renderItem = ({ text = 'mon', styleIcon, styleText = {} }) => {
    return (
      <View style={styles.item}>
        {icons.dot({
          containerStyle: {},
          size: 35,
          iconStyle: styles.styleDot,
          ...styleIcon
        })}
        <Text style={[TextStyle.normalText, styles.styleText, styleText]}>
          {text.substr(0, 3).toLocaleUpperCase()}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {WEEK_DAY.map(value => {
          return this.renderItem({ text: value });
        })}
      </View>
    );
  }
}

DateTimePicker.propTypes = {};

DateTimePicker.defaultProps = {};
export default DateTimePicker;
