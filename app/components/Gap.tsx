import React from 'react';
import { View } from 'react-native';
import { xxsGap, xsGap, smGap, mdGap, lgGap, xlGap } from '../shared/GlobalStyles';

const Gap: React.FC<{
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
    }
  };

  return <View style={{ width: getGap(), height: getGap() }}></View>;
};

export default Gap;
