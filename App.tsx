import 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import {config, GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import Routes from './src/navigation/Index';
import {Provider} from 'react-redux';
import store from './src/reduxToolkit/Store';
<<<<<<< HEAD
import {AuthContext} from './src/Realm/model';

=======
import Config from 'react-native-config';
>>>>>>> ETID-15
function App(): JSX.Element {
  const {RealmProvider} = AuthContext;

  useEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  const Stack = createStackNavigator();
 
  console.log('my url ', Config.API_URL);
  console.log('config ',  Config); 
  return (
    <RealmProvider>
      <NavigationContainer>
        <GluestackUIProvider config={config.theme}>
          <Provider store={store}>
            <Routes Stack={Stack} />
          </Provider>
        </GluestackUIProvider>
      </NavigationContainer>
    </RealmProvider>
  );
}

export default App;
