import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetchSearchResults from "../../api/search/search";
import fetchSearchMoviesResults from "../../api/search/searchmovies";

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // 연관검색어 리스트
  const [isOpen, setIsOpen] = useState(false);  // 연관검색어 표시 여부
  const searchRef = useRef(null);
  const [isInputVisible, setIsInputVisible] = useState(false); // 검색창 토글 상태

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const typingTimeoutRef = useRef(null); 

  // 검색어 변경 시 처리
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // 검색어가 있을 때만 연관검색어를 보여줌
    if (value) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); 
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (value.length >= 2) { 
        fetchSearchResults(value, token || null).then((results) => {
          console.log(results); 
          const uniqueResults = results.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id
            ))
          );
          setSearchResults(uniqueResults);  // 연관검색어 업데이트
        });
      } else {
        setSearchResults([]);  // 검색어가 짧으면 연관검색어 초기화
      }
    }, 500); 
  };

  // 엔터키 처리: Enter 키가 눌렸을 때
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.length >= 2) {
      const result = searchResults[0]; // 첫 번째 검색 결과 사용
      handleSearchMovies(result); // 영화 검색 API 호출 후 결과 페이지로 이동
    } else {
      setSearchResults([]); // 검색어가 너무 짧으면 결과 초기화
    }
  };

  // 결과 클릭 시 영화 검색 API 호출 후 결과 페이지로 이동
  const handleResultClickWithState = (result) => {
    if (result) {
      setSearchTerm(result.title);
      fetchSearchMoviesResults(result.title) // 즉시 검색 API 호출
        .then((moviesResults) => {
          // 검색된 영화 결과를 상태에 저장
          setSearchResults(moviesResults);
          // 결과 페이지로 이동
          navigate(`/searchResults/${result.title}`, { state: { searchTerm: result.title, moviesResults } });

          // 검색어 초기화 및 검색창 닫기
          setSearchTerm("");   // 검색어 초기화
          setSearchResults([]); // 연관검색어 초기화
          setIsInputVisible(false); // 검색창 닫기
          setIsOpen(false);  // 연관검색어 닫기
        });
    }
  };

  // 영화 검색 API 호출
  const handleSearchMovies = (result) => {
    fetchSearchMoviesResults(searchTerm).then((moviesResults) => {
      // 검색된 영화 결과를 상태에 저장
      setSearchResults(moviesResults);
      // 결과 페이지로 이동
      navigate(`/searchResults/${searchTerm}`, { state: { searchTerm, moviesResults } });

      // 검색어 초기화 및 검색창 닫기
      setSearchTerm("");   // 검색어 초기화
      setSearchResults([]); // 연관검색어 초기화
      setIsInputVisible(false); // 검색창 닫기
      setIsOpen(false);  // 연관검색어 닫기
    });
  };

  // 결과 클릭 시 검색어 초기화 및 결과 닫기
  const handleResultClick = () => {
    setSearchTerm("");
    setSearchResults([]);  // 연관검색어 초기화
    setIsOpen(false);      // 연관검색어 창 닫기
  };

  // 아이콘 클릭 시 입력창 토글
  const handleIconClick = () => {
    setIsInputVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return {
    searchTerm,
    searchResults,
    isOpen,
    isInputVisible,
    handleSearchChange,
    handleSearchSubmit,  // 엔터키 처리 함수 반환
    handleResultClick,
    handleResultClickWithState,
    handleIconClick,
    searchRef,
  };
};

export default useSearch;
