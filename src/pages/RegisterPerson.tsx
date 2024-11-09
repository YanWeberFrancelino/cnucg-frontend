import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
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

const Message = styled.p<{ success?: boolean }>`
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${(props) => (props.success ? 'green' : 'red')};
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
`;

const StyledLabel = styled(Form.Label)`
  font-weight: bold;
  color: #333;
`;

export default function RegisterPerson() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    rg: '',
    cpf: '',
    sexo: 'masc',
    endereco_logradouro: '',
    endereco_numero: '',
    endereco_complemento: '',
    endereco_cep: '',
    endereco_cidade: '',
    endereco_estado: '',
    endereco_bairro: '',
    email: '',
    confirmEmail: '', 
    telefone: '',
    senha: '',
    confirmSenha: '',
    id_instituicao: null, 
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const cleanNumberString = (value: string) => value.replace(/[^\d]/g, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage('');

    if (formData.email !== formData.confirmEmail) {
      setErrorMessages(['Os emails não correspondem.']);
      return;
    }

    if (formData.senha !== formData.confirmSenha) {
      setErrorMessages(['As senhas não correspondem.']);
      return;
    }

    const cleanedFormData = {
      ...formData,
      cpf: cleanNumberString(formData.cpf),
      rg: cleanNumberString(formData.rg),
      telefone: cleanNumberString(formData.telefone),
      endereco_cep: cleanNumberString(formData.endereco_cep),
    };

    try {
      await axios.post('http://localhost:5000/auth/register', cleanedFormData);
      setSuccessMessage('Usuário cadastrado com sucesso! Aguarde a aprovação do seu cadastro.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        setErrorMessages(['Erro ao registrar usuário. Tente novamente.']);
      }
    }
  };

  return (
    <StyledContainer>
      <Title>Cadastro de Usuário Cão-Guia - Pessoa Física</Title>

      {errorMessages.length > 0 && (
        <Message>
          {errorMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </Message>
      )}

      {successMessage && <Message success>{successMessage}</Message>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Nome Completo */}
            <Form.Group className="mb-3">
              <StyledLabel>Nome Completo</StyledLabel>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
                required
              />
            </Form.Group>

            {/* Data de Nascimento */}
            <Form.Group className="mb-3">
              <StyledLabel>Data de Nascimento</StyledLabel>
              <Form.Control
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* RG */}
            <Form.Group className="mb-3">
              <StyledLabel>RG</StyledLabel>
              <Form.Control
                type="text"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                placeholder="Digite seu RG"
                required
              />
            </Form.Group>

            {/* CPF */}
            <Form.Group className="mb-3">
              <StyledLabel>CPF</StyledLabel>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Digite seu CPF"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Sexo */}
            <Form.Group className="mb-3">
              <StyledLabel>Sexo</StyledLabel>
              <Form.Select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
              >
                <option value="masc">Masculino</option>
                <option value="fem">Feminino</option>
                <option value="nao-bin">Não-binário</option>
              </Form.Select>
            </Form.Group>

            {/* Telefone */}
            <Form.Group className="mb-3">
              <StyledLabel>Telefone</StyledLabel>
              <Form.Control
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Digite seu telefone"
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <StyledLabel>Email</StyledLabel>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                required
              />
            </Form.Group>

            {/* Confirmar Email */}
            <Form.Group className="mb-3">
              <StyledLabel>Confirmar Email</StyledLabel>
              <Form.Control
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                placeholder="Confirme seu email"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Senha e Confirmar Senha lado a lado */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Senha</StyledLabel>
              <Form.Control
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Confirmar Senha</StyledLabel>
              <Form.Control
                type="password"
                name="confirmSenha"
                value={formData.confirmSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Endereço */}
        <h3 className="mt-4 mb-3">Endereço</h3>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Logradouro</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_logradouro"
                value={formData.endereco_logradouro}
                onChange={handleChange}
                placeholder="Digite seu logradouro"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <StyledLabel>Número</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_numero"
                value={formData.endereco_numero}
                onChange={handleChange}
                placeholder="Digite o número"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Complemento</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_complemento"
                value={formData.endereco_complemento}
                onChange={handleChange}
                placeholder="Digite o complemento (opcional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <StyledLabel>CEP</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_cep"
                value={formData.endereco_cep}
                onChange={handleChange}
                placeholder="Digite seu CEP"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Bairro</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_bairro"
                value={formData.endereco_bairro}
                onChange={handleChange}
                placeholder="Digite seu bairro"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Cidade</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_cidade"
                value={formData.endereco_cidade}
                onChange={handleChange}
                placeholder="Digite sua cidade"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <StyledLabel>Estado (UF)</StyledLabel>
          <Form.Control
            type="text"
            name="endereco_estado"
            value={formData.endereco_estado}
            onChange={handleChange}
            placeholder="Digite seu estado (UF)"
            required
          />
        </Form.Group>

        <StyledButton variant="primary" type="submit">
          Cadastrar
        </StyledButton>
      </Form>
    </StyledContainer>
  );
}
