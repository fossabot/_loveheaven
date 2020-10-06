import {Navigation} from 'react-native-navigation';
import Home from 'screens/home';
import Posts from 'screens/posts';
import Details from 'screens/details';
import WebView from 'screens/webview';

Navigation.registerComponent('net.loveheaven.home', () => Home);
Navigation.registerComponent('net.loveheaven.posts', () => Posts);
Navigation.registerComponent('net.loveheaven.details', () => Details);
Navigation.registerComponent('net.loveheaven.webview', () => WebView);

Navigation.setDefaultOptions({
  layout: {
    backgroundColor: '#000',
  },
  topBar: {
    background: {
      color: '#000',
    },
    backButton: {
      color: '#fff',
    },
    title: {
      color: '#fff',
    },
  },
});
