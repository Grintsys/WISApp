import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import AuthScreen from '../AuthScreen'
//import HomeScreen from '../HomeScreen'
//import HomeScreen from '../../Containers/FooterTabNavigation'

import API from "../../Services/Api"
import FJSON from 'format-json'
import { NavigationActions } from 'react-navigation';

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class LoginAnimation extends Component {

  api = {}

  state = {
    isLoggedIn: false, // Is the user authenticated?
    isLoading: false, // Is the user loggingIn/signinUp?
    isAppReady: false, // Has the app completed the login animation?
    errorMessage: '' //is a login fail
  }


  constructor(props){
    super(props)

    this.api = API.create()
  }

  handleHomeNavigation() {
    /*const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate('TabStack')
      ]
    })
    return () => this.props.navigation.dispatch(resetAction)*/
    this.props.navigation.navigate('TabStack');
  }

  doLogin = async (username, password) =>{

    const response = await this.api.doLogin(username, password);

    if(response.data.success === true){

      var users = response.data.users;
      var studentcode = String(users[0].StudentCode);

      try{

        this.getStudentData(studentcode);
        //await AsyncStorage.setItem('Users', JSON.stringify(users));
        await AsyncStorage.setItem('StudentCode', studentcode);
        await AsyncStorage.setItem('Username', username);

      }catch(err){
        console.log(err);
      }

      this.handleHomeNavigation();
    }

    this.setState({
      isLoggedIn: response.data.success,
      errorMessage: response.data.message,
      isLoading: false,
    });
  }

  getStudentData = async (student) =>{

    console.log(`getStudentData(${student})`);
    const response = await this.api.getStudentData(student);

    if(response.data.success === true)
    {
      try{
        await AsyncStorage.setItem('GradeId', String(response.data.data.GradeId));
        await AsyncStorage.setItem('SectionId', String(response.data.data.SectionId));
      }catch(err){
        console.error(err);
      }
    }
    else
    {
      console.log(`error on getStudentData(${student})`);
    }
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _doLogin = (username, password) => {
    this.setState({ isLoading: true })
    this.doLogin(username, password)
  }

  _doSignup = (username, password, fullName) => {
    this.setState({ isLoading: true })
    setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000)
  }

  /**
   * Simple routing.
   * If the user is authenticated (isAppReady) show the HomeScreen, otherwise show the AuthScreen
   */

   /**
    * return (
        <HomeScreen
          logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
        />
      )
    */
  /*render () {
    if (this.state.isAppReady) {
      return (
        <HomeScreen />
      )
    } else {
      return (
        <AuthScreen
          login={this._doLogin}
          signup={this._doSignup}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.isLoading}
          errorMessage={this.state.errorMessage}
          onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
        />
      )
    } 
  }*/

  render () {
    return (
        <AuthScreen
          login={this._doLogin}
          signup={this._doSignup}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.isLoading}
          errorMessage={this.state.errorMessage}
          onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
        />
    )
  }
}

export default LoginAnimation
