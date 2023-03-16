import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList,Dimensions } from 'react-native';
import { openPicker } from 'react-native-image-crop-picker';
import Tflite from 'tflite-react-native';
import { PieChart } from 'react-native-chart-kit';

const MyImagePicker = ({navigation}) => {
  let tflite = new Tflite();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageLabels, setImageLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  tflite.loadModel(
    {
      model: 'MobileNet-M2.tflite',
      labels: 'Stem_Model.txt',
      numThreads: 1,
    },
    (err, res) => {
      if (err) console.log(err);
      else console.log(res);
    }
  );

  const runModel = () => {
    const labels = selectedImages.map((image) => {
      return new Promise((resolve, reject) => {
        tflite.runModelOnImage({
          path: image.path,
          inputShape: [1, 224, 224, 3],
          imageMean: 128,
          imageStd: 128,
          outputType: 'float32',
        }, (err, res) => {
          if (err) reject(err);
          else resolve(res[0].label);
        });
      });
    });
  
    Promise.all(labels)
      .then((labels) => {
        setImageLabels(labels);
        const labelCounts = {};
        labels.forEach((label) => {
          if (labelCounts[label]) {
            labelCounts[label] += 1;
          } else {
            labelCounts[label] = 1;
          }
        });

        // Array of colors for labels
        const labelColors = [
          '#FF5733',
          '#FFA500',
          '#FFFF00',
          '#8CFF33',
        ];
        
        const chartData = Object.keys(labelCounts).map((label, index) => {
          const count = labelCounts[label];
          const percent = ((count / selectedImages.length) * 100).toFixed(2);
          return {
            name: label,
            value: count,
            percent: percent,
            color: labelColors[index % labelColors.length],
            //count: count,
          };
        });  
        setChartData(chartData);
      })
      .catch((error) => {
        console.log(error);
      });
  };  

  const handleChooseImages = () => {
    openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    })
      .then((images) => {
        setSelectedImages(images);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ margin: 5 }}>
        <Image source={{ uri: item.path }} style={{ width: 100, height: 100 }} />
      </View>
    );
  };

  return (
      <View>
        <Button title="Choose Images" onPress={handleChooseImages} />
            {selectedImages.length > 0 && (
              <FlatList
                data={selectedImages}
                renderItem={renderItem}
                keyExtractor={(item) => item.path}
                horizontal
              />
            )}
            <Button title="Predict" onPress={runModel} />
            <View style={{ height: 100 }} />
            {chartData.length > 0 && (
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          formatText={(value, name) => `${name}: ${value} (${value.percent}%)`}
        />
      )}
      </View>
    );
};

export default MyImagePicker;