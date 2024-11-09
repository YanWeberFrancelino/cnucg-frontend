
import styled from "styled-components"
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SmTh = styled.th`
    width: 0px;
`

export default function () {
    return <>
        <Container>
            <Row>
                <h1> Validação de documentos </h1>
            </Row>
            <Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Solicitação</th>
                            <SmTh></SmTh>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>pessoa 01</td>
                            <td>Usuário</td>
                            <td>
                                <Link to="/cadastro/usuário" >
                                    <Button variant="secondary" type="submit"> validar </Button>
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>pessoa 02</td>
                            <td>Instituição</td>
                            <td>
                                <Link to="/cadastro/instituição" >
                                    <Button variant="secondary" type="submit"> validar </Button>
                                </Link>
                            </td>
                        
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>pessoa 03</td>
                            <td>cão</td>
                            <td>
                                <Link to="/cadastro/cão" >
                                    <Button variant="secondary" type="submit"> validar </Button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
    </>
}