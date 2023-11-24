import React, { useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import MainBottomNav from '../../../components/Organisms/MainBottomNav';
import ProfileEdit from '../../../components/Organisms/ProfileEdit';
import { screenHeight, screenWidth } from '../../../utils/Data/data';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import checkCameraPermission from '../../../utils/Functions/Helper/CameraPermisstion';

const ProfileEditIndex = () => {
  const [avatar, setAvatar] = useState('');
  const uploadImage = async() => {
         const permissionStatus = await checkCameraPermission();
         if (permissionStatus !== RESULTS.GRANTED) {
           console.log('Camera permission denied');
           return;
         }
   
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image: ImageOrVideo | null) => {
      if (image) {
        setAvatar('data:image/jpeg;base64,' + image.data);
      }
    }).catch((e)=>console.error);
  };
  return (
    <View style={styles.container}>

      <View style={styles.imageBg}>
        <ImageBackground
          style={styles.img}
          source={{ uri: avatar
            ? avatar: 'https://th.bing.com/th/id/OIP.fmwdQXSSqKuRzNiYrbcNFgHaHa?rs=1&pid=ImgDetMain',}} 
        >
          <Text>{''}</Text>
          <TouchableOpacity style={styles.editIconContainer} onPress={uploadImage}>
              <Image style={styles.editIcon} source={require('../../../assets/Images/Profile/edit.png')} />
          </TouchableOpacity>

        </ImageBackground>
      </View>

      <ProfileEdit />

      <MainBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    position: 'relative',
    paddingBottom: 35,
    backgroundColor: '#F5F5F5',
  },
  imageBg: {
    backgroundColor: "blue",
    height: '25%',
    width: '100%',
    resizeMode: 'cover',
  },
  img: {
    height: '100%',
    // aspectRatio: 1, 
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  iconContainer: {
    marginTop: '20%',
    paddingHorizontal: 5,
  },
  backIcon: {
    color: 'black',
    fontWeight: 'bold',
  },
  editIconContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: screenWidth * 0.125,
    width: screenWidth * 0.125,
    padding: screenWidth * 0.0125,
    borderRadius: screenWidth * 0.020,
    bottom: screenHeight * 0.01,
    right: screenWidth * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: screenWidth * 0.075,
    width: screenWidth * 0.075,
  }
});

export default ProfileEditIndex;
