import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigation';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <View className="flex-1  justify-around ">
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(10)}}
          className="text-center  font-bold text-gray-700">
          Jarvis
        </Text>
        <Text
          style={{fontSize: wp(4)}}
          className="text-center font-semibold text-gray-600 tracking-widest">
          The Future is here, powered by AI.
        </Text>
      </View>
      <View className="items-center">
        <Image
          source={require('../assets/images/robot-assistant.png')}
          style={{width: wp(70), height: hp(35)}}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="bg-emerald-600 mx-5 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center text-white font-bold">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
