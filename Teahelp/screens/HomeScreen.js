import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, Image } from 'react-native';
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen');
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import { Header, Icon } from 'react-native-elements'
import email from 'react-native-email'


export default class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
            modeEdicio: "",

		};

	}
	static navigationOptions = {
        headerShown: false
	}
	
	obrirDrawer = () => {
		this.props.navigation.openDrawer();
	}

	componentDidMount(){
		this.getModeEdicio()
	}
	refresh(){
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
				</View>
				<View style={styles.botoVermell}>
					<Image source={require("./images/redCircle.png")} style={{width:350, height: 350}} on></Image>
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
	titol:{
		flex:1, 
		alignItems:'center',
		justifyContent:'center',

	},
	botoVermell:{
		flex:3,
		alignItems:'center',
	}
});