// import { View, Text, StyleSheet } from "react-native";
// import React from "react";
// import { useLocalSearchParams } from "expo-router";
// import RenderCategories from "components/RenderCategories";
// import { Stack } from "expo-router";
// import useGetCategories from "components/useGetCategories";

// export default function RenderCategory() {
//   const { subCategory } = useLocalSearchParams<{ subCategory: string }>();
//   const {
//     fetchErrorSuperCategories,
//     subCategories = [], // Ensure subCategories is initialized as an empty array
//     isFetchingSub,
//   } = useGetCategories();

//   const encodeTable = (title: string) => {
//     const cleanTable = title.trim().replace(/\n/g, "");
//     return encodeURIComponent(cleanTable)
//       .replace(/\(/g, "%28")
//       .replace(/\)/g, "%29");
//   };

//   // Make sure subCategories is an array before using find method
//   const matchedTable = Array.isArray(subCategories)
//     ? subCategories.find((table) => table.tableName === subCategory)
//     : undefined;

//   const filteredItems = matchedTable ? matchedTable.questions : [];

//   return (
//     <View style={styles.container}>
//       {!subCategory ? (
//         <RenderCategories
//           items={[]}
//           fetchError={fetchErrorSuperCategories}
//           table=''
//           isFetching={isFetchingSub}
//         />
//       ) : (
//         <>
//           <Stack.Screen options={{ headerTitle: subCategory }} />
//           <RenderCategories
//             items={filteredItems}
//             fetchError={fetchErrorSuperCategories}
//             table={encodeTable(subCategory)}
//             isFetching={isFetchingSub}
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View>
      <Text>[getCategories]</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})