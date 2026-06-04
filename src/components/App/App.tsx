// src/components/App/App.tsx
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../Services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const App: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const perPage = 12;

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    staleTime: 5000,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при новому пошуку
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        
        {/* {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            onPageChange={handlePageChange} 
            forcePage={page - 1} 
          />
        )} */}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes. Please try again later.</p>}

      {!isLoading && !isError && data?.notes && (
        <NoteList notes={data.notes} />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NoteForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default App;