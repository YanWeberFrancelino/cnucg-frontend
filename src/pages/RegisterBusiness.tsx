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

const cleanNumberString = (value: string) => value.replace(/[^\d]/g, '');

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    endereco_logradouro: '',
    endereco_numero: '',
    endereco_complemento: '',
    endereco_cep: '',
    endereco_cidade: '',
    endereco_estado: '',
    endereco_bairro: '',
    email: '',
    confirm_email: '',  
    senha: '',
    confirm_senha: '', 
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

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

    if (formData.email !== formData.confirm_email) {
      setErrorMessages(['Os e-mails não correspondem.']);
      return;
    }
    if (formData.senha !== formData.confirm_senha) {
      setErrorMessages(['As senhas não correspondem.']);
      return;
    }

    const cleanedFormData = {
      ...formData,
      cnpj: cleanNumberString(formData.cnpj),
      endereco_cep: cleanNumberString(formData.endereco_cep),
    };

    try {
      await axios.post('http://localhost:5000/auth/register-institution', cleanedFormData);
      setSuccessMessage('Instituição cadastrada com sucesso! Aguarde a aprovação do seu cadastro.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        setErrorMessages(['Erro ao registrar instituição. Tente novamente.']);
      }
    }
  };

  return (
    <StyledContainer>
      <Title>Cadastro de Instituição</Title>
      <h2 className="Titulo">Pessoa Jurídica</h2>

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
            {/* Razão Social */}
            <Form.Group className="mb-3">
              <StyledLabel>Razão Social</StyledLabel>
              <Form.Control
                type="text"
                name="razao_social"
                value={formData.razao_social}
                onChange={handleChange}
                placeholder="Digite a razão social"
                required
              />
            </Form.Group>

            {/* CNPJ */}
            <Form.Group className="mb-3">
              <StyledLabel>CNPJ</StyledLabel>
              <Form.Control
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="Digite seu CNPJ"
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
                placeholder="Digite o email da instituição"
                required
              />
            </Form.Group>

            {/* Confirmar Email */}
            <Form.Group className="mb-3">
              <StyledLabel>Confirmar Email</StyledLabel>
              <Form.Control
                type="email"
                name="confirm_email"
                value={formData.confirm_email}
                onChange={handleChange}
                placeholder="Confirme o email da instituição"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Logradouro */}
            <Form.Group className="mb-3">
              <StyledLabel>Logradouro</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_logradouro"
                value={formData.endereco_logradouro}
                onChange={handleChange}
                placeholder="Digite o logradouro"
                required
              />
            </Form.Group>

            {/* Número */}
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

            {/* Complemento */}
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

            {/* CEP */}
            <Form.Group className="mb-3">
              <StyledLabel>CEP</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_cep"
                value={formData.endereco_cep}
                onChange={handleChange}
                placeholder="Digite o CEP"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Endereço Adicional */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <StyledLabel>Bairro</StyledLabel>
              <Form.Control
                type="text"
                name="endereco_bairro"
                value={formData.endereco_bairro}
                onChange={handleChange}
                placeholder="Digite o bairro"
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
                placeholder="Digite a cidade"
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
            placeholder="Digite o estado (UF)"
            required
          />
        </Form.Group>

        {/* Senha e Confirmar Senha lado a lado */}
        <Row>
          <Col md={6}>
            {/* Senha */}
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
            {/* Confirmar Senha */}
            <Form.Group className="mb-3">
              <StyledLabel>Confirmar Senha</StyledLabel>
              <Form.Control
                type="password"
                name="confirm_senha"
                value={formData.confirm_senha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <StyledButton variant="primary" type="submit">
          Cadastrar
        </StyledButton>
      </Form>
    </StyledContainer>
  );
}
