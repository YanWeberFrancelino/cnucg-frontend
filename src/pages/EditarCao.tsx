import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const StyledButton = styled(Button)`
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;

  button {
    margin: 0 0.5rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
`;

const ImageFrame = styled.div`
  display: inline-block;
  padding: 5px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-top: 1rem;
  background-color: #fff;

  img {
    display: block;
    max-width: 150px; /* Reduz o tamanho da imagem */
    height: auto;
    border-radius: 5px;
  }
`;

const ImageCaption = styled.p`
  text-align: center;
  margin-top: 0.5rem;
  font-weight: bold;
  color: #333;
`;

export default function EditarCao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caoData, setCaoData] = useState({
    nome: '',
    sexo: '',
    cor: '',
    raca: '',
    data_nascimento: '',
    numero_registro: '',
    imagem: '',
  });
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCaoData();
  }, []);

  const fetchCaoData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar autenticado.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/caes-guia/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setCaoData({
        nome: data.nome,
        sexo: data.sexo,
        cor: data.cor,
        raca: data.raca,
        data_nascimento: data.data_nascimento.split('T')[0], 
        numero_registro: data.numero_registro,
        imagem: data.imagem || '',
      });
    } catch (error: any) {
      console.error('Erro ao obter dados do cão-guia:', error);
      setError('Erro ao obter dados do cão-guia.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCaoData({ ...caoData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar autenticado.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nome', caoData.nome);
      formData.append('sexo', caoData.sexo);
      formData.append('cor', caoData.cor);
      formData.append('raca', caoData.raca);
      formData.append('data_nascimento', caoData.data_nascimento);
      formData.append('numero_registro', caoData.numero_registro);
      if (imagemFile) {
        formData.append('imagem', imagemFile);
      }

      await axios.put(`http://localhost:5000/caes-guia/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Cão-guia atualizado com sucesso.');
      setTimeout(() => navigate('/perfil'), 2000); 
    } catch (error: any) {
      console.error('Erro ao atualizar cão-guia:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar cão-guia.');
    }
  };

  return (
    <StyledContainer>
      <Title>Editar Cão-Guia</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={caoData.nome}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sexo</Form.Label>
          <Form.Select
            name="sexo"
            value={caoData.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="masc">Macho</option>
            <option value="fem">Fêmea</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cor</Form.Label>
          <Form.Control
            type="text"
            name="cor"
            value={caoData.cor}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Raça</Form.Label>
          <Form.Control
            type="text"
            name="raca"
            value={caoData.raca}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data de Nascimento</Form.Label>
          <Form.Control
            type="date"
            name="data_nascimento"
            value={caoData.data_nascimento}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Número de Registro</Form.Label>
          <Form.Control
            type="text"
            name="numero_registro"
            value={caoData.numero_registro}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          {caoData.imagem ? (
            <>
              <ImageFrame>
                <img
                  src={`http://localhost:5000/uploads/${caoData.imagem}`}
                  alt={`Foto de ${caoData.nome}`}
                />
              </ImageFrame>
              <ImageCaption>Imagem Atual</ImageCaption>
            </>
          ) : (
            <p>Sem imagem cadastrada.</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nova Imagem (Opcional)</Form.Label>
          <Form.Control
            type="file"
            name="imagem"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <ButtonContainer>
          <StyledButton variant="primary" type="submit">
            Salvar
          </StyledButton>
          <StyledButton variant="danger" onClick={() => navigate('/perfil')}>
            Cancelar
          </StyledButton>
        </ButtonContainer>
      </Form>
    </StyledContainer>
  );
}
