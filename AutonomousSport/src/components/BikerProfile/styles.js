import { StyleSheet } from 'react-native';
import { screenSize } from '@/utils/TextStyle';

const TAG = 'BikerProfileStyle';
// let widthMap = 0,
//   heightMap = 1,
//   ratios = 1,
//   widthVideo = 100;

// export const setMapInfo = ({ width, height }) => {
//   widthMap = width;
//   heightMap = height;
//   ratios = widthMap / heightMap;
//   widthVideo = screenSize.width - screenSize.height * ratios;
//   console.log(TAG, ' setMapInfo = ', widthMap, ',heightMap = ', heightMap);
//   console.log(
//     TAG,
//     ' setMapInfo ratios = ',
//     ratios,
//     ' = widthVideo - ',
//     widthVideo
//   );
// };
export default class StyleBikeProfile {
  constructor({ width, height }) {
    this.widthMap = width;
    this.heightMap = height;
    this.ratios = this.widthMap / this.heightMap;
    this.widthVideo = screenSize.width - screenSize.height * this.ratios;
    console.log(
      TAG,
      ' setMapInfo = ',
      this.widthMap,
      ',heightMap = ',
      this.heightMap
    );
    console.log(
      TAG,
      ' setMapInfo ratios = ',
      this.ratios,
      ' = widthVideo - ',
      this.widthVideo
    );
  }

  getStyles = () => {
    return StyleSheet.create({
      container: {
        width: this.widthVideo,
        flex: 1,
        flexDirection: 'column'
      },
      publisher: {
        height: this.widthVideo
      },
      parentViewInfo: {
        width: this.widthVideo,
        height: this.widthVideo
      },
      parentViewPublishView: {
        width: this.widthVideo,
        height: this.widthVideo,
        position: 'absolute',
        top: 0,
        left: 0,
        // zIndex: 500000,
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'column'
      },
      publisherInfo: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        alignItems: 'flex-end',
        paddingVertical: 10,
        backgroundColor: 'rgba(2,187,79,0.5)'
      },
      subcriber: { height: this.widthVideo }
    });
  };
}
// const widthVideo = screenSize.width / 4;
// const styles = StyleSheet.create({
//   container: {
//     width: widthVideo,
//     flex: 1,
//     flexDirection: 'column'
//   },
//   publisher: {
//     height: widthVideo
//   },
//   parentViewInfo: {
//     width: widthVideo,
//     height: widthVideo
//   },
//   parentViewPublishView: {
//     width: widthVideo,
//     height: widthVideo,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     zIndex: 500000,
//     backgroundColor: 'transparent',
//     flex: 1,
//     flexDirection: 'column'
//   },
//   publisherInfo: {
//     flex: 1,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     position: 'absolute',
//     bottom: 0,
//     alignItems: 'flex-end',
//     paddingVertical: 10,
//     backgroundColor: 'rgba(2,187,79,0.5)'
//   },
//   subcriber: { height: widthVideo }
// });
// export default styles;
