import {Navigation} from 'react-native-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import './registery';

Navigation.events().registerAppLaunchedListener(async () => {
  // Navigation.setRoot({
  //   root: {
  //     stack: {
  //       children: [
  //         {
  //           component: {
  //             name: 'net.loveheaven.home',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'net.loveheaven.home',
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Home',
                  icon: await AntIcon.getImageSource('home', 20),
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'net.loveheaven.list',
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'List',
                  icon: await AntIcon.getImageSource('windowso', 20),
                },
              },
            },
          },
        ],
      },
    },
  });
});
