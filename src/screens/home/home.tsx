import React from 'react';
import {ScrollView, View} from 'react-native';
import HomePosts from 'lhscan-extensions';
import Slide from 'component/slide';
import List from 'component/list';

const Home = (props: any) => {
  const [state, setState] = React.useState<HomePosts[]>([]);

  React.useEffect(
    React.useCallback(() => {
      HomePosts().then(setState);
    }, []),
    [],
  );

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
