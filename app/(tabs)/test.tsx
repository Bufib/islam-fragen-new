import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  useQADatabase,
  QuestionAnswerPerMarjaType,
  QuestionOneAnswerType,
  AllTableNamesType,
} from "@/hooks/useDatabase";

function RechtsfragenScreen() {
  const { getTablesByCategory, getQuestionsForTable, loading } =
    useQADatabase();
  const [tables, setTables] = useState<AllTableNamesType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionAnswerPerMarjaType[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      const tableData = await getTablesByCategory("Rechtsfragen");
      if (tableData) {
        setTables(tableData);
      }
    };
    loadTables();
  }, []);

  const handleTableSelect = async (tableName: string) => {
    setSelectedTable(tableName);
    const questionData = await getQuestionsForTable(tableName, "Rechtsfragen");
    if (questionData) {
      setQuestions(questionData as any[]);
    }
  };
  if (loading) {
    console.log("loading");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {tables.map((table) => (
        <TouchableOpacity
          key={table.id}
          onPress={() => handleTableSelect(table.tableName)}
        >
          <Text>{table.tableName}</Text>
        </TouchableOpacity>
      ))}

      {selectedTable && (
        <View>
          {questions.map((qa) => (
            <View key={qa.id}>
              <Text>{qa.question}</Text>
              <Text>Sistani: {qa.answer_sistani}</Text>
              <Text>Khamenei: {qa.answer_khamenei}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
export default RechtsfragenScreen;
