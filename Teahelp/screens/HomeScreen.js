import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen');
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import { Header, Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SMS from 'expo-sms';
import { EventRegister } from 'react-native-event-listeners'
import LocationIQ from 'react-native-locationiq';
import getDirections from 'react-native-google-maps-directions'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

LocationIQ.init("82b56fb65371c7"); // use a valid API key

export default class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modeEdicio: "",
			numPreferit1: "",
			numPreferit2: "",
			numPreferit3: "",
			nomUsuari: "",
			data: 'no data',
			location:"",
			currentLatitud: "",
			currentLongitud: "",
			currentAdress: "",
		};

	}
	static navigationOptions = {
		headerShown: false
	}

	obrirDrawer = () => {
		this.props.navigation.openDrawer();
	}

	componentDidMount() {
		this.getModeEdicio()
		this.getLlistaPreferits()
		this.getDades()

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
	refresh() {
		this.getModeEdicio()
	}
	async getModeEdicio() {
		var user = firebase.auth().currentUser
		let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
		this.setState({
			modeEdicio: resultat.modeEdicio
		})
	}

	afegirPreferencies() {
		this.props.navigation.navigate("AfegirPreferencies", { refresh: () => this.refresh() })
	}
	async getLlistaPreferits() {
		let user = firebase.auth().currentUser
		let resultat = await FirebaseAPI.getLlistaPreferencies(user.uid)
		console.log("resultat", resultat[0].numContacte, resultat[1].numContacte, resultat[2].numContacte)
		this.setState({
			numPreferit1: resultat[0].numContacte,
			numPreferit2: resultat[1].numContacte,
			numPreferit3: resultat[2].numContacte,

		})

	}
    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
		}
	}
	async getDades() {
		let user = firebase.auth().currentUser
		let result = await FirebaseAPI.getDadesUsuari(user.uid)
		console.log(result)
		this.setState({ nomUsuari: result.firstName + " " + result.lastName })
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
		this.setState({ 
			location, 
			loading: false,
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            region: regionInicial

		})
		this.getAddress()
	};
	

	async trucaPreferits() {
		if(this.state.numPreferit1 != "" ){
			this._getLocationAsync()
		const isAvailable = await SMS.isAvailableAsync();
		if (isAvailable) {

			const { result } = await SMS.sendSMSAsync(
				[this.state.numPreferit1, this.state.numPreferit2, this.state.numPreferit3,],
				"Hola, sóc " + this.state.nomUsuari + " i necessito ajuda, estic a " + this.state.currentAdress
			);
		}}
		else {
			Alert.alert("Alerta", "No podem enviar cap missatge perquè no tens cap contacte agregat, prova d'afegir-ne un a la pantalla de contactes i afegeix-los a preferits")
		}

	}
	async getAddress(){
		var adress
		await LocationIQ.reverse(this.state.currentLatitud, this.state.currentLongitud)
        .then(json => {
            address = json.address;
            console.log(adress);
        })
		.catch(error => console.warn(error));
		this.setState({currentAdress: adress})
	}
	render() {
		let rightC
		let backGroundHeader
		if (this.state.modeEdicio) {
			rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirPreferencies()} ></Icon>
			backGroundHeader = "#D51313"

		}
		else backGroundHeader = "#00E0B2"

		console.log("modeedicio", this.state.modeEdicio)
		return (

			<View style={styles.container}>
				<View>
					<Header
						style={{ width: '100%' }}
						backgroundColor={backGroundHeader}
						leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
						centerComponent={{ text: 'BOTÓ', style: { color: '#fff', fontSize: 20, } }}
						rightComponent={rightC}
					/>
				</View>
				<View style={styles.titol}>
					<Text style={{ fontSize: 30 }}>ET TROBES BÉ?</Text>
				</View><View style={styles.botoVermell}>
					<TouchableOpacity onPress={() => this.trucaPreferits()}>

						<Image source={require("./images/redCircle.png")} style={{ width: 350, height: 350 }} on></Image>

					</TouchableOpacity>
				</View>
				{ /*<View style={{flex:1}}>
				<Text>{this.state.data}</Text>
		</View>*/}
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	titol: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',

	},
	botoVermell: {
		flex: 3,
		alignItems: 'center',
	}
});