import React from 'react';
import Bundle from '../components/Bundle';
import Main from 'bundle-loader?name=entry!../components/Main';

export default (props) => (
    <Bundle load={Main}>
        { (Container) => <Container {...props} /> }
    </Bundle>
);
