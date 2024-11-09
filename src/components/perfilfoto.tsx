import styled from "styled-components"

const Menu_item = styled.div`
    width:  530px;
    height: 716px;

    background-color: #FFFFFF;
    border-radius: 6px;
    padding: 1em;
    box-shadow: 0 3px 6px #00000029;
    user-select: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border:10px;

    
`

const Title = styled.div`
    font-family: "Open Sans", sans-serif;
    display: flex;
    justify-content: center;
    align-items: start;                        
    border: 3px;
    border-color: black;
    font-size: 1em;
`

const Icon = styled.span`
    display: flex;
    justify-content: left;
    align-items: start;                     
    
    font-size: 7em;
`
    
const Actions = styled.div`
    height: 100px;
`

const Instituicao = styled.div`
display: flex;
justify-content: left;
align-items: start;                        
font-size: 1em;
padding: 5px;
`

const Endereco = styled.div`
padding: 5px;
display: flex;
justify-content: left;
align-items: start;                        
font-size: 1em;
`

const Nome = styled.div`
padding: 5px;
display: flex;
justify-content: left;
align-items: start;                        
font-size: 1em;

`
const Telefone = styled.div`
display: flex;
padding: 5px;
justify-content: left;
align-items: start;                        
font-size: 1em;
`

const CEP = styled.div`
padding: 5px;
display: flex;
justify-content: left;
align-items: start;                        
font-size: 1em;
`
const Estado = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`

const Cidade = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`

const Logradouro = styled.div`
display: flex;
justify-content: left;
align-items: start;                        
font-size: 1em;
padding: 5px;
`

const Numero = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`

const Complemento = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`

const Bairro = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`

const Raca = styled.div`
display: flex;
justify-content: left;
align-items: start;      
padding: 5px;                  
font-size: 1em;
`
const Cor = styled.div`
display: flex;
justify-content: left;
align-items: start;        
padding: 5px;                
font-size: 1em;
`
const Sexo = styled.div`
display: flex;
padding: 5px;
justify-content: left;
align-items: start;                        
font-size: 1em;
`
const Numeroreg = styled.div`
display: flex;
justify-content: left;
padding: 5px;
align-items: start;                        
font-size: 1em;
`
const Status = styled.div`
display: flex;
padding: 5px;
justify-content: left;
align-items: start;                        
font-size: 1em;
`
const Nomecao = styled.div`
display: flex;
padding: 5px;
justify-content: left;
align-items: start;                        
font-size: 1em;
`
interface Props {
    title?: String
    nome?: String
    icon?: String
    Email?: String
    Telefone?: String
    Instituicao?: String
    CEP?: String
    Estado?: String
    Cidade?: String
    Logradouro?: String
    Numero?: String
    Complemento?: String
    Bairro?: String
    Endereco?: String

    Raca?: String
    Cor?: String
    Sexo?: String
    Numeroreg?: String
    Status?: String
    nomecao?: String
}

export default function (props: Props) {
    return <>
        <Menu_item>
            <Title>
                {props.title}
            </Title>
            <Icon className="icon material-symbols-outlined">
                {props.icon}
            </Icon>
            <Actions>
                <Nome data-permission="any only-unlogged" className="show">
                    {props.nome}
                </Nome>

                <Instituicao data-permission="any only-unlogged" className="show">
                    {props.Instituicao}
                </Instituicao>

                <Telefone data-permission="any only-unlogged" className="show">
                    {props.Telefone}
                </Telefone>

                <Endereco data-permission="any only-unlogged" className="show">
                {props.Endereco}
                </Endereco>
                <CEP data-permission="any only-unlogged" className="show">
                    {props.CEP}
                </CEP>
                <Estado data-permission="any only-unlogged" className="show">
                    {props.Estado}
                </Estado>

                <Cidade data-permission="any only-unlogged" className="show">
                    {props.Cidade}
                </Cidade>

                <Logradouro data-permission="any only-unlogged" className="show">
                    {props.Logradouro}
                </Logradouro>

                <Numero data-permission="any only-unlogged" className="show">
                    {props.Numero}
                </Numero>

                <Complemento data-permission="any only-unlogged" className="show">
                    {props.Complemento}
                </Complemento>

                <Bairro data-permission="any only-unlogged" className="show">
                    {props.Bairro}
                </Bairro>

                
                <Nomecao data-permission="any only-unlogged" className="show">
                    {props.nomecao}
                </Nomecao>
                <Raca data-permission="any only-unlogged" className="show">
                    {props.Raca}
                </Raca>
                <Cor data-permission="any only-unlogged" className="show">
                    {props.Cor}
                </Cor>
                <Sexo data-permission="any only-unlogged" className="show">
                    {props.Sexo}
                </Sexo>
                <Numeroreg data-permission="any only-unlogged" className="show">
                    {props.Numeroreg}
                </Numeroreg>
                <Status data-permission="any only-unlogged" className="show">
                    {props.Status}
                </Status>

                

            </Actions>

        </Menu_item>
    </>
}