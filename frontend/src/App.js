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
    const { startDate, endDate } = this.state;
  
    // Fazer a solicitação para a API de backend
    axios
      .get('http://localhost:8080/api/v1/transfers/periodo', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
        },
      })
      .then((response) => {
        // Manipular a resposta do backend aqui
        const transferencias = response.data; // Supondo que a resposta é um array de objetos Transferencia
        console.log(transferencias);
        // Use os dados das transferências conforme necessário
      })
      .catch((error) => {
        // Manipular os erros aqui
        console.error(error);
      });
  };
  
  handleSearchByOperator = () => {
    const { operatorName } = this.state;
  
    // Fazer a solicitação para a API de backend
    axios
      .get('http://localhost:8080/api/v1/transfers/operador', {
        params: {
          nomeOperador: operatorName,
        },
      })
      .then((response) => {
        // Manipular a resposta do backend aqui
        const transferencias = response.data; // Supondo que a resposta é um array de objetos Transferencia
        console.log(transferencias);
        // Use os dados das transferências conforme necessário
      })
      .catch((error) => {
        // Manipular os erros aqui
        console.error(error);
      });
  };
  
  handleSearchByPeriodAndOperator = () => {
    const { startDate, endDate, operatorName } = this.state;
  
    // Fazer a solicitação para a API de backend
    axios
      .get('http://localhost:8080/api/v1/transfers/periodo-operador', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
          nomeOperador: operatorName,
        },
      })
      .then((response) => {
        // Manipular a resposta do backend aqui
        const transferencias = response.data; // Supondo que a resposta é um array de objetos Transferencia
        console.log(transferencias);
        // Use os dados das transferências conforme necessário
      })
      .catch((error) => {
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