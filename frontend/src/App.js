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
      saldoTotal: 0, // Saldo total
      saldoPeriodo: 0, // Saldo no período
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
    const { startDate, endDate, operatorName } = this.state;

    // Fazer a solicitação para a API de backend
    if (!operatorName && !startDate && !endDate) {
      axios
        .get('http://localhost:8080/api/v1/transfers', {
          params: {},
        })
        .then((response) => {
          const transferencias = response.data;
          console.log(transferencias);
          this.setState({ transferencias });
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (!operatorName) {
      axios
        .get('http://localhost:8080/api/v1/transfers/periodo', {
          params: {
            dataInicio: startDate,
            dataFim: endDate,
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
    } else if (!startDate || !endDate) {
      axios
        .get('http://localhost:8080/api/v1/transfers/operador', {
          params: {
            nomeOperador: operatorName,
          },
        })
        .then((response) => {
          const transferencias = response.data;
          console.log(transferencias);
          this.setState({ transferencias });
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Nome do operador não encontrado, não faz nenhuma alteração na tela
            console.log('Nome do operador não encontrado');
          } else {
            console.error(error);
          }
        });
    }
    else {
      axios
        .get('http://localhost:8080/api/v1/transfers/periodo-operador', {
          params: {
            dataInicio: startDate,
            dataFim: endDate,
            nomeOperador: operatorName,
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

    }

    // Obter Saldo Total por Nome
    axios
      .get('http://localhost:8080/api/v1/transfers/saldo-total', {
        params: {
          nome: operatorName,
        },
      })
      .then((saldoTotalResponse) => {
        const saldoTotal = saldoTotalResponse.data;
        console.log(saldoTotal);
        this.setState({ saldoTotal });
      })
      .catch((error) => {
        console.error(error);
      });

    // Obter Saldo no Período por Nome
    axios
      .get('http://localhost:8080/api/v1/transfers/saldo-periodo', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
          nome: operatorName,
        },
      })
      .then((saldoPeriodoResponse) => {
        const saldoPeriodo = saldoPeriodoResponse.data;
        console.log(saldoPeriodo);
        this.setState({ saldoPeriodo });
      })
      .catch((error) => {
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
        const transferencias = response.data;
        console.log(transferencias);
        this.setState({ transferencias });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // Nome do operador não encontrado, não faz nenhuma alteração na tela
          console.log('Nome do operador não encontrado');
        } else {
          console.error(error);
        }
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



  // a****************************************************************

  handleSearchTransactionsByPeriodAndName = () => {
    const { startDate, endDate, operatorName } = this.state;

    axios
      .get('http://localhost:8080/api/v1/transfers/transacoes', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
          nome: operatorName,
        },
      })
      .then((response) => {
        const transacoes = response.data;
        console.log(transacoes);
        // Use os dados das transações conforme necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleGetTotalBalanceByName = () => {
    const { operatorName } = this.state;

    axios
      .get('http://localhost:8080/api/v1/transfers/saldo-total', {
        params: {
          nome: operatorName,
        },
      })
      .then((response) => {
        const saldoTotal = response.data;
        console.log(saldoTotal);
        // Use o saldo total conforme necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };
  handleGetBalanceDuringPeriodByName = () => {
    const { startDate, endDate, operatorName } = this.state;

    axios
      .get('http://localhost:8080/api/v1/transfers/saldo-periodo', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
          nome: operatorName,
        },
      })
      .then((response) => {
        const saldoPeriodo = response.data;
        console.log(saldoPeriodo);
        // Use o saldo do período conforme necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleWithdraw = (idConta, valor) => {
    axios
      .post(`http://localhost:8080/api/v1/transfers/${idConta}/saque`, null, {
        params: {
          valor,
        },
      })
      .then((response) => {
        console.log('Saque realizado com sucesso');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // a****************************************************************

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
    const { startDate, endDate, operatorName, transferencias, currentPage, pageSize, saldoTotal, saldoPeriodo } = this.state;

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
          <h1>Bank Dashboard</h1>
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

          <div>
            <label htmlFor="startDate">Data de Início:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={this.handleInputChange}
              placeholder="dd/MM/yyyy" // Placeholder formatado
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
              placeholder="dd/MM/yyyy" // Placeholder Formatado
            />
          </div>

          <button onClick={this.handleSearch}>Pesquisar</button>

          <div className='bank'>
            <p>Saldo Total: {saldoTotal} R$</p>
            <p>Saldo no Período: {saldoPeriodo} R$</p>
          </div>

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
                      {/* <td>{transferencia.nomeOperadorTransacao}</td> */}
                      <td className={transferencia.nomeOperadorTransacao ? '' : 'empty-cell'}>
                        {transferencia.nomeOperadorTransacao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <div className="table-column">
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
            </div> */}

            {/* <div className="table-column">
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
            </div> */}
          </div>

          <div className="pagination">

            <button onClick={() => this.handlePageChange(currentPage - 2)}
              disabled={currentPage <= 1}>
              ⮜⮜
            </button>

            <button onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}>
              ⮜
            </button>

            {/* Exibir informações da página */}
            <p>
              Página: {currentPage + 1} de {totalPages}
            </p>

            <button onClick={() => this.handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}>
              ➤
            </button>

            <button onClick={() => this.handlePageChange(currentPage + 2)}
              disabled={currentPage >= totalPages - 2}>
              ➤➤
            </button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;