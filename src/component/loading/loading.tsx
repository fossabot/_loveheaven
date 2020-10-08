import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadingIndicator = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={'white'} size={20} />
    </View>
  );
};

export default LoadingIndicator;
