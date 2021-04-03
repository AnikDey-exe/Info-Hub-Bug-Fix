import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {ScrollView} from "react-native-gesture-handler";

export default class OfferScreen extends Component {
    constructor() {
        super();
        this.state ={
          userId : firebase.auth().currentUser.email,
          topic:"",
          description:"",
          pricing: "",
          userName: "",
          contact: "",
          docId: "",
          points: null
        }
    }
 
    getUserDetails = () => {
        db.collection("Users").where("emailID","==",this.state.userId).get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                this.setState({
                    userName: doc.data().firstName + " " + doc.data().lastName,
                    docId: doc.id,
                    points: doc.data().points
                })
            })
        })
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    componentDidMount() {
        this.getUserDetails();
    }
    
    addPost =(topic, description, pricing, contact)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('TuitionsList').add({
            "userId": userId,
            "topic": topic,
            "description": description,
            "pricing": pricing,
            "contact": contact,
            "requestId":randomRequestId,
            "userName": this.state.userName
        })
    
        this.setState({
            topic:'',
            description: ''
        })
    
        return Alert.alert("Your post has been added. \n Note that you can only post a topic and get 20 points only once per session.");
    }

    addPoints = (userId) => {
        db.collection("Users").doc(this.state.docId).update({
            'points': this.state.points + 20
        })

        return Alert.alert('20 Points Added');
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <ScrollView>
                <MyHeader
                title="Offer A Tuition"
                navigation={this.props.navigation}/>

            <KeyboardAvoidingView style={styles.keyBoardStyle}>
                      <Text style={{fontSize: 15, alignSelf: 'center', fontWeight: 'bold', marginTop: 20}}> Total Points: {this.state.points} </Text>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"Topic(What will your tuition be about?)"}
                onChangeText={(text)=>{
                    this.setState({
                        topic:text
                    })
                }}
                value={this.state.topic}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"What exactly will you offer in your tuition?"}
                onChangeText ={(text)=>{
                    this.setState({
                        description: text
                    })
                }}
                value ={this.state.description}
              />

                <TextInput
                style ={styles.formTextInput}
                placeholder={"What is your price?"}
                onChangeText ={(text)=>{
                    this.setState({
                        pricing: text
                    })
                }}
                value ={this.state.pricing}
              />

                <TextInput
                style ={styles.formTextInput}
                placeholder={"Email/Phone Number"}
                onChangeText ={(text)=>{
                    this.setState({
                        contact: text
                    })
                }}
                value ={this.state.contact}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    this.addPost(this.state.topic,this.state.description,this.state.pricing,this.state.contact)
                    this.addPoints(this.state.userId)
                }}>
                <Text>Add</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:40,
      alignSelf:'center',
      borderColor:'#32a8a2',
      borderRadius:15,
      borderWidth:0.5,
      marginTop:25,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:15,
      backgroundColor:"#32a8a2",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )