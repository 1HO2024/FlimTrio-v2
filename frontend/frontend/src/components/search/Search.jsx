import { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import useSearch from "../../hooks/search/useSearch";
import "../../style/search/Search.css";

const Search = () => {
  const {
    searchTerm,
    searchResults,
    isOpen,
    isInputVisible,
    handleSearchChange,
    handleSearchSubmit,
    handleResultClickWithState,
    handleIconClick,
  } = useSearch();

  // 검색창을 참조하는 ref
  const searchRef = useRef(null);
  const resultsRef = useRef(null); // 검색 결과 영역을 위한 ref

  // 외부 클릭 시 검색어 지우고 검색창 닫기
  const handleIconClickWithClear = () => {
    if (isInputVisible && searchTerm.length > 0) {
      handleSearchChange({ target: { value: "" } });
    }
    handleIconClick(); 
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) && // 검색창 외부
        resultsRef.current && !resultsRef.current.contains(event.target) // 검색 결과 외부
      ) {
        // 검색창 밖을 클릭했을 때
        handleSearchChange({ target: { value: "" } });  // 검색어 초기화
        handleIconClick();  // 검색창 닫기
      }
    };

    // 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form className="searchForm" onSubmit={handleSearchSubmit}>
      <div
        ref={searchRef}  // 검색창을 감싸는 div에 ref 설정
        className={`searchInputWrapper ${
          isInputVisible ? "visible" : "hidden"
        } ${!isInputVisible ? "initial" : ""}`}
      >
        {isInputVisible && (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="영화를 검색해주세요."
              className="searchInput"
            />
            <FaSearch className="searchIcon" onClick={handleIconClickWithClear} />
          </>
        )}
        {!isInputVisible && (
          <FaSearch
            className="searchIcon"
            style={{ fontSize: "24px" }}
            onClick={handleIconClickWithClear}
          />
        )}
      </div>

      {/* 검색 결과가 열려있는 경우 */}
      {isOpen && (
        <ul ref={resultsRef} className="searchResults">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <li key={index} className="searchResultItem">
                <span
                  className="searchLink"
                  onClick={() => handleResultClickWithState(result)} // 클릭 시 API 호출 후 결과 페이지로 이동
                >
                  {result.title}
                </span>
              </li>
            ))
          ) : (
            <li className="noResults">검색 결과가 없습니다.</li>
          )}
        </ul>
      )}
    </form>
  );
};

export default Search;
