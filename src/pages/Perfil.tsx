import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  margin-right: 10px;
  min-width: 150px;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
`;

const GreenButton = styled(StyledButton)`
  background-color: green;
  border-color: green;

  &:hover {
    background-color: darkgreen;
    border-color: darkgreen;
  }
`;

const YellowButton = styled(StyledButton)`
  background-color: yellow;
  color: black;
  border-color: yellow;

  &:hover {
    background-color: goldenrod;
    color: white;
    border-color: goldenrod;
  }
`;

const DogCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    object-fit: cover;
  }

  .card-body {
    padding: 1rem;
  }

  .card-title {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .card-text {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .status {
    font-weight: bold;
    color: ${(props) => (props.active ? 'green' : 'red')};
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-size: 2.2rem;
  color: #333;
`;

export default function Perfil() {
  const [userData, setUserData] = useState<any>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [caesGuia, setCaesGuia] = useState<any[]>([]);
  const [caesError, setCaesError] = useState<string>('');
  const navigate = useNavigate();

  const accountType = localStorage.getItem('accountType');

  useEffect(() => {
    fetchUserData();
    fetchCaesGuia();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessages(['Você precisa estar autenticado para ver seu perfil.']);
      return;
    }

    try {
      let response;
      if (accountType === 'INSTITUICAO') {
        response = await axios.get('http://localhost:5000/instituicoes/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.get('http://localhost:5000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUserData(response.data);
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      setErrorMessages(['Erro ao obter dados do usuário.']);
    }
  };

  const fetchCaesGuia = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCaesError('Você precisa estar autenticado para ver seus cães-guia.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/caes-guia/meus', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.length === 0) {
        setCaesError('Você ainda não possui cães-guia vinculados.');
      } else {
        setCaesGuia(response.data);
      }
    } catch (error: any) {
      if (error.response) {
        setCaesError(error.response.data.message || 'Erro ao obter cães-guia.');
      } else if (error.request) {
        setCaesError('Erro de conexão. Não foi possível obter os cães-guia.');
      } else {
        setCaesError('Erro desconhecido ao obter cães-guia.');
      }
      console.error('Erro ao obter cães-guia:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  const handleDeactivate = async (caoId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCaesError('Você precisa estar autenticado para inativar um cão-guia.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja inativar este cão-guia?')) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/caes-guia/inativar/${caoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCaesGuia();
    } catch (error: any) {
      console.error('Erro ao inativar cão-guia:', error);
      setCaesError(error.response?.data?.message || 'Erro ao inativar cão-guia.');
    }
  };

  if (errorMessages.length > 0) {
    return (
      <StyledContainer>
        {errorMessages.map((message, index) => (
          <p key={index} style={{ color: 'red' }}>
            {message}
          </p>
        ))}
      </StyledContainer>
    );
  }

  if (!userData) {
    return (
      <StyledContainer>
        <p>Carregando...</p>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Row>
        <Col md={12}>
          <Title>Perfil do Usuário</Title>
          <p>
            <strong>Nome/Razão Social:</strong> {userData.nome || userData.razao_social}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <StyledButton variant="danger" onClick={handleLogout}>
              Logout
            </StyledButton>

            {/* Exibir "Ver Minha Carteira" apenas se o tipo de conta NÃO for INSTITUICAO */}
            {accountType !== 'INSTITUICAO' && (
              <StyledButton variant="success" onClick={() => navigate('/carteira')}>
                Ver Minha Carteira
              </StyledButton>
            )}

            <StyledButton variant="primary" onClick={() => navigate('/')}>
              Voltar para Home
            </StyledButton>

            {/* Exibir o botão de Dashboard apenas se o tipo de conta for ADMIN */}
            {accountType === 'ADMIN' && (
              <YellowButton onClick={() => navigate('/admin-dashboard')}>
                Ir para o Dashboard
              </YellowButton>
            )}
          </div>
        </Col>
      </Row>

      <hr />

      <Row className="mt-4">
        <Col>
          <h2 style={{ textAlign: 'center' }}>Meus Cães-Guia</h2>
          {caesError && <p style={{ color: 'red', textAlign: 'center' }}>{caesError}</p>}
          {caesGuia.length === 0 && !caesError ? (
            <p style={{ textAlign: 'center' }}>Você não possui cães-guia vinculados.</p>
          ) : (
            <Row>
              {caesGuia.map((cao) => (
                <Col md={4} key={cao.id} className="mb-4">
                  <DogCard active={cao.ativo ? 1 : 0}>
                    {cao.imagem && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000/uploads/${cao.imagem}`}
                        alt={`Foto de ${cao.nome}`}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{cao.nome}</Card.Title>
                      <Card.Text>
                        <strong>Sexo:</strong> {cao.sexo === 'masc' ? 'Macho' : 'Fêmea'}
                        <br />
                        <strong>Cor:</strong> {cao.cor}
                        <br />
                        <strong>Raça:</strong> {cao.raca}
                        <br />
                        <strong>Data de Nascimento:</strong>{' '}
                        {new Date(cao.data_nascimento).toLocaleDateString('pt-BR')}
                        <br />
                        <strong>Número de Registro:</strong> {cao.numero_registro}
                        <br />
                        <span className="status">
                          <strong>Status:</strong> {cao.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </Card.Text>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/editar-cao/${cao.id}`)}
                          className="me-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant={cao.ativo ? 'warning' : 'success'}
                          onClick={() => handleDeactivate(cao.id)}
                        >
                          {cao.ativo ? 'Inativar' : 'Ativar'}
                        </Button>
                      </div>
                    </Card.Body>
                  </DogCard>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </StyledContainer>
  );
}
