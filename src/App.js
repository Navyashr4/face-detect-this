import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js';
import Particle from './components/Particle/Particle';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import 'tachyons';
import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const initialState ={
    input : '', 
    imageURL : '',
    box : {}, 
    route: 'signin', 
    isSignedIn : false,
    user: {
      id: '', 
      name: '', 
      email: '', 
      entries: 0, 
      joined: ''
    }
}


class App extends Component{
  constructor(){
    super();
    this.state = initialState; 
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return ({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    });
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL : this.state.input});
    fetch('http://localhost:3000/imageurl', {
            method: 'post', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
          })
    .then(response => response.json())
    .then((response) => {
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'put', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log('unable to fetch'))
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      
      
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'home'){
      this.setState({isSignedIn:true});
    } else if (route === 'signout'){ 
      this.setState(initialState);
    }

    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id, 
      name: data.name, 
      email: data.email, 
      entries: data.entries, 
      joined: data.joined
    }})
    this.setState({imageURL:''})
  }

  render(){
    return (
      <div className="App">
        <Particle />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
        { this.state.route === 'home' 
          ? 
          <div>
          <Logo />
          <Rank name = {this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange = {this.onInputChange}  onButtonSubmit = {this.onButtonSubmit}/>
          <FaceRecognition box = {this.state.box} imageURL = {this.state.imageURL} />
          </div>
          : (this.state.route === 'signin'
          ? <SignIn onRouteChange = {this.onRouteChange} loadUser={this.loadUser}/>
          : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>)         
        }          
      </div>
    );
  }
}

export default App;
