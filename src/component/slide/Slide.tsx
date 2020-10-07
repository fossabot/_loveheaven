import React from 'react';
import {
  Animated,
  useWindowDimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import HomePosts from 'lhscan-extensions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import numeral from 'numeral';
import {Navigation} from 'react-native-navigation';
import FastImage from 'react-native-fast-image';

const Image = Animated.createAnimatedComponent(FastImage);

interface props {
  state: HomePosts[];
  componentId: string;
}

const TouchItem = Animated.createAnimatedComponent(Pressable);

const Slide = (props: props) => {
  const scrollX = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const refScroll = React.useRef<any>();
  const {width} = useWindowDimensions();
  const SIZE_WIDTH = width * 0.72;

  const _renderItem = React.useCallback(
    (item, index) => {
      const inputRange = [
        (index - 2) * SIZE_WIDTH + 6,
        index * SIZE_WIDTH + 6,
        (index + 2) * SIZE_WIDTH + 6,
      ];

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [25, 10, 25],
      });

      return (
        <TouchItem
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
          style={[styles.itemContainer, {transform: [{translateY}]}]}
          key={index}>
          <Image
            source={{
              uri: item.image,
              headers: {referer: 'https://loveheaven.net'},
            }}
            style={{
              width: SIZE_WIDTH,
              height: SIZE_WIDTH * 0.6,
              borderRadius: 10,
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'black']}
            style={{
              position: 'absolute',
              width: SIZE_WIDTH + 6,
              height: SIZE_WIDTH * 0.6,
            }}
          />
          <Animated.View
            style={[
              styles.subItemContainer,
              {width: SIZE_WIDTH, height: SIZE_WIDTH * 0.6},
            ]}>
            <Text
              numberOfLines={2}
              style={{color: 'white', fontWeight: 'bold'}}>
              {item.title}
            </Text>

            <Text numberOfLines={2} style={styles.lb}>
              <AntIcon name={'infocirlceo'} color={'white'} size={12} />
              {item.chapter_title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text numberOfLines={2} style={styles.lb}>
                <AntIcon name={'calendar'} color={'white'} size={12} />
                {item.time}
              </Text>
              <Text numberOfLines={2} style={[styles.lb]}>
                <AntIcon name={'eyeo'} color={'white'} size={12} />
                {numeral(item.view).format('0.0 a')}
              </Text>
            </View>
          </Animated.View>
        </TouchItem>
      );
    },
    [SIZE_WIDTH, props.componentId, scrollX],
  );

  return (
    <Animated.ScrollView
      fadingEdgeLength={100}
      ref={refScroll}
      contentContainerStyle={{
        paddingBottom: '10%',
        paddingHorizontal: '10%',
      }}
      onContentSizeChange={() => {
        refScroll.current.scrollTo({
          x: SIZE_WIDTH * 3 + 6,
          y: 0,
          animated: false,
        });
      }}
      horizontal
      snapToAlignment={'center'}
      snapToInterval={SIZE_WIDTH + 6}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
        useNativeDriver: true,
      })}>
      {props.state
        .sort((a: any, b: any) => {
          return b.view - a.view;
        })
        .slice(0, 7)
        .map(_renderItem)}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 3,
  },
  subItemContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  lb: {
    color: 'white',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 1,
  },
});

export default Slide;
