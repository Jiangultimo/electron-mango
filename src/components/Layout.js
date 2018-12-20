import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config'
import '@/style/layout.css'

class Layout extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}

export default Layout;