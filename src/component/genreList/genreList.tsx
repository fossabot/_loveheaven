import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {getByGenre} from 'lhscan-extensions';

interface props {
  select: (item: getByGenre | undefined) => void;
}

const GenreList = (props: props) => {
  const [state, setState] = React.useState<getByGenre[]>([]);
  const [select, setSelect] = React.useState<number | null>(null);

  const onCallBack = React.useCallback(() => {
    getByGenre().then(setState);
  }, []);

  React.useEffect(onCallBack, []);

  const renderItem = React.useCallback(
    (item, index) => {
      return (
        <Pressable
          onPress={() => {
            if (select === index) {
              setSelect(null);
              props.select(undefined);
            } else {
              setSelect(index);
              props.select(item);
            }
          }}
          key={index}
          style={{
            padding: 5,
            backgroundColor: select === index ? 'red' : '#333',
            margin: 5 / 2,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white'}}>{item.title}</Text>
        </Pressable>
      );
    },
    [select],
  );

  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {state.map(renderItem)}
    </View>
  );
};

export default GenreList;
