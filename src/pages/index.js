import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import '@/style/index.css';

class App extends Component {
  render() {
    return (
      <Layout>
        {/* <div className="App">
          <header className="App-header">
            Mongodb Electron
            <Link to="/connect">start connect</Link>
          </header>
        </div> */}
      </Layout>
    );
  }
}

export default App;
