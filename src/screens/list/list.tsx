// import React from 'react';
// import {ActivityIndicator, Animated, Text, View} from 'react-native';
// import {
//   getByListWithImage,
//   ListLimit,
//   getByListWithImageResult,
//   getPostsByGenre,
// } from 'lhscan-extensions';
// import ListItem from 'component/listItem';
// import {Navigation} from 'react-native-navigation';
// import ActionSheet from 'react-native-actions-sheet';
// import AntIcon from 'react-native-vector-icons/AntDesign';
// import GenreList from 'component/genreList';
//
// const ListScreen = (props: any) => {
//   const isMounted = React.useRef<boolean | null>(null);
//   const [state, setState] = React.useState<getByListWithImageResult[]>([]);
//   const [count, setCount] = React.useState<number>(1);
//   const loading = React.useRef<Animated.Value>(new Animated.Value(1)).current;
//   const actionSheetRef = React.useRef<any>();
//   const refBtn = React.useRef<any>();
//   const [genre, setGenre] = React.useState<string | undefined>(undefined);
//
//   const onCallBack = React.useCallback(() => {
//     const listener = {
//       componentDidAppear: async () => {
//         isMounted.current = true;
//         getByListWithImage({}).then(setState);
//         Navigation.mergeOptions(props.componentId, {
//           topBar: {
//             rightButtons: [
//               {
//                 id: 'setting',
//                 color: 'white',
//                 icon: await AntIcon.getImageSource('infocirlce', 25),
//               },
//             ],
//           },
//         });
//
//         refBtn.current = Navigation.events().registerNavigationButtonPressedListener(
//           ({buttonId}) => {
//             if (buttonId === 'setting') {
//               actionSheetRef.current?.setModalVisible(true);
//             }
//           },
//         );
//       },
//       componentDidDisappear: () => {
//         isMounted.current = false;
//         if (refBtn.current != null) {
//           refBtn.current.remove();
//           actionSheetRef.current?.setModalVisible(false);
//         }
//       },
//     };
//     const subscriber = Navigation.events().registerComponentListener(
//       listener,
//       props.componentId,
//     );
//
//     return () => {
//       subscriber.remove();
//     };
//   }, [props.componentId]);
//
//   React.useEffect(onCallBack, []);
//
//   const _onEnd = React.useCallback(() => {
//     Animated.timing(loading, {
//       duration: 1000,
//       toValue: 0,
//       useNativeDriver: true,
//     }).start(() => {
//       if (count > ListLimit) {
//         Animated.timing(loading, {
//           useNativeDriver: true,
//           toValue: 1,
//           duration: 1000,
//         }).start();
//       } else {
//         getByListWithImage({page: count + 1})
//           .then((results) => {
//             setCount(count + 1);
//             setState((state) => state.concat(results));
//           })
//           .finally(() => {
//             Animated.timing(loading, {
//               useNativeDriver: true,
//               toValue: 1,
//               duration: 1000,
//             }).start();
//           });
//       }
//     });
//   }, [count, loading]);
//
//   const onSelectGenre = React.useCallback((item) => {
//     if (item) {
//       setGenre(item.title.toLowerCase());
//       getPostsByGenre({genre: item.title.toLowerCase()})
//         .then(setState)
//         .finally(() => {
//           actionSheetRef.current?.setModalVisible(false);
//         });
//     }
//   }, []);
//
//   return (
//     <View style={{flex: 1}}>
//       <ListItem
//         state={state}
//         componentId={props.componentId}
//         onEndReached={_onEnd}
//       />
//       <Animated.View
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           width: '100%',
//           alignItems: 'center',
//           transform: [
//             {
//               translateY: loading.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [0, 100],
//               }),
//             },
//           ],
//         }}>
//         <View
//           style={{
//             backgroundColor: 'white',
//             borderRadius: 24,
//             margin: 10,
//             padding: 10,
//           }}>
//           <ActivityIndicator color={'red'} size={20} />
//         </View>
//       </Animated.View>
//       <ActionSheet
//         gestureEnabled
//         containerStyle={{flex: 1}}
//         ref={actionSheetRef}>
//         <View style={{padding: 20}}>
//           <GenreList select={onSelectGenre} />
//         </View>
//       </ActionSheet>
//     </View>
//   );
// };
//
// export default ListScreen;

import React from 'react';
import {Text, View} from 'react-native';
import {postList} from 'lhscan-extensions';
import ListItem from 'component/listItem';

const ListScreen = (props: any) => {
  const [state, setState] = React.useState<postList>();
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    postList({}).then(setState);
  }, []);

  const onEnd = React.useCallback(() => {
    if (page > state?.page) {
      return;
    } else {
      postList({page: page + 1}).then((results) => {
        setState({
          page: results.page,
          // @ts-ignore
          list: state?.list.concat(results.list),
        });
        setPage(page + 1);
      });
    }
  }, [page, state]);

  return (
    <View style={{flex: 1}}>
      <ListItem
        onEndReached={onEnd}
        state={state?.list}
        componentId={props.componentId}
      />
    </View>
  );
};

export default ListScreen;
