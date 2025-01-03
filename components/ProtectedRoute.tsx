// // components/ProtectedRoute.js
// import React from 'react';
// import { View, Text } from 'react-native';
// import useAuthStore from '../store/authStore';

// export const ProtectedRoute = ({ children, requireAdmin }) => {
//   const { user, isAdmin, loading } = useAuthStore();
  
//   if (loading) {
//     return <View><Text>Loading...</Text></View>;
//   }
  
//   if (!user) {
//     return <LoginScreen />;
//   }
  
//   if (requireAdmin && !isAdmin) {
//     return <View><Text>Unauthorized: Admin access required</Text></View>;
//   }
  
//   return children;
// };
