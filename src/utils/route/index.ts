import {Navigation} from 'react-native-navigation';
import './registery';

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'net.loveheaven.home',
            },
          },
        ],
      },
    },
  });
});
