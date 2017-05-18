
import { createIconSet } from 'react-native-vector-icons';

const glyphMap = {
  "icon_icon25": 59681,
  "icon_icon23": 59679,
  "icon_icon24": 59680,
  "icon_iconfont-03": 59651,
  "icon_icon22": 59678
};

let ChargerIconTwo = createIconSet(glyphMap, 'HMI', 'Charging.ttf');

module.exports = ChargerIconTwo;
module.exports.glyphMap = glyphMap;

