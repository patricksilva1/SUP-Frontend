import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      operatorName: '',
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  };

  handleSearch = () => {
    const { startDate, endDate, operatorName } = this.state;

    // Fazer a solicitação para a API de backend
    axios.get('http://localhost:9093/api/v1', {
      params: {
        startDate,
        endDate,
        operatorName
      }
    })
      .then(response => {
        // Manipular a resposta do backend aqui
        const tabelaValores = response.data; // Supondo que a resposta é um JSON com os valores da tabela correspondentes aos filtros
        console.log(tabelaValores);
        // Use os valores da tabela conforme necessário
      })
      .catch(error => {
        // Manipular os erros aqui
        console.error(error);
      });
  };

  render() {
    const { startDate, endDate, operatorName } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Banco Dashboard</h1>
          <div>
            <label htmlFor="startDate">Data de Início:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="endDate">Data de Fim:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="operatorName">Nome do Operador:</label>
            <input
              type="text"
              id="operatorName"
              name="operatorName"
              value={operatorName}
              onChange={this.handleInputChange}
            />
          </div>
          <button onClick={this.handleSearch}>Pesquisar</button>
        </header>
      </div>
    );
  }
}

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;import React from 'react';