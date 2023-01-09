import React from 'react';
import { View } from 'react-native';
import { xxsGap, xsGap, smGap, mdGap, lgGap, xlGap, xxlGap } from '../shared/GlobalStyles';

const Gap: React.FC<{
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}> = ({ size = 'xs' }) => {
  const getGap = (): number => {
    switch (size) {
      case 'xxs':
        return xxsGap;
      case 'xs':
        return xsGap;
      case 'sm':
        return smGap;
      case 'md':
        return mdGap;
      case 'lg':
        return lgGap;
      case 'xl':
        return xlGap;
      case 'xxl':
        return xxlGap;
      default:
        throw new Error(`Unknown gap size: ${size}`);
    }
  };

  return <View style={{ width: getGap(), height: getGap() }}></View>;
};

export default Gap;
