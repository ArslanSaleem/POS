import React from 'react';
import Colors from './ItemView';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Colors />);
});
