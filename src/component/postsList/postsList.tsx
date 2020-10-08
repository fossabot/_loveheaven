import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';

interface props {
  state:
    | Array<{
        id: string;
        title?: string;
        time?: string;
      }>
    | any;
  componentId: string;
}

const PostsList = (props: props) => {
  const _renderItem = React.useCallback(
    (item, index) => {
      return (
        <Pressable
          onPress={() => {
            Navigation.push(props.componentId, {
              component: {
                name: 'net.loveheaven.webview',
                passProps: item,
                options: {
                  topBar: {
                    visible: false,
                  },
                  bottomTabs: {
                    visible: false,
                  },
                },
              },
            });
          }}
          style={styles.content}
          key={index}>
          <Text style={styles.title}>
            Chapter{' '}
            {item.title
              .match(/\d+\.?\d*/gi)
              .toString()
              .replace(',', '-')}
          </Text>
        </Pressable>
      );
    },
    [props.componentId],
  );

  return props.state ? (
    props.state.map(_renderItem)
  ) : (
    <ActivityIndicator color={'white'} size={30} />
  );
};

const styles = StyleSheet.create({
  content: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});

export default PostsList;
