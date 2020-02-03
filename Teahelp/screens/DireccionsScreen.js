import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { EventRegister } from 'react-native-event-listeners'
import getDirections from 'react-native-google-maps-directions'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import LocationIQ from 'react-native-locationiq';
LocationIQ.init("82b56fb65371c7"); // use a valid API key

export default class DireccionsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llistaDireccions: [],
            search: '',
            llistaDireccionsAux: [],
            isLoading: true,
            modeEdicio: "",
            currentLatitud: "",
            currentLongitud: "",
            destinationLat: "",
            destinationLong: "",


        }
        this.arrayHolder = [];

    }
    componentDidMount() {
        this.getModeEdicio()
        this.getLlistaDireccions()
    }
    static navigationOptions = {
        headerShown: false
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }

    afegirDireccions() {
        this.props.navigation.navigate("AfegirDireccions", { refresh: () => this.refresh() })
    }

    async getModeEdicio() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        this.setState({
            modeEdicio: resultat.modeEdicio
        })
    }

    async getLlistaDireccions() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaDireccions(user.uid)
        //console.log("resultat", resultat)
        this.setState(
            {
                llistaDireccions: resultat,
                llistaDireccionsAux: resultat,
                isLoading: false
            },
            function () {
                this.arrayholder = resultat
            })

    }
    refresh() {
        this.getLlistaDireccions()
    }
    componentWillMount() {
        this.listener = EventRegister.addEventListener('modeEdicio', (data) => {
            /*this.setState({
				data: data.toString(),
                modeEdicio:data.toString(),
			})*/
            this.getModeEdicio()
        })
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }
    search = text => {
        //console.log(text);
    };
    clear = () => {
        this.search.clear();
    };
    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.nom ? item.nom.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            llistaDireccions: newData,
            search: text,
        });
    }
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        this.setState({ loading: true })
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location, loading: false });
        //console.log(this.state.location.coords)
    };

    async handleGetDirections(direccio) {
        var lat
        var lon
        await LocationIQ.search(direccio)
            .then(json => {
                lat = json[0].lat;
                lon = json[0].lon;
            })
            .catch(error => console.warn(error));
        console.log(parseFloat(lat), parseFloat(lon));
        const data = {
            destination: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            },
            /* params: [
                 {
                     key: "travelmode",
                     value: "walking"        // may be "walking", "bicycling" or "transit" as well
                 },
                 {
                     key: "dir_action",
                     value: "navigate"       // this instantly initializes navigation using the given travel mode
                 }
             ],/*
           waypoints: [
             {
               latitude: -33.8600025,
               longitude: 18.697452
             },
             {
               latitude: -33.8600026,
               longitude: 18.697453
             },
                {
               latitude: -33.8600036,
               longitude: 18.697493
             }
           ]*/
        }

        getDirections(data)
    }
    /*openGps = () => {
        var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:'
        var url = scheme + '37.484847,-122.148386'
        this.openExternalApp(url)
      }
      openExternalApp = (url) => {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert(
              'ERROR',
              'Unable to open: ' + url,
              [
                {text: 'OK'},
              ]
            );
          }
        });
      }*/
    async pillaLatLong(direccio) {
        await LocationIQ.search(direccio)
            .then(json => {
                var lat = json[0].lat;
                var lon = json[0].lon;
                this.setState({
                    destinationLat: lat,
                    destinationLong: lon
                })
                console.log(lat, lon);
            })
            .catch(error => console.warn(error));
    }
    render() {
        let rightC
        let backGroundHeader
        if (this.state.modeEdicio) {
            rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirDireccions()} ></Icon>
            backGroundHeader = "#D51313"

        }
        else backGroundHeader = "#00E0B2"

        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor={backGroundHeader}
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: 'DIRECCIONS', style: { color: '#fff', fontSize: 20, } }}
                    rightComponent={rightC}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </View></View>)
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor={backGroundHeader}
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'DIRECCIONS', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={rightC}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>

                        {this.state.llistaDireccionsAux == 0 ?
                            <View style={styles.llistaBuida}>
                                <Text style={styles.text}>Encara no has afegit cap direcció a la llista de direccions, prova d'afegir-ne una fent click a l'icona de dalt a la dreta</Text>
                            </View> :
                            <View >
                                <SearchBar
                                    round
                                    searchIcon={{ size: 24 }}
                                    onChangeText={text => this.SearchFilterFunction(text)}
                                    onClear={text => this.SearchFilterFunction('')}
                                    placeholder="Escriu aquí..."
                                    value={this.state.search}
                                    lightTheme
                                    containerStyle={{ backgroundColor: backGroundHeader }}
                                    inputContainerStyle={{ backgroundColor: 'white' }}
                                />
                                <FlatList
                                    data={this.state.llistaDireccions}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => this.handleGetDirections(item.direccio)}>
                                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                                title={item.nom}
                                                subtitle={item.direccio}
                                                titleStyle={{ fontSize: 20 }}
                                                subtitleStyle={{ paddingTop: 10, fontSize: 20 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.nom}
                                />
                            </View>}
                    </ScrollView>
                </SafeAreaView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    llistaBuida: {
        paddingTop: 200,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    }
});

