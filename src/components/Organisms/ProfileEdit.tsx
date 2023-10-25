import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StatusBar, StyleSheet, Text, TextInput } from 'react-native';
import { View } from 'react-native';
import * as yup from 'yup';
import { Field, Formik } from 'formik';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reduxToolkit/Store';
import { get_from_localStorage } from '../../utils/Functions/Get';
import { useChangePasswordMutation, useChangeProfileMutation } from '../../reduxToolkit/Services/auth'
import { loginSuccess } from '../../reduxToolkit/Features/auth/authSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { useGetRegionsMutation } from '../../reduxToolkit/Services/region';
import { useGetGradeMutation } from '../../reduxToolkit/Services/grade';
import { userType } from '../../types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const ProfileEdit: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user: userType = useSelector((state: RootState) => state.auth.user);
  const [fullName, setFullName] = useState((user.firstName || '') + ' ' + (user.lastName || ''));
  const [phone, setPhone] = useState(user.phoneNumber ?? '');
  const [grade, setGrade] = useState(user.grade?.grade ?? '');
  const [city, setCity] = useState(user.region?.region ?? '');
  const [showPassword, setShowPassword] = useState(true);
  const [updateProfile, { isLoading }] = useChangeProfileMutation();
  const [updatePassword,] = useChangePasswordMutation();
  const [getRegions] = useGetRegionsMutation();
  const [getGrade] = useGetGradeMutation();
  const [rigionOptions, setRegionOptions] = useState([]);
  const [gradeOptions, setgradeOptions] = useState([]);
  console.log(JSON.stringify(rigionOptions));


  console.log("user", user)
  const handleUpIconPress = () => {
    const currentIndex = gradeOptions.indexOf(grade);
    const newIndex = (currentIndex + 1) % gradeOptions.length;
    setGrade(gradeOptions[newIndex]);
  };

  const handleDownIconPress = () => {
    const currentIndex = gradeOptions.indexOf(grade);
    const newIndex = (currentIndex - 1) % gradeOptions.length;
    setGrade(gradeOptions[newIndex]);

  };
  const handleUpIconPressforRigion = (city) => {
    const currentIndex = rigionOptions.findIndex((option) => option.value === city);
    const newIndex = (currentIndex + 1) % rigionOptions.length;
    setCity(rigionOptions[newIndex].value);
  };

  const handleDownIconPressforRigion = () => {
    const currentIndex = rigionOptions.findIndex((option) => option.value === city);
    const newIndex = (currentIndex - 1 + rigionOptions.length) % rigionOptions.length;
    setCity(rigionOptions[newIndex].value);

  };

  const handleUpdateProfile = async () => {
    const tokenResult = await get_from_localStorage('token');
    if (tokenResult.status && tokenResult.value) {
      const token = tokenResult.value;
      const [firstName, lastName] = fullName.split(' ');
      console.log("fullname..............", fullName)
      const profileData = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        grade: grade,
        gender: user.gender ?? '',
        region: city,
      };

      try {
        const result = await updateProfile({ token, profileData });
        if (result.data.user) {
          dispatch(
            loginSuccess({
              user: result.data.user,
              token: token,
            }),
          )
        }
        console.log("updated result", result);

        Toast.show({
          type: 'success',
          text1: 'success',
          text2: 'Profile updated successfuly',
          visibilityTime: 4000
        });
        // setName('')
        setFullName('')
        setPhone('')
        setGrade('')
        setCity('')
      } catch (error) {
        await Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'Something went wrong'
        });
        console.error(error);
      }
    }
  };
  //password schema
  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character',
      ),
    newPassword: yup
      .string()
      .required('New password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character',
      ),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  });

  const handleSubmitPassword = async (values) => {

    if (values.newPassword === values.confirmPassword) {

      try {
        const tokenResult = await get_from_localStorage('token');
        if (tokenResult.status && tokenResult.value) {
          const token = tokenResult.value;
          const response = await updatePassword({
            currentPassword: values.password,
            newPassword: values.newPassword,
            token,
          });
          await Toast.show({
            type: 'success',
            text1: 'success',
            text2: 'Password updated successfuly',
            visibilityTime: 4000
          });

          // Handle the response accordingly
          console.log('Password changed successfully', response)
          console.log('Password changed successfully');
        }
      } catch (error) {
        await Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: 'Something went wrong'
        });
        console.error(error);
      }

    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegions();
        console.log("region", response.data)
        const tempRegionsList: { label: string; value: string; }[] = [];
        console.log(tempRegionsList)
        response.data.map((region: { region: string }) => {
          tempRegionsList.push({
            label: region.region.toUpperCase(),
            value: region.region
          });
        });

        setRegionOptions([...tempRegionsList]);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    const fetchGradeData = async () => {
      try {
        const response = await getGrade();
        // const fetchedGrade = data;
        console.log("grade", response.data)
        const tempRegionsList: { label: string; }[] = [];
        console.log(tempRegionsList)
        response.data.map((grade: { grade: string }) => {
          return tempRegionsList.push(
            grade.grade
          );
        });

        setgradeOptions([...tempRegionsList]);
        if (grade) return setGrade(tempRegionsList[0])
        console.log(JSON.stringify(tempRegionsList))
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchData()
    fetchGradeData(); // Call the fetch function
  }, [])
  const ProfileSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    grade: yup.string().required('Grade is required'),
    city: yup.string().required('City is required'),
  });
  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* back Icon and DoneTExt Container */}
          <View style={styles.backIconandDoneTExtContainer}>
            <TouchableOpacity
              style={styles.iconContainer}
              touchSoundDisabled
              onPress={() => navigation.goBack()}>
              <AntDesign name="left" style={styles.backIcon} size={ms(24)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneContainer} onPress={handleUpdateProfile}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Update Forms */}
          <View style={styles.topFormContainer}>
            <Text style={styles.title}>My profile</Text>
            <TextInput
              style={styles.inputContiner}
              onChangeText={setFullName}
              value={fullName}
            />
            <View style={styles.commonTextFeildStyle}>
              <Text style={styles.prefixText}>+251</Text>
              <TextInput
                style={styles.inputContainer}
                onChangeText={setPhone}
                value={phone.replace('+251', '')}
                autoComplete="tel"
              />
            </View>

            <View style={styles.commonTextFeildStyle}>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: ms(18),
                  color: '#858585'
                }}
                value={grade}
                onChangeText={setGrade}
              />
              <View style={{ flexDirection: 'columen', gap: 1 }}>
                <TouchableOpacity onPress={handleUpIconPress}>
                  <Ionicons name="caret-up-outline" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownIconPress}>
                  <Ionicons name="caret-down-outline" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.commonTextFeildStyle}>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 18,
                  color: '#858585'
                }}
                value={city}
                onChangeText={setCity}
              />
              <View style={{ flexDirection: 'columen', gap: 1 }}>
                <TouchableOpacity onPress={handleUpIconPressforRigion}>
                  <Ionicons name="caret-up-outline" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownIconPressforRigion}>
                  <Ionicons name="caret-down-outline" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <Formik
            initialValues={{
              fullName: user.firstName || '',
              phoneNumber: user.phoneNumber || '',
              grade: user.grade?.grade || '',
              city: user.region?.region || '',
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <View>
                <TextInput
                  style={styles.inputContiner}
                  placeholder=" Enter Full Name"
                />
                {touched.fullName && errors.fullName && <Text>{errors.fullName}</Text>}

                <View style={styles.commonTextFeildStyle}>
                  <Text style={styles.prefixText}>+251</Text>
                  <TextInput
                    style={styles.inputContainer}
                    placeholder=" Enter Phone Number"
                    autoComplete="tel"
                  />
                </View>
                {touched.phoneNumber && errors.phoneNumber && <Text>{errors.phoneNumber}</Text>}

                <View style={styles.commonTextFeildStyle}>
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 18,
                      color: '#858585',
                    }}
                    value={grade}
                    onChangeText={setGrade}
                    placeholder='Enter Grade'
                  />
                  <View style={{ flexDirection: 'column', gap: 1 }}>
                    <TouchableOpacity onPress={handleUpIconPress}>
                      <Ionicons name="caret-up-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDownIconPress}>
                      <Ionicons name="caret-down-outline" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                {touched.grade && errors.grade && <Text style={styles.errorText}>{errors.grade}</Text>}

                <View style={styles.commonTextFeildStyle}>
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 18,
                      color: '#858585',
                    }}
                    // name="city"
                    placeholder='Enter Region'
                    value={city}
                    onChangeText={setCity}
                  />
                  <View style={{ flexDirection: 'column', gap: 1 }}>
                    <TouchableOpacity onPress={handleUpIconPressforRigion}>
                      <Ionicons name="caret-up-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDownIconPressforRigion}>
                      <Ionicons name="caret-down-outline" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                {touched.city && errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

                <Button onPress={handleSubmit} title="Update Profile" />
              </View>
            )}
          </Formik> */}

          {/* password update  */}
          <Formik
            initialValues={{ password: '', newPassword: '', confirmPassword: '' }}
            validationSchema={schema}
            onSubmit={handleSubmitPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.topFormContainer}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.title}>Update password</Text>
                  <View style={{ backgroundColor: "#2196F3", padding: 5, height: 25, width: 25, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                    <FontAwesome5 name='exclamation' size={15} style={{ transform: [{ rotate: '180deg' }], color: "white" }} />
                  </View>

                </View>

                <View style={styles.commonTextFeildStyle}>
                  <TextInput
                    style={{
                      flex: 1,
                    }}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="Current password"
                    secureTextEntry={showPassword}
                  />
                  {showPassword ? (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(false)}>
                      <Ionicons name="eye-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(true)}>
                      <Ionicons name="eye-off-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}


                <View style={styles.commonTextFeildStyle}>
                  <TextInput
                    style={{
                      flex: 1,
                    }}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    value={values.newPassword}
                    placeholder="New password"
                    secureTextEntry={showPassword}
                  />
                  {showPassword ? (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(false)}>
                      <Ionicons name="eye-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(true)}>
                      <Ionicons name="eye-off-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.newPassword && touched.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
                <View style={styles.commonTextFeildStyle}>
                  <TextInput
                    style={{
                      flex: 1,
                    }}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    placeholder="Confirm password"
                    secureTextEntry={showPassword}
                  />
                  {showPassword ? (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(false)}>
                      <Ionicons name="eye-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.smallBox}
                      touchSoundDisabled
                      onPress={() => setShowPassword(true)}>
                      <Ionicons name="eye-off-outline" size={28} color="#81afe6" />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <TouchableOpacity
                  style={[styles.inputContainer, styles.changePassword, { flexDirection: "row", marginHorizontal: 20, marginBottom: 20, alignItems: "center", justifyContent: "center", borderRadius: 10 }]}
                  onPress={handleSubmit}
                >

                  <Text style={styles.changePasswordText}>Change Password</Text>
                  <AntDesign name="right" style={{ color: "white" }} size={19} />
                </TouchableOpacity>
              </View>
            )}
          </Formik>

        </ScrollView>

      </View>
      <Toast />
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    top: '25%',
    height: '75%',
    width: '100%',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    paddingBottom: '25@vs', // Apply verticalScale function on 25
  },
  commonTextFeildStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '30@s', // Apply scale function on 30
    borderWidth: 1,
    marginVertical: '5@vs', // Apply verticalScale function on 5
    marginHorizontal: '20@s', // Apply scale function on 20
    borderRadius: 10,
    borderColor: '#abcef5',
    fontFamily: 'PoppinsRegular',
    backgroundColor: "white"
  },

  doneContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    // width: '90%',
    marginLeft: '5@s', // Apply scale function on 5
    marginTop: '10@vs', // Apply verticalScale function on 10
  },
  doneText: {
    color: '#1E90FF',
    fontSize: '20@ms', // Apply moderateScale function with resize factor of 0.5 on 20
    fontFamily: 'PoppinsRegular',

  },
  topFormContainer: {
    borderRadius: 10,
    paddingVertical: '1@vs', // Apply verticalScale function on 10
  },
  title: {
    color: '#858585',
    fontSize: '20@ms', // Apply moderateScale function with resize factor of 0.5 on 22
    fontFamily: 'PoppinsRegular',
    paddingHorizontal: '18@s', // Apply scale function on 18
  },
  inputContiner: {
    paddingHorizontal: '30@s', // Apply scale function on 30
    paddingVertical: '10@vs', // Apply verticalScale function on 10
    borderWidth: 1,
    marginVertical: '5@vs', // Apply verticalScale function on 5
    marginHorizontal: '20@s', // Apply scale function on 20
    borderRadius: '10@s',
    borderColor: '#abcef5',
    fontSize: '18@ms', // Apply moderateScale function with resize factor of 0.5 on 18
    color: '#858585',
    backgroundColor: "white"
  },
  changePassword: {
    backgroundColor: '#1E90FF',
  },
  changePasswordText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '18@ms', // Apply moderateScale function with resize factor of 0.5 on 18
    fontFamily: 'PoppinsRegular',
  },
  passwordHeader: {
    marginHorizontal: '10@s', // Apply scale function on 10
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  prefixContainer: {
    position: 'absolute',
    top: '35%',
    height: '67%',
    width: '100%',
    overflow: 'hidden',
    paddingBottom: '25@vs', // Apply verticalScale function on 25
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    marginRight: '5@s', // Apply scale function on 5
    fontSize: '16@ms', // Apply moderateScale function with resize factor of 0.5 on 16
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: '10@ms', // Apply moderateScale function with resize factor of 0.5 on 10
    fontSize: '18@ms', // Apply moderateScale function with resize factor of 0.5 on 18
    color: '#858585',
    flex: 1,
  },
  errorText: {
    fontSize: '15@ms', // Apply moderateScale function with resize factor of 0.5 on 15
    color: 'red',
    flex: 1,
  },
  smallBox: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20@ms', // Apply moderateScale function with resize factor of 0.5 on 20
    textAlign: 'center',
    color: '#b3b3b3',
  },
  iconContainer: {
    color: "black"
  },
  backIcon: {
    color: "black",
    fontSize: '28@ms', // Apply moderateScale function with resize factor of 0.5 on 28
    fontWeight: "bold"
  },
  backIconandDoneTExtContainer: {
    padding: '10@ms', // Apply moderateScale function with resize factor of 0.5 on 10
    marginHorizontal: '10@s', // Apply scale function on 10
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

});
export default ProfileEdit;
