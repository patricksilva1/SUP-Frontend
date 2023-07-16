import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de log de erros aqui
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode retornar qualquer UI de fallback desejada
      return <h1>Algo deu errado. Por favor, tente novamente mais tarde.</h1>;
    }

    return this.props.children;
  }
}

class App extends React.Component {

  handlePrintTransfers = () => {
    const { transferencias, saldoTotal, saldoPeriodo } = this.state;
  
    // Criar um novo objeto jsPDF
    const doc = new jsPDF();
  
    // Definir o título e as colunas da tabela no PDF
    const tableColumns = ['Transferencia ID', 'Data de Transferência', 'Valor', 'Tipo', 'Nome do Operador - Destino'];
    const tableData = [];
  
    // Preencher os dados da tabela com as transferências
    transferencias.forEach((transferencia) => {
      const rowData = [
        transferencia.id,
        moment(transferencia.dataTransferencia).format('DD/MM/YYYY'),
        transferencia.valor,
        transferencia.tipo,
        transferencia.nomeOperadorTransacao || ''
      ];
      tableData.push(rowData);
    });
  
    // Adicionar a tabela ao PDF
    doc.autoTable(tableColumns, tableData);
  
    // Adicionar os campos de Saldo Total e Saldo no Período
    doc.text(`Saldo Total: ${saldoTotal} R$`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Saldo no Período: ${saldoPeriodo} R$`, 14, doc.lastAutoTable.finalY + 20);
  
    // Salvar o arquivo PDF
    doc.save('transferencias.pdf');
  };

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
      errorMessage: '', // Mensagem de erro
    };
  }

  // handleStartDateChange = (date) => {
  //   this.setState({
  //     startDate: date,
  //   });
  // };
  handleStartDateChange = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    this.setState({
      startDate: formattedDate,
    });
  };



  // handleEndDateChange = (date) => {
  //   this.setState({
  //     endDate: date,
  //   });
  // };
  handleEndDateChange = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    this.setState({
      endDate: formattedDate,
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
    const formattedStartDate = moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY');

    // Fazer a solicitação para a API de backend
    if (!operatorName && !startDate && !endDate) {
      axios
        .get('http://localhost:8080/api/v1/transfers', {
          params: {},
        })
        .then((response) => {
          const transferencias = response.data;
          console.log(transferencias);
          this.setState({ transferencias, errorMessage: '' });
        })
        .catch((error) => {
          console.error(error);
          // Exibir uma mensagem de erro ao usuário
          this.setState({ errorMessage: 'Ocorreu um erro ao buscar as transferências.' });
        });
    } else if (!operatorName) {
      axios
        .get('http://localhost:8080/api/v1/transfers/periodo', {
          params: {
            dataInicio: formattedStartDate,
            dataFim: formattedEndDate,
          },
        })
        .then((response) => {
          const transferencias = response.data;
          console.log(transferencias);
          this.setState({ transferencias, errorMessage: '' });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ errorMessage: 'Ocorreu um erro ao buscar as transferências por período.' });
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
          this.setState({ transferencias, errorMessage: '' });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ errorMessage: 'Ocorreu um erro ao buscar as transferências por operador.' });
        });
    }
    else {
      axios
        .get('http://localhost:8080/api/v1/transfers/periodo-operador', {
          params: {
            dataInicio: formattedStartDate,
            dataFim: formattedEndDate,
            nomeOperador: operatorName,
          },
        })
        .then((response) => {
          const transferencias = response.data;
          console.log(transferencias);
          this.setState({ transferencias, errorMessage: '' });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            errorMessage: 'Ocorreu um erro ao buscar as transferências por período e operador.',
          });
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
        this.setState({ saldoTotal, errorMessage: '' });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar o saldo total.' });
      });

    // Obter Saldo no Período por Nome
    axios
      .get('http://localhost:8080/api/v1/transfers/saldo-periodo', {
        params: {
          dataInicio: formattedStartDate,
          dataFim: formattedEndDate,
          nome: operatorName,
        },
      })
      .then((saldoPeriodoResponse) => {
        const saldoPeriodo = saldoPeriodoResponse.data;
        console.log(saldoPeriodo);
        this.setState({ saldoPeriodo, errorMessage: '' });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar o saldo do período.' });
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
        this.setState({ transferencias, errorMessage: '' });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar as transferências por operador.' });
      });
  };

  handleSearchByPeriodAndOperator = () => {
    const { startDate, endDate, operatorName } = this.state;
    const formattedStartDate = moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY');

    // Fazer a solicitação para a API de backend
    axios
      .get('http://localhost:8080/api/v1/transfers/periodo-operador', {
        params: {
          dataInicio: formattedStartDate,
          dataFim: formattedEndDate,
          nomeOperador: operatorName,
        },
      })
      .then((response) => {
        const transferencias = response.data;
        console.log(transferencias);
        this.setState({ transferencias, errorMessage: '' });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          errorMessage: 'Ocorreu um erro ao buscar as transferências por período e operador.',
        });
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
        this.setState({ transferencias, errorMessage: '' });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar as transferências paginadas.' });
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
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          errorMessage: 'Ocorreu um erro ao buscar as transações por período e nome.',
        });
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
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar o saldo total.' });
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
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: 'Ocorreu um erro ao buscar o saldo do período.' });
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
        this.setState({ errorMessage: 'Ocorreu um erro ao realizar o saque.' });
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
      <ErrorBoundary>


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
              {/* <input
                type="date"
                id="startDate"
                name="startDate"
                value={moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                onChange={this.handleStartDateChange}
                placeholder="dd/MM/yyyy"
              /> */}
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
              {/* <input
                type="date"
                id="endDate"
                name="endDate"
                value={moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                onChange={this.handleEndDateChange}
                placeholder="dd/MM/yyyy"
              /> */}
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
                    {Array.isArray(transferenciasPaginadas) ? (
                      transferenciasPaginadas.map((transferencia) => (
                        <tr key={transferencia.id}>
                          <td>{transferencia.id}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1">Nenhuma transferência encontrada.</td>
                      </tr>
                    )}
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
                    {Array.isArray(transferenciasPaginadas) ? (
                      transferenciasPaginadas.map((transferencia) => (
                        <tr key={transferencia.id}>
                          <td>{moment(transferencia.dataTransferencia).format('DD/MM/YYYY')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1">Nenhuma transferência encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tabela Valor */}
              <div className="table-column">
                <table className="table table-data-transfer">
                  <thead>
                    <tr>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(transferenciasPaginadas) ? (
                      transferenciasPaginadas.map((transferencia) => (
                        <tr key={transferencia.id}>
                          <td>{transferencia.valor}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1">Nenhuma transferência encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tabela Tipo */}
              <div className="table-column">
                <table className="table table-data-transfer">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(transferenciasPaginadas) ? (
                      transferenciasPaginadas.map((transferencia) => (
                        <tr key={transferencia.id}>
                          <td>{transferencia.tipo}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1">Nenhuma transferência encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tabela Nome do Operador */}
              <div className="table-column">
                <table className="table table-data-transfer">
                  <thead>
                    <tr>
                      <th>Nome do Operador - Destino</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(transferenciasPaginadas) ? (
                      transferenciasPaginadas.map((transferencia) => (
                        <tr key={transferencia.id}>
                          <td className={transferencia.nomeOperadorTransacao ? '' : 'empty-cell'}>
                            {transferencia.nomeOperadorTransacao}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1">Nenhuma transferência encontrada.</td>
                      </tr>
                    )}
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
        <div className="App">
          <header className="App-header">
            {/* ... */}
            <button onClick={this.handlePrintTransfers}>Imprimir Transferências</button>
            {/* ... */}
          </header>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;