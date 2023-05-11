/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
import { Link } from 'react-router-dom';
import {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import {
  Card,
  Container,
  ErrorContainer,
  Header,
  InputSearchContainer,
  ListHeader,
  EmptyListContainer,
  SearchNotFoundContainer,
} from './styles';
import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import sad from '../../assets/images/icons/sad.svg';
import emptyBox from '../../assets/images/icons/empty-box.svg';
import magnifierQuestion from '../../assets/images/icons/magnifier-question.svg';
import Modal from '../../components/Modal';

// import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import ContactsService from '../../services/ContactsService';
import Button from '../../components/Button';

import toast from '../../utils/toast';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, serOrderBy] = useState('asc');
  const [serchTerm, setSerchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeignDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(serchTerm.toLowerCase())
  )), [contacts, serchTerm]);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy);
      setHasError(false);
      setContacts(contactsList);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  function handleToggleOrderBy() {
    serOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }

  function handleChangeSearchTerm(event) {
    setSerchTerm(event.target.value);
  }

  const handleTryAgain = () => {
    loadContacts();
  };

  const handleDeleteContact = (contact) => {
    setIsDeleteModalVisible(true);
    setContactBeignDeleted(contact);
  };

  const handleCloseModalDelete = () => {
    setIsDeleteModalVisible(false);
    setContactBeignDeleted(null);
  };

  const handleConfirmDeleteContact = async () => {
    try {
      setIsLoadingDelete(true);
      await ContactsService.deleteContact(contactBeingDeleted.id);

      setContacts((prevState) => prevState.filter(
        (contact) => contact.id !== contactBeingDeleted.id,
      ));

      handleCloseModalDelete();

      toast({
        type: 'success',
        text: 'Contato deletado com sucesso!',
      });
    } catch {
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao deletar o contato',
      });
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <Container>
      <Loader isLoading={isLoading} />

      <Modal
        danger
        isLoading={isLoadingDelete}
        visible={isDeleteModalVisible}
        title={`Tem certeza que deseja remover o contato "${contactBeingDeleted?.name}"?`}
        confirmLabel="Deletar"
        onCancel={handleCloseModalDelete}
        onConfirm={handleConfirmDeleteContact}
      >
        <p>Esta ação não podera ser desfeita!</p>
      </Modal>

      {contacts.length > 0 && (
      <InputSearchContainer>
        <input
          value={serchTerm}
          type="text"
          placeholder="Pesquise pelo nome"
          onChange={handleChangeSearchTerm}
        />
      </InputSearchContainer>
      )}

      <Header
        justifyContent={((
          hasError
            ? 'flex-end'
            : (
              contacts.length > 0
                ? 'space-between'
                : 'center'
            )))}
      >
        {(!hasError && contacts.length > 0) && (
          <strong>
            {filteredContacts.length}
            {' '}
            {filteredContacts.length === 1 ? 'contato' : 'contatos'}
          </strong>
        )}
        <Link to="/new">Novo contato</Link>
      </Header>

      {hasError && (
        <ErrorContainer>
          <img src={sad} alt="Sad" />

          <div className="details">
            <strong>Ocorreu um erro ao obter os seus contatos!</strong>
            <Button type="button" onClick={handleTryAgain}>
              Tentar novamente
            </Button>
          </div>
        </ErrorContainer>
      )}

      {!hasError && (
        <>
          {contacts.length < 1 && !isLoading
            && (
            <EmptyListContainer>
              <img src={emptyBox} alt="" />
              <p>
                Você ainda não tem nenhum contato cadastrado!
                Clique no botão <strong>”Novo contato”</strong>
                à cima para cadastrar o seu primeiro!
              </p>
            </EmptyListContainer>
            )}

            {(contacts.length > 0 && filteredContacts.length < 1) && (
              <SearchNotFoundContainer>
                <img src={magnifierQuestion} alt="Magnifier Question" />

                <span>
                  Nenhum resultado foi encontrado para <strong>”{serchTerm}”</strong>.
                </span>
              </SearchNotFoundContainer>
            )}

            {filteredContacts.length > 0 && (
            <ListHeader orderBy={orderBy}>
              <button type="button" onClick={handleToggleOrderBy}>
                <span>Nome</span>
                <img src={arrow} alt="Arrow" />
              </button>
            </ListHeader>
            )}

            {filteredContacts.map((item) => (
              <Card key={item.id}>
                <div className="info">
                  <div className="contact-name">
                    <strong>{item.name}</strong>
                    {item.category_name
                        && <small>{item.category_name}</small>}
                  </div>
                  <span>{item.email}</span>
                  <span>{item.phone}</span>
                </div>

                <div className="actions">
                  <Link to={`/edit/${item.id}`}>
                    <img src={edit} alt="Edit" />
                  </Link>
                  <button onClick={() => handleDeleteContact(item)} type="button">
                    <img src={trash} alt="Delete" />
                  </button>
                </div>
              </Card>
            ))}
        </>
      )}
    </Container>
  );
}
