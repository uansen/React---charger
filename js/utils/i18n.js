const i18n = {};
const languageEn = require('../localization/en_us.json');
const languageCn = require('../localization/zh_cn.json');
const deviceLocale = require('react-native').NativeModules.RNI18n.locale;

function setLanguage(language) {
  const languageDecorator = language.toLowerCase().replace('-', '_');
  let currentLanguage = 'en';
  if (languageDecorator.indexOf('cn') >= 0) {
    currentLanguage = 'cn';
    Object.assign(i18n, languageCn);
  } else if (languageDecorator.indexOf('en') >= 0) {
    currentLanguage = 'en';
    Object.assign(i18n, languageEn);
  } else {
    Object.assign(i18n, languageEn);
  }

  i18n.currentLanguage = () => currentLanguage;


  /**
   * 带通配符的字符串，调用 i18n.get('DIALOG_DATE','William');
   * @param  {String} key 字符串索引
   * 可变参数，为${0}, ${1} ...的替换字符串
   * @return {String}
   */
  i18n.get = function (key, ...values) {
    let strTemplate = i18n[key] || key;
    if (values.length > 0){
      for (let i = 0; i < values.length; i++){
        const arg = values[i];
        strTemplate = strTemplate.replace('${' + i + '}', arg);
      }
    }
    return strTemplate;
  };
}

setLanguage(deviceLocale);

export default i18n;
