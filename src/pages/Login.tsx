import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const SubTitle = styled.h4`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #666;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [accountType, setAccountType] = useState('PCD'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = { email, senha };

      let loginUrl = 'http://localhost:5000/auth/login';
      if (accountType === 'INSTITUICAO') {
        loginUrl = 'http://localhost:5000/auth/login-institution';
      }

      const response = await axios.post(loginUrl, loginData);

      localStorage.setItem('token', response.data.token);

      const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
      const userType = tokenPayload.tipo;

      localStorage.setItem('accountType', userType);

      if (userType === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/perfil');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title>Login de Usuário Cão-Guia</Title>
      <SubTitle>Coloque suas informações</SubTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tipo de Conta</Form.Label>
          <Form.Select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="PCD">Usuário</option>
            <option value="INSTITUICAO">Instituição</option>
            <option value="ADMIN">Administrador</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite a sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Form.Group>

        <StyledButton variant="primary" type="submit">
          Entrar
        </StyledButton>
      </Form>
    </StyledContainer>
  );
}
