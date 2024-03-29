import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Features = () => {
  return (
    <View className="gap-4">
      <Text style={{fontSize: wp(6)}} className="font-semibold text-gray-700">
        Features
      </Text>
      <View className="bg-emerald-200 p-3 rounded-xl space-y-2">
        <View className="flex-row items-center gap-1">
          <Image
            source={require('../assets/images/chatgpt-icon.png')}
            style={{width: wp(10), height: hp(5)}}
          />
          <Text
            style={{fontSize: wp(5)}}
            className="font-semibold text-gray-700">
            ChatGPT
          </Text>
        </View>
        <Text style={{fontSize: wp(4)}} className="text-gray-700 font-medium">
          ChatGPT can provide you with instant and knowledgeable responses,
          assist you with creative ideas on a wide range of topics.
        </Text>
      </View>
      <View className="bg-purple-200 p-3 rounded-xl space-y-2">
        <View className="flex-row items-center gap-1">
          <Image
            source={require('../assets/images/DALL-E-icon.png')}
            style={{width: wp(10), height: hp(5)}}
          />
          <Text
            style={{fontSize: wp(5)}}
            className="font-semibold text-gray-700">
            DALL-E
          </Text>
        </View>
        <Text style={{fontSize: wp(4)}} className="text-gray-700 font-medium">
          DALL-E can generate imaginative and diverse images from textual
          descriptions, expanding the boundaries of visual creativity.
        </Text>
      </View>
      <View className="bg-cyan-200 p-3 rounded-xl space-y-2">
        <View className="flex-row items-center gap-1">
          <Image
            source={require('../assets/images/ai-brain-logo.png')}
            style={{width: wp(10), height: hp(5)}}
          />
          <Text
            style={{fontSize: wp(5)}}
            className="font-semibold text-gray-700">
            Smart Al
          </Text>
        </View>
        <Text style={{fontSize: wp(4)}} className="text-gray-700 font-medium">
          A powerful voice assistant with the abilities of ChatGPT and Dall-E,
          providing you the best of both worlds.
        </Text>
      </View>
    </View>
  );
};

export default Features;
