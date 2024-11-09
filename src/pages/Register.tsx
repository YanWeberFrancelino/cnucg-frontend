import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const StyledCadastro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 3em auto;
`;

const StyledTituloCad = styled.div`
  font-family: "Acme", sans-serif;
  font-size: 4vh;
  text-align: center;
  margin-bottom: 1em;
  color: #333;
  width: 100%;
`;

const StyledSubTitulo = styled.div`
  font-family: "Open Sans", sans-serif;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2em;
  color: #555;
`;

const StyledContainerBts = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 1.5rem;
`;

const StyledButton = styled(Button)`
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  width: 150px;
`;

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <StyledCadastro>
      <StyledTituloCad>Cadastro para o projeto de cão-guia</StyledTituloCad>
      <StyledSubTitulo>
        O projeto de cão-guia oferece um treinamento especializado para preparar
        cães que irão auxiliar pessoas com deficiência visual, garantindo-lhes
        independência e mobilidade na sua rotina.
      </StyledSubTitulo>
      <StyledContainerBts>
        <Link to="/cadastro/usuário">
          <StyledButton variant="primary">Usuário</StyledButton>
        </Link>
        <Link to="/cadastro/instituição">
          <StyledButton variant="primary">Instituição</StyledButton>
        </Link>
      </StyledContainerBts>
    </StyledCadastro>
  );
}
