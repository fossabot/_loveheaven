import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {getPosts} from 'lhscan-extensions';
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';
import numeral from 'numeral';
import {default as Image} from 'react-native-fast-image';

const Details = (props: any) => {
  const [state, setState] = React.useState<getPosts>({});

  const onCallBack = React.useCallback(() => {
    getPosts('https://loveheaven.net/' + props.id).then(setState);
  }, [props.id]);

  React.useEffect(onCallBack, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{uri: state.image}} style={styles.image} />
          <LinearGradient
            style={styles.linear}
            colors={['rgba(0,0,0,0)', 'black']}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{state.title}</Text>
            <Text style={styles.title_jp}>{state.title_jp}</Text>
          </View>
        </View>
        <View style={styles.sbContainer}>
          <View style={styles.viewContainer}>
            <AntIcon color={'rgba(255,255,255,.5)'} size={15} name={'user'} />
            <Text style={styles.view}>{state.author}</Text>
          </View>
          <View style={styles.viewContainer}>
            <AntIcon color={'rgba(255,255,255,.5)'} size={15} name={'eye'} />
            <Text style={styles.view}>
              {numeral(state.view).format('0.0 a')}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <AntIcon
              color={'rgba(255,255,255,.5)'}
              size={15}
              name={'loading1'}
            />
            <Text style={styles.view}>{state.status}</Text>
          </View>
        </View>
        <View style={{flexWrap: 'wrap', flexDirection: 'row', padding: 10}}>
          {state.genre?.map((item, index) => {
            return (
              <Text key={index} style={styles.genre}>
                {item.title}
              </Text>
            );
          })}
        </View>
        <View style={{padding: 10}}>
          <Text style={styles.descriptionLabel}>description</Text>
          <Text style={styles.description}>{state.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    color: 'white',
  },
  title_jp: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 12,
  },
  imageContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  image: {
    height: 120 * 1.5,
    width: 120,
    borderRadius: 10,
  },
  linear: {
    position: 'absolute',
    height: 120 * 2,
    width: 120,
  },
  titleContainer: {
    padding: 10,
    alignItems: 'center',
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    lineHeight: 20,
    letterSpacing: 1.2,
    color: 'white',
  },
  description: {
    color: 'white',
  },
  sbContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewContainer: {
    flexDirection: 'row',
    letterSpacing: 10,
  },
  view: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 12,
    marginHorizontal: 5,
  },
  genre: {
    margin: 1.5,
    borderRadius: 5,
    backgroundColor: '#333',
    color: 'white',
    padding: 5,
  },
});

export default Details;
