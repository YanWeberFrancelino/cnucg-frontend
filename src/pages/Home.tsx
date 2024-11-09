import Tile from "../components/Tile";
import styled from "styled-components";
import { useEffect, useState } from "react";

const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2em;
  gap: 2em;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 1em;
    gap: 1em;
  }
`;

const StyledTile = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  width: 300px;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px) rotate(1deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  h2 {
    font-size: 1.4em;
    font-weight: 700;  /* Aumenta o peso da fonte para garantir o negrito */
    color: #000;  /* Cor preta */
    margin-bottom: 0.8em;
    text-decoration: none;  /* Remove sublinhado */
  }

  a {
    text-decoration: none;  /* Remove sublinhado dos links */
    color: inherit;  /* Garante que a cor do link seja herdada do título */
  }

  p {
    font-size: 1em;
    color: #666;
    margin-bottom: 1em;
  }

  .icon {
    font-size: 2.5em;
    color: #007bff;
    margin-bottom: 0.5em;
  }

  button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 0.8em 1.2em;
    border-radius: 5px;
    font-size: 0.9em;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType");

    if (token) {
      setIsLoggedIn(true);
      setUserType(accountType);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <HomeContainer>
      <StyledTile>
        <Tile
          to="/autenticar"
          icon="qr_code_2"
          title="Verificar Autenticidade"
          button="Verifique uma carteira de cão-guia"
        />
      </StyledTile>

      {isLoggedIn ? (
        <>
          <StyledTile>
            <Tile
              to="/perfil"
              icon="account_circle"
              title="Perfil"
              button="Acesse seu perfil"
            />
          </StyledTile>
          {(userType === "PCD" || userType === "INSTITUICAO" || userType === "ADMIN") && (
            <StyledTile>
              <Tile
                to="/cadastro/cão"
                icon="pets"
                title="Cadastrar Cão-Guia"
                button="Cadastre um novo cão-guia"
              />
            </StyledTile>
          )}
        </>
      ) : (
        <>
          <StyledTile>
            <Tile
              to="/cadastro"
              icon="person_add"
              title="Novo Cadastro"
              button="Crie sua conta"
            />
          </StyledTile>
          <StyledTile>
            <Tile
              to="/login"
              icon="assignment_ind"
              title="Login"
              button="Entre no sistema"
            />
          </StyledTile>
        </>
      )}
    </HomeContainer>
  );
}
