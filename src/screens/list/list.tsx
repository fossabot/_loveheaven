import React from 'react';
import {
  DrawerLayoutAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
} from 'react-native';
import {getByListWithImageResult, postList} from 'lhscan-extensions';
import ListItem from 'component/listItem';
import genre from 'utils/genre';
import {Navigation} from 'react-native-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';

const ListScreen = (props: any) => {
  const [state, setState] = React.useState<postList>();
  const [page, setPage] = React.useState<number>(1);
  const [select, setSelect] = React.useState<genre | null>(null);
  const [search, setSearch] = React.useState<string>('');
  const refSelect = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const refDrawer = React.useRef<any>();
  const refBtn = React.useRef<any>();

  React.useEffect(() => {
    const listener = {
      componentDidAppear: function () {
        postList({}).then(setState);
        (async () => {
          Navigation.mergeOptions(props.componentId, {
            topBar: {
              rightButtons: [
                {
                  id: 'setting',
                  color: 'white',
                  icon: await AntIcon.getImageSource('infocirlce', 20),
                },
              ],
            },
          });
        })();
        refBtn.current = Navigation.events().registerNavigationButtonPressedListener(
          ({buttonId}) => {
            if (buttonId === 'setting') {
              refDrawer.current?.openDrawer();
            }
          },
        );
      },
      componentDidDisappear: function () {
        if (refBtn.current != null) {
          refBtn.current.remove();
          refDrawer.current?.closeDrawer();
        }
      },
    };
    const subscriber = Navigation.events().registerComponentListener(
      listener,
      props.componentId,
    );
    return () => {
      subscriber.remove();
    };
  }, [props.componentId]);

  const onEnd = React.useCallback(() => {
    if (page > state?.page) {
      return;
    } else {
      postList({
        page: page + 1,
        genre: select?.id ? select.id : '',
        search: search.length > 1 ? search : '',
      }).then((results) => {
        const list: getByListWithImageResult[] | any = state?.list.concat(
          results.list,
        );
        setState({
          page: results.page,
          list: list,
        });
        setPage(page + 1);
      });
    }
  }, [page, search, select, state]);

  const onReload = React.useCallback(() => {
    if (select?.id) {
      postList({
        genre: select.id,
        search: search.length > 1 ? search : '',
      }).then(setState);
      refDrawer.current.closeDrawer();
    }
  }, [search, select]);

  const selectItem = (item: genre) => {
    if (select?.id === item.id) {
      setSelect(null);
      Animated.timing(refSelect, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      setSelect(item);
      Animated.timing(refSelect, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const onSearch = React.useCallback(() => {
    if (search.length > 1) {
      refDrawer.current.closeDrawer();
      postList({search}).then(setState);
    } else {
      refDrawer.current.closeDrawer();
    }
  }, [search]);

  const SearchContent = () => (
    <View style={styles.searchContainer}>
      <TextInput
        value={search}
        onChangeText={(text) => setSearch(text)}
        style={styles.inputContainer}
        placeholder={'search'}
      />
      <Pressable
        onPress={onSearch}
        style={{
          width: 40,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AntIcon name={'search1'} size={20} color={'blue'} />
      </Pressable>
    </View>
  );

  const navigationView = () => (
    <View style={{flex: 1, padding: '5%', backgroundColor: 'black'}}>
      {SearchContent()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {genre.map((item, index) => (
          <Pressable
            onPress={() => {
              selectItem(item);
            }}
            style={[
              styles.genreITem,
              {
                // @ts-ignore
                backgroundColor: select?.id === item.id ? 'red' : '#333',
              },
            ]}
            key={index}>
            <Text style={styles.genreText}>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Animated.View
        style={[
          styles.genreModel,
          {
            transform: [
              {
                translateY: refSelect.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}>
        <Pressable
          onPress={() => {
            refDrawer.current.closeDrawer();
            setSelect(null);
            Animated.timing(refSelect, {
              toValue: 0,
              useNativeDriver: true,
              duration: 500,
            }).start();
          }}
          style={[
            styles.selectModel,
            {
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            },
          ]}>
          <Text style={styles.seletText}>CANCEL</Text>
        </Pressable>
        <Pressable
          onPress={onReload}
          style={[
            styles.selectModel,
            {
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            },
          ]}>
          <Text style={styles.seletText}>SAVE</Text>
        </Pressable>
      </Animated.View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <DrawerLayoutAndroid
        ref={refDrawer}
        drawerWidth={200}
        drawerPosition={'left'}
        renderNavigationView={navigationView}>
        <ListItem
          onEndReached={onEnd}
          state={state?.list}
          componentId={props.componentId}
        />
      </DrawerLayoutAndroid>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 35,
    marginBottom: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    color: '#000',
  },
  genreITem: {
    padding: 5,
    margin: 2.5,
    borderRadius: 5,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  genreModel: {
    backgroundColor: '#333',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectModel: {
    height: 35,
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seletText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListScreen;
