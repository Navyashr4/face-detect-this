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


//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: 'ce346e54fbdb4e1499c3777aa3d101ed'
 });


class App extends Component{
  constructor(){
    super();
    this.state = {
      input : '', 
      imageURL : '',
      box : {}, 
      route: 'signin', 
      isSignedIn : false
    }
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
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
        )
      .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'home'){
      this.setState({isSignedIn:true});
    } else{
      this.setState({isSignedIn:false});
    }

    this.setState({route: route});
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
          <Rank />
          <ImageLinkForm onInputChange = {this.onInputChange}  onButtonSubmit = {this.onButtonSubmit}/>
          <FaceRecognition box = {this.state.box} imageURL = {this.state.imageURL} />
          </div>
          : (this.state.route === 'signin'
          ? <SignIn onRouteChange = {this.onRouteChange}/>
          : <Register onRouteChange = {this.onRouteChange}/>)         
        }          
      </div>
    );
  }
}

export default App;
