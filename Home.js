import React, { useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import Tflite from 'tflite-react-native';

const Home = ({navigation})=>{

  let tflite = new Tflite();
  const [imageUri, setImageUri] = useState(null);
  const [imageLab, setImageLab] = useState(null);

  tflite.loadModel({
    model: 'MobileNet-M2.tflite',
    labels: 'Stem_Model.txt',
    numThreads: 1,
  }, (err, res) => {
    if (err) console.log(err);
    else console.log(res);
  });

  const runModel  = () => {
  tflite.runModelOnImage({
    path: imageUri,
    inputShape: [1, 224, 224, 3],
    imageMean: 128,
    imageStd: 128,
    outputType: 'float32',
  }, (err, res) => {
    if (err) console.log(err);
    else {
      console.log(res);
      setImageLab(res[0].label);
    } 
  });
}

  const launchImageLibraryHandler  = () => {

  console.log('launching image library...');

  launchImageLibrary({mediaType: 'photo'}, (response) => {
    console.log('image library response:', response);

    const source = response.assets[0].uri;
    if (source) {
      setImageUri(source);
      console.log('setting imageUri:', source);
    }

  });
};

console.log('imageUri:', imageUri);

function create() {

  set(ref(db, 'users/' + imageLab), {
    label: imageLab
  });

};

const handlePress = () => {
  create();
  runModel();
};

    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {/* <Button title="Take a Photo" onPress={launchCamer} /> */}
        {/*<Button title="Choose From Library" onPress={launchImageLibraryHandler} />
        <Button title="Capture" onPress={launchImageLibraryHandler} />*/}
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }} >
          <Button title="Choose From Library" onPress={launchImageLibraryHandler} />
          <View style={{ width: 10 }} />
          <Button title="Capture" onPress={launchImageLibraryHandler} />
        </View>
        <View style={{ height: 10 }} />
        {imageUri ? 
          <Image source={{uri: imageUri}} style={{ width: 300 , height: 300}} />
        : 
          <Image source={require('../assets/images/Wiki_no_image.png')} style={{ width: 300 , height: 300}} />
          /*<Text>No image selected</Text>*/
        }
        <View style={{ height: 10 }} />
          <Button title="Predict" onPress={runModel} />
          {imageLab ? 
            <Text>Predicted Label: {imageLab}</Text>
          : 
            <Text></Text>
          }
        {/*{imageUri && <Image source={{uri: imageUri}} style={{ width: 300 , height: 300}} />}*/}
        {console.log('rendering Image component...')}
      </View>
    );

}

export default Home;