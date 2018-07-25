import React, { Component } from 'react';
import { View } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import styles from './styles';
import Room from '@/models/Room';

export const TAG = 'BikerProfile';

class BikerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get room(): Room {
    return this.props?.room;
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <OTSession
          apiKey=""
          sessionId={this.room?.session || ''}
          token={this.room?.token || ''}
        >
          <OTPublisher style={styles.publisher} />
          <OTSubscriber style={styles.subcriber} />
        </OTSession>
      </View>
    );
  }
}

BikerProfile.propTypes = {};

BikerProfile.defaultProps = {};
export default BikerProfile;
