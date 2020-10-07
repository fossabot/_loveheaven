import React from 'react';
import {ActivityIndicator, Animated, View} from 'react-native';
import {
  getByListWithImage,
  ListLimit,
  getByListWithImageResult,
} from 'lhscan-extensions';
import ListItem from 'component/listItem';

const ListScreen = (props: any) => {
  const [state, setState] = React.useState<getByListWithImageResult[]>([]);
  const [count, setCount] = React.useState<number>(1);
  const loading = React.useRef<Animated.Value>(new Animated.Value(1)).current;

  const onCallBack = React.useCallback(() => {
    getByListWithImage({}).then(setState);
  }, []);

  React.useEffect(onCallBack, []);

  const _onEnd = React.useCallback(() => {
    Animated.timing(loading, {
      duration: 1000,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (count > ListLimit) {
        Animated.timing(loading, {
          useNativeDriver: true,
          toValue: 1,
          duration: 1000,
        }).start();
      } else {
        getByListWithImage({page: count + 1})
          .then((results) => {
            setCount(count + 1);
            setState((state) => state.concat(results));
          })
          .finally(() => {
            Animated.timing(loading, {
              useNativeDriver: true,
              toValue: 1,
              duration: 1000,
            }).start();
          });
      }
    });
  }, [count, loading]);

  return (
    <View style={{flex: 1}}>
      <ListItem
        state={state}
        componentId={props.componentId}
        onEndReached={_onEnd}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          transform: [
            {
              translateY: loading.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              }),
            },
          ],
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            margin: 10,
            padding: 10,
          }}>
          <ActivityIndicator color={'red'} size={20} />
        </View>
      </Animated.View>
    </View>
  );
};

export default ListScreen;
