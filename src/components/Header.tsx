import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Header = styled.header`
  background-color: #004d40;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1.5em;
  display: flex;
  width: 100%;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Img = styled.img`
  width: 2.5em; 
  margin-right: 1em;
`;

const PermissionName = styled.div`
  font-size: 1.1em;
  color: #fff;
  font-weight: bold;
`;

export default function HeaderComponent() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const fetchUserData = () => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserName(response.data.nome || response.data.razao_social);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Erro ao obter dados do usuário:", error);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Header>
      {/* Logo agora é clicável e redireciona para a página inicial */}
      <LogoLink to="/">
        <Img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Instituto_Federal_Marca_2015.svg/640px-Instituto_Federal_Marca_2015.svg.png"
          title="Logo do IFC"
          alt="Logo do Instituto Federal"
        />
      </LogoLink>

      <PermissionName>
        {isLoggedIn ? `Bem-vindo(a), ${userName}` : "Você não está logado"}
      </PermissionName>
    </Header>
  );
}
