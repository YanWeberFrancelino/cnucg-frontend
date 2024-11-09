import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background-color: transparent;
  gap: 20px;
  position: relative;
`;

const SideContainer = styled.div`
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  width: 250px;
  background-color: #fff;
`;

const CardContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 600px;
  height: 400px; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  position: relative;
`;

const PhotoArea = styled.div`
  width: 200px;  
  height: 200px;
  background-color: #fff;  
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;  
  }
`;



const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: -200px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export default function Carteira() {
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [numeroRegistro, setNumeroRegistro] = useState('');
  const [caesGuia, setCaesGuia] = useState<any[]>([]);
  const [selectedCao, setSelectedCao] = useState<any>(null);
  const [carteira, setCarteira] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Você precisa estar autenticado para acessar esta página.');
          return;
        }

        const userResponse = await axios.get('http://localhost:5000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userResponse.data;
        setCpf(user.cpf);
        setRg(user.rg);
        setNomeCompleto(user.nome);
        setSexo(user.sexo);
        setDataNascimento(user.data_nascimento);

        const dogResponse = await axios.get('http://localhost:5000/caes-guia/meus', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCaesGuia(dogResponse.data);
        setSelectedCao(dogResponse.data[0]); 
        if (dogResponse.data[0]) {
          setCaoDetails(dogResponse.data[0]);
          await loadCarteira(dogResponse.data[0].id);
        }

      } catch (error) {
        console.error('Erro ao buscar dados do usuário ou cães:', error);
        setError('Erro ao buscar dados do usuário ou cães.');
      }
    };

    fetchUserData();
  }, []);

  const setCaoDetails = (cao) => {
    setInstituicao(cao.instituicao?.razao_social || 'Nenhuma instituição vinculada');
    setNumeroRegistro(cao.numero_registro);
  };

  const handleCaoChange = async (event) => {
    const selectedCaoId = event.target.value;
    const selected = caesGuia.find((cao) => cao.id === parseInt(selectedCaoId));
    setSelectedCao(selected);
    setCaoDetails(selected);
    await loadCarteira(selectedCaoId); 
  };

  const loadCarteira = async (caoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/carteira/${caoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarteira(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCarteira(null);
      } else {
        console.error('Erro ao buscar carteira:', error);
        setError('Erro ao buscar a carteira.');
      }
    }
  };

  const handleGerarCarteira = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/carteira/gerar-carteira`,
        { idCao: selectedCao.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCarteira(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Carteira já existe para este cão.');
      } else {
        console.error('Erro ao gerar carteira:', error);
        setError('Erro ao gerar a carteira.');
      }
    }
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <StyledContainer>
      <SideContainer>
        <h2>Selecione o Cão-Guia</h2>
        <select onChange={handleCaoChange} value={selectedCao?.id || ''}>
          {caesGuia.map((cao) => (
            <option key={cao.id} value={cao.id}>
              {cao.nome}
            </option>
          ))}
        </select>
      </SideContainer>

      {/* Carteira do usuário */}
      <CardContainer>
        <Title>Carteira de Identificação</Title>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <PhotoArea>
            {carteira ? (
              <img src={`http://localhost:5000/uploads/qrcodes/${carteira.qr_code_path}`} alt="QR Code" />
            ) : (
              <p>Carteira não gerada</p>
            )}
          </PhotoArea>

          <InfoArea>
            <Field>
              <strong>Nome completo:</strong> <span>{nomeCompleto}</span>
            </Field>
            <Field>
              <strong>CPF:</strong> <span>{cpf}</span>
            </Field>
            <Field>
              <strong>RG:</strong> <span>{rg}</span>
            </Field>
            <Field>
              <strong>Sexo:</strong> <span>{sexo}</span>
            </Field>
            <Field>
              <strong>Data de Nascimento:</strong> <span>{new Date(dataNascimento).toLocaleDateString()}</span>
            </Field>
            <Field>
              <strong>Cão:</strong> <span>{selectedCao?.nome || 'Nenhum cão registrado'}</span>
            </Field>
            {instituicao && (
              <Field>
                <strong>Instituição:</strong> <span>{instituicao}</span>
              </Field>
            )}
            {numeroRegistro && (
              <Field>
                <strong>Número de Registro:</strong> <span>{numeroRegistro}</span>
              </Field>
            )}
            {carteira && (
              <Field>
                <strong>Código:</strong> <span>{carteira.codigo}</span>
              </Field>
            )}
          </InfoArea>
        </div>
      </CardContainer>

      {/* Botão para gerar a carteira fora da carteira */}
      {!carteira && (
        <StyledButton onClick={handleGerarCarteira}>Gerar Carteira</StyledButton>
      )}
    </StyledContainer>
  );
}
