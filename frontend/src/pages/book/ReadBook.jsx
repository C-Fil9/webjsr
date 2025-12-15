import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../assets/css/page.css/book.css/BookRead.module.css';

function ReadBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fetchBookAndChapters = async () => {
      try {
        setLoading(true);
        const [bookRes, chaptersRes] = await Promise.all([
          axios.get(`/books/admin/books/${id}`),
          axios.get(`/chapters/${id}`)
        ]);
        setBook(bookRes.data);
        setChapters(chaptersRes.data);
        if (chaptersRes.data.length > 0) {
          setCurrentChapter(chaptersRes.data[0]);
          await fetchChapterContent(chaptersRes.data[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndChapters();
  }, [id]);

  const fetchChapterContent = async (chapter) => {
    try {
      setLoading(true);
      setError(null);
      
      // Xác định loại file
      const fileType = getFileType(chapter.contentUrl);
      setFileType(fileType);

      const response = await axios.get(`/chapters/${chapter._id}/content`, {
        responseType: 'text'
      });
      setChapterContent(response.data);
    } catch (error) {
      console.error('Error fetching chapter content:', error);
      setError('Không thể tải nội dung chapter');
      setChapterContent('');
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (extension === 'docx') return 'docx';
    if (extension === 'pdf') return 'pdf';
    return null;
  };

  const handleChapterChange = async (chapter) => {
    setCurrentChapter(chapter);
    await fetchChapterContent(chapter);
  };

  if (loading && !book) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!book || !currentChapter) {
    return <div className={styles.error}>Không tìm thấy thông tin sách</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Danh sách chapters</h3>
        <div className={styles.chapterList}>
          {chapters.map((chapter) => (
            <div
              key={chapter._id}
              className={`${styles.chapterItem} ${
                currentChapter._id === chapter._id ? styles.active : ''
              }`}
              onClick={() => handleChapterChange(chapter)}
            >
              Chapter {chapter.chapterNumber}: {chapter.title}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <h2>Chapter {currentChapter.chapterNumber}: {currentChapter.title}</h2>
        {loading ? (
          <div className={styles.loading}>Đang tải nội dung...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div 
            className={`${styles.reader} ${styles[fileType]}`}
            dangerouslySetInnerHTML={{ __html: chapterContent }}
          />
        )}
      </div>
    </div>
  );
}

export default ReadBook;
