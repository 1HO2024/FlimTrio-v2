import sys
import re
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

okt = Okt()
# 한글 불용어 리스트 
KOREAN_STOPWORDS = ['이', '그', '저', '것', '등', '도', '은', '는', '이랑', '랑', '들', '가', '을', '를', '에', '에서', '와', '과']

# 형태소 분석기를 위한 함수 (Okt 사용)
def preprocess_korean_text(text):

    # 텍스트에서 한글과 공백만 남기기
    text = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣\s]', '', text)
    
    # 형태소 분석을 통해 명사만 추출 (불용어 제외)
    words = okt.nouns(text)
    filtered_words = [word for word in words if word not in KOREAN_STOPWORDS and len(word) > 1]  # 길이가 1인 단어 제외

    return ' '.join(filtered_words)

def analyze_text(user_movie_description, movie_descriptions):
    # 사용자 영화 설명과 다른 영화 설명을 합침
    all_movie_descriptions = [user_movie_description] + movie_descriptions

    # 한글 텍스트 전처리: 형태소 분석 
    processed_descriptions = [preprocess_korean_text(description) for description in all_movie_descriptions]
    
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(processed_descriptions)

    #유사도(줄거리)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    cosine_similarities = np.clip(cosine_similarities, 0, 1)
    return cosine_similarities[0]

def analyze_keywords(user_keywords, movie_keywords):

    user_keywords_str = ' '.join(user_keywords)
    movie_keywords_str = [' '.join(keywords) for keywords in movie_keywords]

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([user_keywords_str] + movie_keywords_str)

    #유사도(키워드)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    cosine_similarities = np.clip(cosine_similarities, 0, 1)
    return cosine_similarities[0]

def analyze_titles(user_title, movie_titles):

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([user_title] + movie_titles)

    #유사도(제목)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    cosine_similarities = np.clip(cosine_similarities, 0, 1)
    return cosine_similarities[0]

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read().strip()
            movie_overviews = content.split("===") 
            movie_overviews = [overview.strip() for overview in movie_overviews if overview.strip()]
            return movie_overviews
    except FileNotFoundError:
        print(f" {file_path}못찾음")
        return []
    except Exception as e:
        print(f"에러임 {file_path}: {e}")
        return []

def process_movie_data(movie_data, keywords_data):

    processed_data = []
    for movie, keywords in zip(movie_data, keywords_data):
        try:
            title = movie.get("title", "").strip()
            description = movie.get("overview", "").strip()
            
            keywords_text = ' '.join(keywords).strip() if keywords else ''
            
            # 키워드 X = 유사도 계산에서 제외
            if not keywords_text:
                # 키워드가 없으면 제목과 설명
                combined_text = f"Title: {title} Description: {description}"
            else:
                # 키워드가 있으면 제목, 설명, 키워드
                combined_text = f"Title: {title} Description: {description} Keywords: {keywords_text}"
            
            processed_data.append(combined_text)
        except Exception as e:
            print(f"에러: {movie} - {e}")
    return processed_data

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)

    user_movie_overview_file = sys.argv[1]  
    movie_overviews_file = sys.argv[2]  

    # 파일에서 실제 텍스트 내용을 읽어옴
    user_movie_overview_list = read_file(user_movie_overview_file)
    if not user_movie_overview_list:
        print("선택한 영화 데이터 없음")
        sys.exit(1)

    user_movie_overview = user_movie_overview_list[0] 
    movie_overviews = read_file(movie_overviews_file)
    if not movie_overviews:
        print("필터링 해서 가져온 영화데이터없음")
        sys.exit(1)

    movie_data = []
    keywords_data = [] 
    movie_titles = [] 

    for movie_overview in movie_overviews:
        movie_info = movie_overview.split("\n")
        if len(movie_info) >= 2: 
            title = movie_info[0].replace("title:", "").strip()
            overview = movie_info[1].replace("overview:", "").strip()
            
            # 키워드 처리
            keywords = movie_info[2].replace("keywords:", "").strip().split(",") if len(movie_info) > 2 else []
            movie_data.append({"title": title, "overview": overview})
            keywords_data.append(keywords)
            movie_titles.append(title)

    user_movie_info = user_movie_overview.split("\n")
    if len(user_movie_info) >= 2:  
        user_title = user_movie_info[0].replace("title:", "").strip()
        user_overview = user_movie_info[1].replace("overview:", "").strip()
        user_movie_data = {"title": user_title, "overview": user_overview}
        user_keywords = user_movie_info[2].replace("keywords:", "").strip().split(",") if len(user_movie_info) > 2 else []
    else:
        print("유저선택한 영화정보 없음")
        sys.exit(1)

    # 영화 데이터를 전처리하여 분석에 사용할 텍스트 준비
    processed_movies = process_movie_data(movie_data, keywords_data)
    processed_user_movie = process_movie_data([user_movie_data], [user_keywords])[0]
    if not processed_user_movie or not processed_movies:
        print("유사도계산할 유저선택 데이터가없음 ~")
        sys.exit(1)

    # 유사도 계산
    keyword_similarities = analyze_keywords(user_keywords, keywords_data)
    title_similarities = analyze_titles(user_title, movie_titles)
    content_similarities = analyze_text(processed_user_movie, processed_movies)

    # 가중치 키워드 4 : 제목 2 : 줄거리4
    final_similarities = 0.4 * keyword_similarities + 0.3 * title_similarities + 0.3 * content_similarities

    # 높은순
    top_10_indices = np.argsort(final_similarities)[::-1][:10]

    for i, idx in enumerate(top_10_indices):
        print(f"Rank {i+1}")
        print(f"data:{movie_data[idx]['title']}")