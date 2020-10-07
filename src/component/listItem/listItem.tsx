import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {getByListWithImageResult} from 'lhscan-extensions';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';
import numeral from 'numeral';
import {Navigation} from 'react-native-navigation';

interface props {
  state: getByListWithImageResult[];
  onEndReached?: () => void;
  componentId: string;
}

const ListItem = (props: props) => {
  const {width} = useWindowDimensions();
  const SIZE_WIDTH = width * 0.3;

  const onValue = React.useMemo(() => props.state, [props.state]);

  const _renderItem = ({item}: any) => {
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
        style={[styles.item, {width: SIZE_WIDTH, height: SIZE_WIDTH * 1.5}]}>
        <Image
          source={{
            uri: item.image,
            headers: {referer: 'https://loveheaven.net/'},
          }}
          style={[
            StyleSheet.absoluteFillObject,
            styles.image,
            {height: SIZE_WIDTH * 1.5, width: SIZE_WIDTH},
          ]}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'black']}
          style={[styles.linear, StyleSheet.absoluteFillObject]}
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.view}>
            <AntIcon name={'eye'} color={'white'} size={12} />
            {numeral(item.view).format('0.0 a')}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.container}
        data={onValue}
        initialNumToRender={10}
        renderItem={_renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        onEndReachedThreshold={0.1}
        onEndReached={props.onEndReached}
        getItemLayout={(data, index) => ({
          length: SIZE_WIDTH * 1.6,
          offset: SIZE_WIDTH * 1.6 * (props.state.length / 3),
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  item: {
    margin: 5,
  },
  image: {
    borderRadius: 5,
  },
  linear: {
    flexGrow: 1,
    borderRadius: 5,
  },
  content: {
    padding: 5,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 14,
    color: 'white',
  },
  view: {
    letterSpacing: 1.2,
    fontSize: 12,
    color: 'rgba(255,255,255,.7)',
  },
});

export default ListItem;
