import fb from "../assets/facebook.svg";
import yt from "../assets/youtube.svg";
import insta from "../assets/instagram.svg";
import styled from "styled-components";

const Footer = styled.footer`
  background-color: #004d40;
  padding: 1em 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  color: white;
  font-size: 0.85em;
  border-top: 2px solid #00796b;

  .footer-container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1.5em;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  .informacoes {
    text-align: center;
    @media (min-width: 768px) {
      text-align: left;
    }

    a {
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .endereco {
      margin-top: 0.5em;
      font-size: 0.8em;
    }
  }

  .outros {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    @media (min-width: 768px) {
      justify-content: flex-end;
    }

    a {
      color: #ffffff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .redes-sociais {
    display: flex;
    gap: 1.5em; 
    justify-content: center;
    margin-top: 1em;

    a {
      display: inline-block;
    }

    img {
      width: 2em;
      filter: brightness(0.7);
      transition: transform 0.3s ease, filter 0.3s ease;

      &:hover {
        transform: scale(1.1);
        filter: brightness(1);
      }
    }
  }

  @media (max-width: 768px) {
    font-size: 0.75em;
    padding: 1em;
  }
`;

export default function FooterComponent() {
  return (
    <Footer>
      <div className="footer-container">
        <div className="informacoes">
          <a href="https://www.camboriu.ifc.edu.br/">
            Instituto Federal de Educação, Ciência e Tecnologia Catarinense -
            Campus Camboriú
          </a>
          <div className="endereco">
            Rua: Joaquim Garcia, s/c - CEP 88340-055 - Camboriú - SC / Fone:
            (47) 2104-0800
          </div>
        </div>

        <div className="outros">
          <div className="termos">
            <a href="#">Termos de uso</a>
          </div>
          <div className="privacidade">
            <a href="#">Política de privacidade</a>
          </div>
        </div>

        <div className="redes-sociais">
          <a href="https://www.instagram.com/ifc.oficial.camboriu/">
            <img src={insta} alt="Instagram" />
          </a>
          <a href="https://www.youtube.com/ifcoficialcamboriu">
            <img src={yt} alt="YouTube" />
          </a>
          <a href="https://www.facebook.com/ifccamboriu.oficial/?locale=lv_LV&_rdr">
            <img src={fb} alt="Facebook" />
          </a>
        </div>
      </div>
    </Footer>
  );
}
