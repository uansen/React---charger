import * as reactRedux from 'react-redux';

export function connect(mapStateToProps) { // eslint-disable-line
  const func = reactRedux.connect(mapStateToProps, null, null, {withRef: true});
  return function(component){ // eslint-disable-line
    return func(component);
  };
}
