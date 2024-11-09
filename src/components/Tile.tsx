import { Link, To } from "react-router-dom";
import styled from "styled-components";

const Menu_item = styled.div`
  --menu-item-size: 250px;
  width: var(--menu-item-size);
  height: var(--menu-item-size);
  background-color: #ffffff;
  border-radius: 8px; 
  padding: 1.5em; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); 
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px); 
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); 
  }
`;

const Title = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 1em; 
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 0.5em;
`;

const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6em;
  color: #007bff; 
  height: 100%;
`;

const Actions = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Button = styled.button`
  height: 100%;
  width: 100%;
  background-color: #007bff; 
  border: none;
  border-radius: 5px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 0.85em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004494;
  }
`;

interface Props {
  title: String;
  button: String;
  icon: String;
  to: To;
}

export default function (props: Props) {
  return (
    <Link to={props.to} style={{ textDecoration: "none" }}>
      <Menu_item>
        <Title>{props.title}</Title>
        <Icon className="icon material-symbols-outlined">{props.icon}</Icon>
        <Actions>
          <Button data-permission="any only-unlogged" className="show">
            {props.button}
          </Button>
        </Actions>
      </Menu_item>
    </Link>
  );
}
