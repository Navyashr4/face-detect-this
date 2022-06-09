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
      box : []
    }
  }

  calculateFaceLocation = (data, i) =>{
    const clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return ({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }, i);
  }

  displayFaceBox = (box, i) => {
    const boxArray = [];
    for (var int = 0; int < i; int++)
    {
      boxArray.push(box);
    }
    this.setState({box: boxArray});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // onButtonSubmit = () => {
  //   this.setState({imageURL : this.state.input});
  //   app.models
  //     .predict(
  //       Clarifai.FACE_DETECT_MODEL,
  //       this.state.input
  //       )
  //     .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  //     // .then(response => console.log(response))
  //     .catch(err => console.log(err));
  // }

  onButtonSubmit = () => {
    this.setState({imageURL : this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
        )
      .then((response) => {
        const facesCount = response.outputs[0].data.regions.length;
        console.log(response);
        console.log(facesCount);

        for (var i = 0; i < facesCount; i++){
          this.displayFaceBox(this.calculateFaceLocation(response, i), i);
        }

      })
      .catch(err => console.log(err));
  }

  render(){
    return (
      <div className="App">
        <Particle />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange = {this.onInputChange}  onButtonSubmit = {this.onButtonSubmit}/>
        <FaceRecognition box = {this.state.box} imageURL = {this.state.imageURL} />        
      </div>
    );
  }
}

export default App;
