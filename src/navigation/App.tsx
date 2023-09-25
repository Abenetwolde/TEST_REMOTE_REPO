import React from 'react';
import {StackType} from './types';
import Onboarding from '../screens/App/Onboarding/index';
import Home from '../screens/App/Home/index';
import Courses from '../screens/App/Courses/index';
import Profile from '../screens/App/Profile/index';
import ViewSubjectDetails from '../screens/App/Courses/components/Pages/ViewSubjectDetails';
import ViewCourseContent from '../screens/App/Courses/components/Pages/ViewCourseContent';
import ProfileEditIndex from '../screens/App/Profile/ProfileEditIndex';

const AppRoutes: React.FC<StackType> = ({Stack}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Courses"
        component={Courses}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="View-Course"
        component={ViewSubjectDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="View-Course-Content"
        component={ViewCourseContent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile-Edit"
        component={ProfileEditIndex}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppRoutes;
