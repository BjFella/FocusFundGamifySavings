import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Stack = createStackNavigator();
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Home" 
            component={Index} 
          />
          <Stack.Screen 
            name="NotFound" 
            component={NotFound} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;