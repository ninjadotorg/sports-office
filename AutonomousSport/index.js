/** @format */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import MainContainer from '@/containers/MainContainer';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => MainContainer);
