import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import HomePosts from 'lhscan-extensions';
import LinearGradient from 'react-native-linear-gradient';
import {Navigation} from 'react-native-navigation';

import FastImage from 'react-native-fast-image';

const Image = Animated.createAnimatedComponent(FastImage);

interface props {
  state: HomePosts[];
  componentId: string;
}

const List = (props: props) => {
  const {width} = useWindowDimensions();
  const SIZE_WIDTH = width * 0.3;

  const _renderITem = React.useCallback(
    (item, index) => {
      return (
        <Pressable
          onPress={() => {
            Navigation.push(props.componentId, {
              component: {
                name: 'net.loveheaven.posts',
                passProps: item,
                options: {
                  topBar: {
                    title: {
                      text: item.title,
                    },
                  },
                  bottomTabs: {
                    visible: false,
                  },
                },
              },
            });
          }}
          key={index}
          style={styles.contentContainer}>
          <Image
            source={{
              uri: item.image,
              headers: {referer: 'https://loveheaven.net'},
            }}
            style={[
              styles.image,
              {height: SIZE_WIDTH * 1.5, width: SIZE_WIDTH},
            ]}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,5)']}
            style={{
              position: 'absolute',
              height: SIZE_WIDTH * 1.5 + 10,
              width: SIZE_WIDTH + 10,
            }}
          />
          <View style={styles.itemContent}>
            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </Pressable>
      );
    },
    [SIZE_WIDTH, props.componentId],
  );

  return (
    <View style={styles.containerFlat}>
      {props.state ? props.state.slice(0, 48).map(_renderITem) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerFlat: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer: {
    padding: 5.3,
  },
  image: {
    borderRadius: 5,
  },
  itemContent: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    color: 'white',
  },
  time: {
    color: 'white',
    fontSize: 10.5,
  },
});

export default List;
