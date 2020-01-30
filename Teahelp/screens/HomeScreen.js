import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, Image } from 'react-native';
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen');
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import { Header, Icon } from 'react-native-elements'


export default class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};

	}

	obrirDrawer = () => {
		this.props.navigation.openDrawer();
	}
	


	render() {
		return (

			<View style={styles.container}>
				<View>
					<Header
						style={{ width: '100%'}}
            backgroundColor="#00E0B2"
						leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
						centerComponent={{ text: 'BOTÓ', style: { color: '#fff', fontSize: 20 , } }}
					/>
				</View>
				<View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: 30 }}> Et trobes bé? </Text>
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
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
});