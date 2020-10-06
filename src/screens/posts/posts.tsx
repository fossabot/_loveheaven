import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {getPosts} from 'lhscan-extensions';
import PostsList from 'component/postsList';
import AntIcon from 'react-native-vector-icons/AntDesign';

const Posts = (props: any) => {
  const refEvent = React.useRef<any>();
  const mouted = React.useRef<boolean | null>(null);
  const [state, setState] = React.useState<
    Array<{
      id: string;
      title?: string;
      time?: string;
    }>
  >([]);

  const onCallBack = React.useCallback(() => {
    getPosts('https://loveheaven.net/' + props.id).then((results) => {
      // @ts-ignore
      return setState(results.list);
    });
  }, [props.id]);

  React.useEffect(onCallBack, []);

  React.useLayoutEffect(() => {
    const listener = {
      componentDidAppear: async () => {
        mouted.current = true;
        Navigation.mergeOptions(props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'net.loveheaven.details',
                color: 'white',
                text: 'khalis',
                icon: await AntIcon.getImageSource('infocirlceo', 20),
              },
            ],
          },
        });
        refEvent.current = Navigation.events().registerNavigationButtonPressedListener(
          ({buttonId}) => {
            Navigation.push(props.componentId, {
              component: {
                name: buttonId,
                passProps: {
                  id: props.id,
                  title: props.title,
                },
                options: {
                  topBar: {
                    title: {
                      text: props.title,
                    },
                  },
                },
              },
            });
          },
        );
      },
      componentDidDisappear: () => {
        mouted.current = false;
        if (refEvent.current != null) {
          refEvent.current.remove();
        }
      },
    };
    // Register the listener to all events related to our component
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      props.componentId,
    );
    return () => {
      unsubscribe.remove();
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <PostsList componentId={props.componentId} state={state} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Posts;
