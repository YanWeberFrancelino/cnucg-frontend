import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [userStatus, setUserStatus] = useState('pendente');
  const [institutionStatus, setInstitutionStatus] = useState('pendente');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsuarios();
  }, [userStatus]);

  useEffect(() => {
    fetchInstituicoes();
  }, [institutionStatus]);

  const fetchUsuarios = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/administradores/listar/usuarios/${userStatus}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });          
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setErrorMessages(['Erro ao buscar usuários.']);
    }
  };

  const fetchInstituicoes = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/administradores/listar/instituicoes/${institutionStatus}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      setErrorMessages(['Erro ao buscar instituições.']);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {errorMessages.length > 0 && (
        <div style={{ color: 'red' }}>
          {errorMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      {/* Seção de Usuários */}
      <h2>Usuários</h2>
      <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
        <option value="pendente">Pendentes</option>
        <option value="aprovado">Aprovados</option>
        <option value="rejeitado">Rejeitados</option>
      </select>
      <div>
        {usuarios.map((usuario) => (
          <div key={usuario.id}>
            <p>Nome: {usuario.nome}</p>
            <p>Email: {usuario.email}</p>
            <p>Status: {usuario.status_validacao}</p>
            {/* Botões para atualizar status */}
            {/* Implementar lógica para os botões conforme o status atual */}
          </div>
        ))}
      </div>

      {/* Seção de Instituições */}
      <h2>Instituições</h2>
      <select value={institutionStatus} onChange={(e) => setInstitutionStatus(e.target.value)}>
        <option value="pendente">Pendentes</option>
        <option value="aprovado">Aprovadas</option>
        <option value="rejeitado">Rejeitadas</option>
      </select>
      <div>
        {instituicoes.map((instituicao) => (
          <div key={instituicao.id}>
            <p>Razão Social: {instituicao.razao_social}</p>
            <p>Email: {instituicao.email}</p>
            <p>Status: {instituicao.status_validacao}</p>
            {/* Botões para atualizar status */}
            {/* Implementar lógica para os botões conforme o status atual */}
          </div>
        ))}
      </div>
    </div>
  );
}
