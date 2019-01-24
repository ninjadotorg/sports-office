import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'transparent'
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
    marginVertical: 10
  },
  row: {
    flexDirection: 'row',
    margin: 10
  },
  containerMain: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  containerRight: {
    flex: 0.85
  },
  textLabel: {
    color: 'white',
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  textLabel2: { color: '#ADAFB2' }
});

export default styles;