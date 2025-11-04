import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import MyPagePage from "./page/mypage/MyPagePage";
import HomePage from "./page/home/HomePage";
import SearchResults from "./page/search/SearchResultsPage";
import DetailModal from "./components/detail/DetailModal";

import "./App.css";
function App() {
  
  return (
    <Router>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail" element={<DetailModal />} />
          <Route path="/mypage" element={<MyPagePage />} />
          <Route path="/searchResults/:id" element={<SearchResults />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
