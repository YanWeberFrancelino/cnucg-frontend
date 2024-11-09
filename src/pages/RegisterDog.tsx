import { useState } from 'react';
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
  text-align: center;
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

export default function RegisterDog() {
  const [formData, setFormData] = useState({
    nome: '',
    sexo: 'masc',
    cor: '',
    data_nascimento: '',
    raca: '',
    numero_registro: '',
    cnpj_instituicao: '',
    imagem: null,
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [institutionResult, setInstitutionResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagem: e.target.files[0] });
  };

  const handleInstitutionBlur = async () => {
    const query = formData.cnpj_instituicao.trim();
    setInstitutionResult('');
    setErrorMessages([]);

    if (query === '') {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/instituicoes/search?query=${encodeURIComponent(query)}`);
      if (response.data) {
        setInstitutionResult(`Instituição encontrada: ${response.data.razao_social} - CNPJ: ${response.data.cnpj}`);
      } else {
        setInstitutionResult('Instituição não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao pesquisar instituições:', error);
      setErrorMessages(['Erro ao pesquisar instituições.']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessages(['Você precisa estar autenticado para registrar um cão-guia.']);
      return;
    }

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('sexo', formData.sexo);
    data.append('cor', formData.cor);
    data.append('data_nascimento', formData.data_nascimento);
    data.append('raca', formData.raca);
    data.append('numero_registro', formData.numero_registro);
    if (formData.cnpj_instituicao) {
      data.append('cnpj_instituicao', formData.cnpj_instituicao);
    }
    if (formData.imagem) {
      data.append('imagem', formData.imagem);
    }

    try {
      const response = await axios.post('http://localhost:5000/caes-guia', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Cão-guia registrado com sucesso!');
      setFormData({
        nome: '',
        sexo: 'masc',
        cor: '',
        data_nascimento: '',
        raca: '',
        numero_registro: '',
        cnpj_instituicao: '',
        imagem: null,
      });
      setInstitutionResult('');
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessages([error.response.data.message]);
      } else {
        setErrorMessages(['Erro ao registrar cão-guia. Tente novamente.']);
      }
    }
  };

  return (
    <StyledContainer>
      <Title>Cadastro de Cão-Guia</Title>

      {errorMessages.length > 0 && (
        <Message>{errorMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}</Message>
      )}

      {successMessage && <Message success>{successMessage}</Message>}

      <Form onSubmit={handleSubmit}>
        {/* Nome do cão-guia */}
        <Form.Group className="mb-3">
          <StyledLabel>Nome</StyledLabel>
          <Form.Control
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite o nome do cão-guia"
            required
          />
        </Form.Group>

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
          </Form.Select>
        </Form.Group>

        {/* Cor */}
        <Form.Group className="mb-3">
          <StyledLabel>Cor</StyledLabel>
          <Form.Control
            type="text"
            name="cor"
            value={formData.cor}
            onChange={handleChange}
            placeholder="Digite a cor do cão-guia"
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

        {/* Raça */}
        <Form.Group className="mb-3">
          <StyledLabel>Raça</StyledLabel>
          <Form.Control
            type="text"
            name="raca"
            value={formData.raca}
            onChange={handleChange}
            placeholder="Digite a raça do cão-guia"
            required
          />
        </Form.Group>

        {/* Número de Registro */}
        <Form.Group className="mb-3">
          <StyledLabel>Número de Registro</StyledLabel>
          <Form.Control
            type="text"
            name="numero_registro"
            value={formData.numero_registro}
            onChange={handleChange}
            placeholder="Digite o número de registro do cão-guia"
            required
          />
        </Form.Group>

        {/* CNPJ da Instituição (opcional) */}
        <Form.Group className="mb-3">
          <StyledLabel>CNPJ da Instituição (opcional)</StyledLabel>
          <Form.Control
            type="text"
            name="cnpj_instituicao"
            value={formData.cnpj_instituicao}
            onChange={handleChange}
            onBlur={handleInstitutionBlur}
            placeholder="Digite o CNPJ da instituição"
          />
          {institutionResult && <p style={{ color: 'green' }}>{institutionResult}</p>}
        </Form.Group>

        {/* Imagem (opcional) */}
        <Form.Group className="mb-3">
          <StyledLabel>Imagem (opcional)</StyledLabel>
          <Form.Control
            type="file"
            name="imagem"
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
          />
          <Form.Text className="text-muted">
            Formato JPEG ou PNG, tamanho máximo de 5MB.
          </Form.Text>
        </Form.Group>

        <StyledButton variant="primary" type="submit">
          Registrar Cão-Guia
        </StyledButton>
      </Form>
    </StyledContainer>
  );
}
