// // components/AuthProvider.js
// import React, { useEffect } from 'react';
// import useAuthStore from '../store/authStore';
// import { supabase } from '../supabaseClient';

// export const AuthProvider = ({ children }) => {
//   const initialize = useAuthStore((state) => state.initialize);
  
//   useEffect(() => {
//     initialize();
    
//     // Set up auth state change listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
//       initialize();
//     });
    
//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, []);
  
//   return children;
// };
