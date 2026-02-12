import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#a3e535";
const BLACK = "#000";
const INACTIVE = "#555";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BLACK,
          borderTopColor: "#111",
          height: 65,
          marginBottom: 15,
        },
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "wallet":
              iconName = focused ? "wallet" : "wallet-outline";
              break;
            case "expenses":
              iconName = focused ? "cash" : "cash-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: "Wallet" }}
      />
      <Tabs.Screen
        name="expenses"
        options={{ title: "Expenses" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}
