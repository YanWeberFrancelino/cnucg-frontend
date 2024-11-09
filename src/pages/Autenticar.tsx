import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import QrScanner from 'qr-scanner';

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

const StyledButton = styled.button`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;

  video {
    width: 100%;
    max-width: 400px;
    border: 2px solid #ddd;
    border-radius: 8px;
  }
`;

export default function Autenticar() {
  const [codigo, setCodigo] = useState('');
  const [carteira, setCarteira] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const extractedCode = codigo.includes('http') ? codigo.split('/').pop() : codigo;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/carteira/codigo/${extractedCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarteira(response.data);
      setMessage('Carteira validada com sucesso!');
    } catch (error) {
      console.error('Erro ao validar a carteira:', error);
      setMessage('Erro ao validar a carteira.');
    }
  };

  const startQrScanner = () => {
    setShowScanner(true);
  };

  const cancelScanner = () => {
    if (qrScanner) {
      qrScanner.stop();
      setQrScanner(null);
    }
    setShowScanner(false);
  };

  useEffect(() => {
    if (showScanner && videoRef.current && !qrScanner) {
      const qrScannerInstance = new QrScanner(
        videoRef.current,
        (result) => {
          setCodigo(result.data);
          setShowScanner(false);
          if (qrScannerInstance) {
            qrScannerInstance.stop();
            setQrScanner(null);
          }
        },
        {
          returnDetailedScanResult: true,
        }
      );

      qrScannerInstance
        .start()
        .then(() => {
          console.log('QR Scanner iniciado');
        })
        .catch((err) => {
          console.error('Erro ao iniciar o scanner:', err);
          setMessage('Erro ao iniciar o scanner.');
          setShowScanner(false);
        });

      setQrScanner(qrScannerInstance);
    }

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        setQrScanner(null);
      }
    };
  }, [showScanner, videoRef, qrScanner]);

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [qrScanner]);

  useEffect(() => {
    if (carteira) {
      console.log('Dados da Carteira:', carteira);
    }
  }, [carteira]);

  return (
    <StyledContainer>
      <Title>Autenticar Carteira Nacional</Title>

      <form onSubmit={handleSubmit}>
        <label>Código da Carteira ou URL</label>
        <input
          type="text"
          placeholder="Digite o código ou URL da carteira"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
        />

        <StyledButton type="submit">Validar</StyledButton>
      </form>

      <StyledButton onClick={startQrScanner} style={{ marginTop: '10px' }}>
        Escanear QR Code
      </StyledButton>

      {showScanner && (
        <ScannerContainer>
          <video ref={videoRef} autoPlay playsInline></video>
          <StyledButton onClick={cancelScanner}>Cancelar Escaneamento</StyledButton>
        </ScannerContainer>
      )}

      {message && <Message success={message === 'Carteira validada com sucesso!'}>{message}</Message>}

      {carteira && (
        <div>
          <h3>Carteira Encontrada:</h3>
          <p><strong>Nome:</strong> {carteira.usuario_nome}</p>
          <p><strong>CPF:</strong> {carteira.usuario_cpf}</p>
          <p><strong>Cão:</strong> {carteira.cao_nome}</p>
          <p><strong>Número de Registro:</strong> {carteira.numero_registro}</p>
          <img
            src={
              carteira.qr_code_path.startsWith('uploads/qrcodes/')
                ? `http://localhost:5000/${carteira.qr_code_path}`
                : `http://localhost:5000/uploads/qrcodes/${carteira.qr_code_path}`
            }
            alt="QR Code"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-qr-code.png'; 
            }}
            style={{ marginTop: '1rem', maxWidth: '200px' }}
          />
        </div>
      )}
    </StyledContainer>
  );
}
