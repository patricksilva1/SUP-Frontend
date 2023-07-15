import React from 'react';
import axios from 'axios';
// import { format } from 'date-fns';
import moment from 'moment';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null, // null em vez de uma string vazia
      endDate: null, // null em vez de uma string vazia
      operatorName: '',
      transferencias: [], // Adicionamos um novo estado para armazenar as transferências
    };
  }

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date,
    });
  };
  
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

        // Atualizar o estado com as transferências recebidas
        this.setState({ transferencias });
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
  
 // ...

render() {
  const { startDate, endDate, operatorName, transferencias } = this.state;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Patrick's Bank Dashboard</h1>
        {/* ...outros elementos do cabeçalho... */}
        <div>
          <label htmlFor="startDate">Data de Início:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={this.handleInputChange}
            placeholder="dd/MM/yyyy" // Adicione o placeholder formatado desejado
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
              placeholder="dd/MM/yyyy" // Adicione o placeholder formatado desejado
            />
        </div>
        <div>
          <label htmlFor="operatorName">Nome Operador Transacionado:</label>
          <input
            type="text"
            id="operatorName"
            name="operatorName"
            value={operatorName}
            onChange={this.handleInputChange}
          />
        </div>
        <button onClick={this.handleSearch}>Pesquisar</button>

{/* Renderização das tabelas */}
<div className="table-container">
  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Transferencia ID</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Data de Transferência</th>
        </tr>
      </thead>
      <tbody>
      {transferencias.map((transferencia) => (
            <tr key={transferencia.id}>
              <td>{moment(transferencia.dataTransferencia).format('DD/MM/YYYY')}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.tipo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Nome do Operador</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.nomeOperadorTransacao}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Saldo Atual</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.saldoAtual}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-column">
  <table className="table table-data-transfer">
      <thead>
        <tr>
          <th>Conta Destino</th>
        </tr>
      </thead>
      <tbody>
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id}>
            <td>{transferencia.contaDestino}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      </header>
    </div>
  );
}

// ...

}

export default App;