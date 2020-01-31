import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Header, Icon } from 'react-native-elements'
import {Constants, Location, Permissions } from "expo";
import MapView from 'react-native-maps';


export default class UbicacióScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static navigationOptions = {
        headerShown: false
    }

    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }

    /*
        componentDidMount() {
            this._getLocationAsync();
        }
    
    
    
        _getLocationAsync = async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({
                    locationResult: 'Permission to access location was denied',
                    location,
                });
            }
    
            let location = await Location.getCurrentPositionAsync({});
            //console.log("MYLIVELOCATION", "" + JSON.stringify(location));
        };*/
    render() {

        return (
            <View style={styles.container}>
                <View>
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor="#00E0B2"
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'UBICACIÓ', style: { color: '#fff', fontSize: 20, } }}
                    />
                </View>
                <View>
                <MapView
                    
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});
