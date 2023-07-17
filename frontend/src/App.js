import React, { Component } from 'react';
import logo from './logo.svg';
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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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

    // Adicionar texto do seu aplicativo
    const appText = 'Supera Bank Application';
    const appTextSize = 20;
    const appTextX = 10;
    const appTextY = 10;

    doc.setFontSize(appTextSize);
    doc.text(appText, appTextX, appTextY);

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
    doc.text(`Saldo Total: ${saldoTotal} R$`, 5, doc.lastAutoTable.finalY + 10);
    doc.text(`Saldo no Período: ${saldoPeriodo} R$`, 5, doc.lastAutoTable.finalY + 20);

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

  handleStartDateChange = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    this.setState({
      startDate: formattedDate,
    });
  };

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
    } else if (startDate && endDate && operatorName) {
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
    }
    else if (operatorName) {
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
    }

    else if (startDate && endDate && operatorName) {
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
    }
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
            <nav className="navbar">
              <img src={logo} alt="Logo" className="navbar-logo" />
              <a href="http://localhost:3000/" className="logo" >Bank Dashboard</a>
            </nav>
          </header>

          <header className="projects">
            <div className="heros">
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
                  placeholder="dd/MM/yyyy"
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
                  placeholder="dd/MM/yyyy"
                />
              </div>

              <button onClick={this.handleSearch}>Pesquisar</button>

              <div className='bank'>
                <p>Saldo Total: {saldoTotal} R$</p>
                <p>Saldo no Período: {saldoPeriodo} R$</p>
              </div>
            </div>

          </header>
          <div classname="project">
            <div className="container">
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
                        <th>Nome do Operador</th>
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

            </div>
          </div>

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