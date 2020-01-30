import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';

import { Header, Icon } from 'react-native-elements'


export default class UbicacióScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
      }

    static navigationOptions={
        header:null
    }

    obrirDrawer = () => {
		this.props.navigation.openDrawer();
    }
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
		backgroundColor: '#fff', 
    }
});
