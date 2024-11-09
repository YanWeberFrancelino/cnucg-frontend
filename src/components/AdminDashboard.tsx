import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Navbar,
  Nav,
  Dropdown,
  Spinner,
} from 'react-bootstrap';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
`;

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
`;

const ErrorMessage = styled(Alert)`
  font-weight: bold;
  text-align: center;
`;

const SuccessMessage = styled(Alert)`
  font-weight: bold;
  text-align: center;
`;

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [userStatus, setUserStatus] = useState('pendente');
  const [institutionStatus, setInstitutionStatus] = useState('pendente');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const accountType = localStorage.getItem('accountType');

    if (!token || accountType !== 'ADMIN') {
      navigate('/login');
    } else {
      fetchUsuarios();
      fetchInstituicoes();
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsuarios();
  }, [userStatus]);

  useEffect(() => {
    fetchInstituicoes();
  }, [institutionStatus]);

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/validacoes/listar/usuarios/${userStatus}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsuarios(response.data);
      setLoadingUsers(false);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setErrorMessages(['Erro ao buscar usuários.']);
      setLoadingUsers(false);
    }
  };

  const fetchInstituicoes = async () => {
    setLoadingInstitutions(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/validacoes/listar/instituicoes/${institutionStatus}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInstituicoes(response.data);
      setLoadingInstitutions(false);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      setErrorMessages(['Erro ao buscar instituições.']);
      setLoadingInstitutions(false);
    }
  };

  const updateUserStatus = async (id: number, status: string) => {
    try {
      const motivo_rejeicao =
        status === 'rejeitado' ? prompt('Motivo da rejeição:') : null;
      await axios.post(
        `http://localhost:5000/validacoes/validar-usuario/${id}`,
        { status, motivo_rejeicao },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage('Status do usuário atualizado com sucesso.');
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      setErrorMessages(['Erro ao atualizar status do usuário.']);
    }
  };

  const updateInstitutionStatus = async (id: number, status: string) => {
    try {
      const motivo_rejeicao =
        status === 'rejeitado' ? prompt('Motivo da rejeição:') : null;
      await axios.post(
        `http://localhost:5000/validacoes/validar-instituicao/${id}`,
        { status, motivo_rejeicao },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage('Status da instituição atualizado com sucesso.');
      fetchInstituicoes();
    } catch (error) {
      console.error('Erro ao atualizar status da instituição:', error);
      setErrorMessages(['Erro ao atualizar status da instituição.']);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <StyledContainer>
        {successMessage && (
          <SuccessMessage
            variant="success"
            onClose={() => setSuccessMessage('')}
            dismissible
          >
            {successMessage}
          </SuccessMessage>
        )}

        {errorMessages.length > 0 && (
          <ErrorMessage
            variant="danger"
            onClose={() => setErrorMessages([])}
            dismissible
          >
            {errorMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </ErrorMessage>
        )}

        <Row>
          {/* Seção de Usuários */}
          <Col md={6}>
            <SectionTitle>Usuários</SectionTitle>
            <Form.Group controlId="filterUserStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value)}
              >
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="rejeitado">Rejeitados</option>
              </Form.Control>
            </Form.Group>
            {loadingUsers ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              usuarios.map((usuario: any) => (
                <StyledCard key={usuario.id}>
                  <Card.Body>
                    <Card.Title>{usuario.nome}</Card.Title>
                    <Card.Text>Email: {usuario.email}</Card.Text>
                    <Card.Text>Status: {usuario.status_validacao}</Card.Text>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Ações
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userStatus !== 'aprovado' && (
                          <Dropdown.Item
                            onClick={() => updateUserStatus(usuario.id, 'aprovado')}
                          >
                            Aprovar
                          </Dropdown.Item>
                        )}
                        {userStatus !== 'rejeitado' && (
                          <Dropdown.Item
                            onClick={() => updateUserStatus(usuario.id, 'rejeitado')}
                          >
                            Rejeitar
                          </Dropdown.Item>
                        )}
                        {userStatus !== 'pendente' && (
                          <Dropdown.Item
                            onClick={() => updateUserStatus(usuario.id, 'pendente')}
                          >
                            Colocar em Pendência
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Body>
                </StyledCard>
              ))
            )}
          </Col>

          {/* Seção de Instituições */}
          <Col md={6}>
            <SectionTitle>Instituições</SectionTitle>
            <Form.Group controlId="filterInstitutionStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={institutionStatus}
                onChange={(e) => setInstitutionStatus(e.target.value)}
              >
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovadas</option>
                <option value="rejeitado">Rejeitadas</option>
              </Form.Control>
            </Form.Group>
            {loadingInstitutions ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              instituicoes.map((instituicao: any) => (
                <StyledCard key={instituicao.id}>
                  <Card.Body>
                    <Card.Title>{instituicao.razao_social}</Card.Title>
                    <Card.Text>Email: {instituicao.email}</Card.Text>
                    <Card.Text>Status: {instituicao.status_validacao}</Card.Text>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Ações
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {institutionStatus !== 'aprovado' && (
                          <Dropdown.Item
                            onClick={() =>
                              updateInstitutionStatus(instituicao.id, 'aprovado')
                            }
                          >
                            Aprovar
                          </Dropdown.Item>
                        )}
                        {institutionStatus !== 'rejeitado' && (
                          <Dropdown.Item
                            onClick={() =>
                              updateInstitutionStatus(instituicao.id, 'rejeitado')
                            }
                          >
                            Rejeitar
                          </Dropdown.Item>
                        )}
                        {institutionStatus !== 'pendente' && (
                          <Dropdown.Item
                            onClick={() =>
                              updateInstitutionStatus(instituicao.id, 'pendente')
                            }
                          >
                            Colocar em Pendência
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Body>
                </StyledCard>
              ))
            )}
          </Col>
        </Row>
      </StyledContainer>
    </>
  );
}
