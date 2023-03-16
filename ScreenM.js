import React from 'react';
import { View, Button } from 'react-native';

const ScreenM = ({navigation})=>{
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
            title="Go to single predict"
            onPress={() =>
            navigation.navigate('Home')
            }
        />

        <Button
            title="Go to single predict"
            onPress={() =>
            navigation.navigate('MultipleImg')
            }
        />
        </View>
      
    );
  };
  export default ScreenM;