import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, ActivityIndicator, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements'
//import { Constants, Location, Permissions } from "expo";
import MapView, { Marker } from 'react-native-maps';
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import { EventRegister } from 'react-native-event-listeners'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Geolocation from 'react-native-geolocation-service';
import { TouchableOpacity } from 'react-native-gesture-handler';



export default class UbicacióScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modeEdicio: "",
            location: null,
            errorMessage: null,
            latitude: "",
            longitude: "",
            longitudeDelta: 0.005,
            latitudeDelta: 0.005,
            loading: "",
            region: "",
            regionCanvi: "",
            markers: []
        }
        this.onRegionChange = this.onRegionChange.bind(this)
    }

    static navigationOptions = {
        headerShown: false
    }
    componentDidMount() {
        this.getModeEdicio()
    }

    async getModeEdicio() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        this.setState({
            modeEdicio: resultat.modeEdicio
        })
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }
    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
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

    getInitialState() {
        let regionInicial = {
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            longitudeDelta: this.state.longitudeDelta,
            latitudeDelta: this.state.latitudeDelta,
        }
        this.setState({
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            region: regionInicial

        })
    }
    onRegionChange(region) {
        this.setState({ regionCanvi: region });
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: "No s'ha permès l'accés a l'ubicació",
            });
        }
        this.setState({ loading: true })
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location, loading: false, });
        this.getInitialState()
    };
    returnPosition() {

    }
    render() {
        let backGroundHeader
        this.state.modeEdicio ? backGroundHeader = "#D51313" : backGroundHeader = "#00E0B2"
        if (this.state.loading) return (
            <View style={{ flex: 1 }}>
                <View >
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor={backGroundHeader}
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'UBICACIÓ', style: { color: '#fff', fontSize: 20, } }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="black"></ActivityIndicator>
                </View>
            </View>)
        let text = 'Waiting..';
        if (this.state.errorMessage) {
            Alert.alert(this.state.errorMessage);
        } else if (this.state.location) {
            text = JSON.stringify(this.state.location);
        }
        return (
            <View style={styles.container}>
                <View>
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor={backGroundHeader}
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'UBICACIÓ', style: { color: '#fff', fontSize: 20, } }}
                    />
                </View>
                <View>
                    <MapView style={styles.mapStyle}
                        initialRegion={this.state.region}
                        onRegionChange={this.onRegionChange}
                        followsUserLocation={true}
                        
                    >
                        <Marker
                            coordinate={this.state.region}
                            title="TÚ"
                            description="ET TROBES AQUÍ"
                        />

                    </MapView>
{                /*    <View style={{ position: 'absolute', bottom: 100, right: 10, flex: 1 }}>
                        <TouchableOpacity onPress={()=>this.onRegionChange()}>
                            <Image source={require('./images/Logo.png')} style={{ width: 100, height: 100, borderRadius: 90 }} ></Image>
                        </TouchableOpacity>
        </View>*/}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapStyle: {

        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
