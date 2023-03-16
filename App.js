import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ScreenM from './src/screen/ScreenM';
import Home from './src/screen/Home';
import MultipleImg from './src/screen/MultipleImg';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ScreenM"
          component={ScreenM}
          options={{title: 'Home'}}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MultipleImg" component={MultipleImg} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;