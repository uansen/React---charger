
import { createIconSet } from 'react-native-vector-icons';

const glyphMap = {
  "icon_iconfont-01": 59648,
  "icon_iconfont-02": 59649,
  "icon_iconfont-03": 59650,
  "icon_iconfont-04": 59651,
  "icon_iconfont-05": 59652,
  "icon_iconfont-06": 59653,
  "icon_iconfont-07": 59654,
  "icon_iconfont-08": 59655,
  "icon_iconfont-09": 59656,
  "icon_iconfont-10": 59657,
  "icon_iconfont-11": 59658,
  "icon_iconfont-12": 59659,
  "icon_iconfont-13": 59660,
  "icon_iconfont-14": 59661,
  "icon_iconfont-15": 59662,
  "icon_iconfont-16": 59663,
  "icon_iconfont-17": 59664,
  "icon_iconfont-18": 59665,
  "icon_iconfont-19": 59666,
  "icon_iconfont-20": 59667,
  "icon_iconfont-21": 59668
};

let ChargerIcon = createIconSet(glyphMap, 'EV_Charging', 'EV_Charging.ttf');

module.exports = ChargerIcon;
module.exports.glyphMap = glyphMap;

