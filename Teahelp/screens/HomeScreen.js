import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, Image } from 'react-native';
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen');
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import { Header, Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SMS from 'expo-sms';


export default class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modeEdicio: "",
			numPreferit1: "",
			numPreferit2: "",
			numPreferit3: "",
			nomUsuari:"",
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

	async getDades(){
		let user = firebase.auth().currentUser
		let result = await FirebaseAPI.getDadesUsuari(user.uid)
		console.log(result)
		this.setState({nomUsuari: result.firstName + " " + result.lastName})
	}
	async trucaPreferits() {
		const isAvailable = await SMS.isAvailableAsync();
		if (isAvailable) {

			const { result } = await SMS.sendSMSAsync(
				[this.state.numPreferit1, this.state.numPreferit2, this.state.numPreferit3,],
				"Hola, sóc " + this.state.nomUsuari + " i necessito ajuda"
			);
		}

	}
	render() {
		let rightC
		if (this.state.modeEdicio) rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirPreferencies()} ></Icon>
		return (

			<View style={styles.container}>
				<View>
					<Header
						style={{ width: '100%' }}
						backgroundColor="#00E0B2"
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