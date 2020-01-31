import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import HomeScreen from './screens/HomeScreen'
import FirstView from './screens/FirstView'
import LoginScreen from './screens/LogInScreen'
import Register from './screens/RegisterScreen'
import ForgotPassword from './screens/ForgotPassword'
import firebase from 'firebase'
import ContactesScreen from './screens/ContactesScreen'
import PictogramesScreen from './screens/PictogramesScreen'
import DireccionsScreen from './screens/DireccionsScreen'
import UbicacióScreen from './screens/UbicacióScreen'
import AfegirContactes from './screens/AfegirContactes';
import PerfilUsuari from './screens/PerfilUsuari'
import AfegirDireccions from './screens/AfegirDireccions';
import AfegirPreferencies from './screens/AfegirPreferencies'
import AfegirPictogrames from './screens/AfegirPictogrames'

const AuthStack = createStackNavigator(
  {
    FirstView: { screen: FirstView },
    Login: { screen: LoginScreen },
    Register: { screen: Register },
    ForgotPassword: { screen: ForgotPassword }
  },
);

const Contactes = createStackNavigator(
  {
    ContactesScreen: { screen: ContactesScreen },
    AfegirContactes: { screen: AfegirContactes }
  }
)
const Pictogrames = createStackNavigator(
  {
    PictogramesScreen: { screen: PictogramesScreen },
    AfegirPictogrames:{screen:AfegirPictogrames}
  }
)

const Ubicacio = createStackNavigator(
  {
    UbicacióScreen: { screen: UbicacióScreen }
  }
)
const Direccio = createStackNavigator(
  {
    DireccionsScreen: { screen: DireccionsScreen },
    AfegirDireccions:{screen:AfegirDireccions}
  }
)

const Perfil = createStackNavigator(
  {
    PerfilUsuari: { screen: PerfilUsuari }
  }
)
const Home = createStackNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    AfegirPreferencies:{screen: AfegirPreferencies},
  },
)
const MainDrawer = createDrawerNavigator({
  BOTÓ: Home,
  PICTOGRAMES: Pictogrames,
  CONTACTES: Contactes,
  UBICACIÓ: Ubicacio,
  DIRECCIONS: Direccio,
  PERFIL: Perfil,
},
  {
    hideStatusBar: true,
    contentComponent: (props) => (
      <View style={{ height: "90%" }}>
        <DrawerItems {...props} />
        <TouchableOpacity onPress={() =>
          Alert.alert(
            'Tancar sessió',
            'Segur que vols tancar sessió?',
            [
              { text: 'Cancelar', onPress: () => { return null } },
              {
                text: 'Confirmar', onPress: () => {
                  firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                    props.navigation.navigate('Login')

                  }).catch(function (error) {
                    // An error happened.
                  });

                }
              },
            ],
            { cancelable: false }
          )
        }>
          <Text style={{ marginLeft: 16, fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>TANCAR SESSIÓ</Text>
        </TouchableOpacity>
      </View>
    ),
  });


const App = createSwitchNavigator(
  {
    Auth: {
      screen: AuthStack
    },
    App: {
      screen: MainDrawer
    },
  }
)

export default createAppContainer(App);
