import React from 'react';
import {
  LayoutChangeEvent,
  View,
  Animated,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {getPostView} from 'lhscan-extensions';
import {WebView as Web, WebViewMessageEvent} from 'react-native-webview';
import htmlContent from 'utils/htmlContent';
import {Navigation} from 'react-native-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {WebViewProgressEvent} from 'react-native-webview/lib/WebViewTypes';

const WebView = (props: any) => {
  const isMounted = React.useRef<boolean | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [state, setState] = React.useState<getPostView>({});
  const [layout, setLayout] = React.useState<number>(0);
  const scrollY = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const [topBar, setTobBar] = React.useState<number>(56);
  const [title, setTile] = React.useState<string>(
    'Chapter ' + props.id.replace(/\D+/gi, ''),
  );

  const onCallBack = React.useCallback(() => {
    getPostView('https://loveheaven.net/' + props.id).then(setState);
  }, [props.id]);

  React.useEffect(onCallBack, []);
  React.useEffect(() => {
    Navigation.constants().then((res) => {
      setTobBar(res.topBarHeight);
    });
    const listener = {
      componentDidAppear: () => {
        isMounted.current = true;
      },
      componentDidDisappear: () => {
        isMounted.current = false;
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      props.componentId,
    );
    return () => {
      unsubscribe.remove();
    };
  }, [props.componentId]);

  const _onScroll = ({nativeEvent}: any) => {
    const layout_size = Math.round(layout);
    const SIZE = Math.round(nativeEvent.contentOffset.y + layout_size);
    if (topBar > Math.round(nativeEvent.contentOffset.y)) {
      Animated.timing(scrollY, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
      }).start();
    } else if (SIZE > Math.round(nativeEvent.contentSize.height - topBar)) {
      Animated.timing(scrollY, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
      }).start();
    } else {
      Animated.timing(scrollY, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
      }).start();
    }
  };
  const _onLayout = React.useCallback((layout: LayoutChangeEvent) => {
    setLayout(layout.nativeEvent.layout.height);
  }, []);
  const _onMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
      if (event.nativeEvent.data === 'up') {
        Animated.timing(scrollY, {
          toValue: 0,
          useNativeDriver: true,
          duration: 500,
        }).start();
      }
    },
    [scrollY],
  );

  const _onPress = React.useCallback((item) => {
    setLoading(true);
    getPostView('https://loveheaven.net/' + item).then(setState);
    setTile('Chapter ' + item.replace(/\D+/gi, ''));
  }, []);

  const _onLoadProgress = React.useCallback((event: WebViewProgressEvent) => {
    if (event.nativeEvent.progress == 1) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  return (
    <View style={{flex: 1}}>
      <Web
        onLoadProgress={_onLoadProgress}
        onLayout={_onLayout}
        source={{
          baseUrl: 'https://loveheaven.net/',
          html: htmlContent(state.content),
        }}
        onScroll={_onScroll}
        onMessage={_onMessage}
      />
      <Animated.View
        style={[
          styles.container,
          {
            top: 0,
            height: topBar,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -topBar],
                }),
              },
            ],
          },
        ]}>
        <Pressable
          onPress={() => {
            Navigation.pop(props.componentId);
          }}
          style={styles.header}>
          <AntIcon name={'arrowleft'} size={30} color={'white'} />
          <Text style={styles.title}>{title}</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          {
            bottom: 0,
            height: topBar,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, topBar],
                }),
              },
            ],
          },
        ]}>
        <Pressable
          disabled={state.prev ? false : true}
          onPress={() => {
            _onPress(state.prev);
          }}
          style={styles.footer}>
          <AntIcon
            name={'left'}
            color={state.prev ? 'white' : 'rgba(255,255,255,.5)'}
            size={20}
          />
          <Text
            style={{
              color: state.prev ? 'white' : 'rgba(255,255,255,.5)',
              fontWeight: 'bold',
            }}>
            PREV
          </Text>
        </Pressable>
        <Pressable style={styles.footer}>
          <AntIcon name={'message1'} color={'white'} size={20} />
        </Pressable>
        <Pressable
          disabled={state.next ? false : true}
          onPress={() => {
            _onPress(state.next);
          }}
          style={styles.footer}>
          <Text
            style={{
              color: state.next ? 'white' : 'rgba(255,255,255,.5)',
              fontWeight: 'bold',
            }}>
            NEXT
          </Text>
          <AntIcon
            name={'right'}
            color={state.next ? 'white' : 'rgba(255,255,255,.5)'}
            size={20}
          />
        </Pressable>
      </Animated.View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loading}>
            <ActivityIndicator color={'white'} size={30} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    marginHorizontal: 10,
    color: 'white',
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  ttl: {},
  loadingContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,.75)',
    padding: 10,
    borderRadius: 24,
  },
});

export default WebView;
