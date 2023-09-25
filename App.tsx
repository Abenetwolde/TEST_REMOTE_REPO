import 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import {config, GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import Routes from './src/navigation/Index';

function App(): JSX.Element {
  useEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <GluestackUIProvider config={config.theme}>
        <Routes Stack={Stack} />
      </GluestackUIProvider>
    </NavigationContainer>
  );
}

// const Home = () => {
//   return (
//     <View>
//       <Text>Home is here</Text>
//     </View>
//   );
// };

export default App;
