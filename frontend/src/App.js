import React from 'react';
import axios from 'axios';
import moment from 'moment';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      operatorName: '',
      transferencias: [],
      currentPage: 0, // Página atual
      pageSize: 10, // Tamanho da página (limite de transferências por página)
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
    const { operatorName} = this.state;

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

  handleGetTransferenciasPaginadas = (pagina, tamanhoPagina) => {
    axios
      .get('http://localhost:8080/api/v1/transfers/paginadas', {
        params: {
          pagina,
          tamanhoPagina,
        },
      })
      .then((response) => {
        const transferencias = response.data;
        console.log(transferencias);
        this.setState({ transferencias });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      // Chamar o método de pesquisa apropriado com base no tipo atual de pesquisa
      const { selectedSearchType } = this.state;
      if (selectedSearchType === 'periodo') {
        this.handleSearch();
      } else if (selectedSearchType === 'operador') {
        this.handleSearchByOperator();
      } else if (selectedSearchType === 'periodoOperador') {
        this.handleSearchByPeriodAndOperator();
      }
    });
  };

  render() {
    const { startDate, endDate, operatorName, transferencias, currentPage, pageSize } = this.state;

    // Calcular o número total de páginas com base no número total de transferências
    const totalPages = Math.ceil(transferencias.length / pageSize);

    // Calcular o índice inicial e final das transferências exibidas na página atual
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, transferencias.length);

    // Filtrar as transferências com base no índice inicial e final
    const transferenciasPaginadas = transferencias.slice(startIndex, endIndex);

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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
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
                  {transferenciasPaginadas.map((transferencia) => (
                    <tr key={transferencia.id}>
                      <td>{transferencia.contaDestino}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pagination">

          <button
              onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ⮜⮜
            </button> 

            <button
              onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ⮜
            </button>

                       {/* Exibir informações da página */}
                <p>
                  Página: {currentPage + 1} de {totalPages}
                </p>

            <button
              onClick={() => this.handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              ➤
            </button>

            <button
              onClick={() => this.handlePageChange(currentPage + 2)}
              disabled={currentPage === totalPages - 1}
            >
              ➤➤
            </button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;