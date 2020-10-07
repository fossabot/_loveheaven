import React from 'react';
import {ScrollView, View} from 'react-native';
import HomePosts from 'lhscan-extensions';
import Slide from 'component/slide';
import List from 'component/list';
import {Navigation} from 'react-native-navigation';

const Home = (props: any) => {
  const isMounted = React.useRef<boolean | null>(null);
  const [state, setState] = React.useState<HomePosts[]>([]);

  React.useEffect(
    React.useCallback(() => {
      HomePosts().then(setState);
    }, []),
    [],
  );

  React.useEffect(() => {
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

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <Slide state={state} componentId={props.componentId} />
        <List state={state} componentId={props.componentId} />
      </ScrollView>
    </View>
  );
};

export default Home;
