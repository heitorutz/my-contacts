/* eslint-disable max-len */
import {
  useEffect, useState, useMemo, useCallback, useDeferredValue,
} from 'react';
import toast from '../../utils/toast';
import ContactsService from '../../services/ContactsService';

export default function useHome() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, serOrderBy] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeignDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => contact.name.toLowerCase()
      .includes(deferredSearchTerm.toLowerCase())),
    [contacts, deferredSearchTerm],
  );

  const loadContacts = useCallback(async (signal) => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy, signal);
      setHasError(false);
      setContacts(contactsList);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setHasError(true);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    const controller = new AbortController();

    loadContacts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadContacts]);

  const handleToggleOrderBy = useCallback(() => {
    serOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }, []);

  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value);
  }

  const handleTryAgain = () => {
    loadContacts();
  };

  const handleDeleteContact = useCallback((contact) => {
    setIsDeleteModalVisible(true);
    setContactBeignDeleted(contact);
  }, []);

  const handleCloseModalDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleConfirmDeleteContact = async () => {
    try {
      setIsLoadingDelete(true);
      await ContactsService.deleteContact(contactBeingDeleted.id);

      setContacts((prevState) => prevState.filter((contact) => contact.id !== contactBeingDeleted.id));

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

  return {
    isLoading,
    isLoadingDelete,
    isDeleteModalVisible,
    contactBeingDeleted,
    contacts,
    searchTerm,
    hasError,
    filteredContacts,
    orderBy,
    handleCloseModalDelete,
    handleConfirmDeleteContact,
    handleChangeSearchTerm,
    handleTryAgain,
    handleToggleOrderBy,
    handleDeleteContact,
  };
}
