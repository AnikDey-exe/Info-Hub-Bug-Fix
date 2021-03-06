import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity} from 'react-native';
import { ListItem, Card, Icon, Header } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class TuitionDetailsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            receiverID: this.props.navigation.getParam('details')["userId"],
            requestID: this.props.navigation.getParam('details')["requestId"],
            topic: this.props.navigation.getParam('details')["topic"],
            description: this.props.navigation.getParam('details')["description"],
            pricing: this.props.navigation.getParam('details')["pricing"],
            contact: this.props.navigation.getParam('details')["contact"],
            receiverFirstName: '',
            receiverLastName: '',
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: '',
            userName: '',
            interested: ''
        }
    }

    getReceiverDetails(){
        db.collection("Users").where("emailID","==",this.state.receiverID).get()
        .then(snapshot=>{
            snapshot.forEach(doc => {
                this.setState({
                    receiverFirstName: doc.data().firstName,
                    receiverLastName: doc.data().lastName,
                    receiverName: doc.data().firstName + " " + doc.data().lastName,
                    receiverContact: doc.data().contact,
                })
            })
        })

        db.collection("ExplanationsList").where("requestID","==",this.state.requestID).get()
        .then(snapshot=>{
            snapshot.forEach(doc => {
                this.setState({
                    receiverRequestDocId: doc.id
                })
            })
        })
    }

    componentDidMount() {
        this.getReceiverDetails();
    }

    render() {
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <Header
                    leftComponent={<Icon name="arrow-left" type='feather' color='black' onPress={() => this.props.navigation.goBack()}/>}
                    centerComponent={{text: "Details",style:{color: 'black',fontSize: 20, fontWeight: 'bold',height: 50, paddingTop: 5}}}
                    backgroundColor="#edf2ef"/>
                </View>

                <View style={{flex: 0.3}}>
                    <Card
                    title={"Tuition Details"}
                    titleStyle={{fontSize: 20}}>
                        <Card>
                            <Text style={{fontWeight: 'bold'}}> Topic: {this.state.topic} </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}> Description: {this.state.description} </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}> Pricing: {this.state.pricing} </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}> Contact: {this.state.contact} </Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight: 'bold'}}> By: {this.state.receiverName} </Text>
                        </Card>
                    </Card>
                </View>
                {
                    this.state.interested === '' ? (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity 
                        style={{backgroundColor: 'black', width: 100, height: 30, borderRadius: 15, alignSelf: 'center', marginTop: 100}}
                        onPress={()=>{
                            this.setState({
                                interested: true
                            })
                        }}>
                            <Text style={{alignSelf: 'center', color: 'white'}}> I Am Interested </Text>
                        </TouchableOpacity>
                    </View>
                    ) : (
                        null
                    )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 200,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 60
    }
})