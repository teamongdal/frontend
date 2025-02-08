# 🛍️ Ongdal Frontend

---

## 🚀 프로젝트 시작하기

### 1️⃣ **필수 요구사항**
아래 환경이 설정되어 있어야 프로젝트를 실행 가능:
- [Node.js](https://nodejs.org/) (LTS 버전 추천)
- [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 2️⃣ **프로젝트 설치**
```sh
# 1. 레포지토리 클론
git clone <레포지토리_주소>
cd frontend

# 2. 의존성 설치
yarn install

# 3. 프로젝트 실행 Expo
yarn start
실행 후 w 클릭 > http://localhost:8081에서 실행 가능
```

frontend/
│── src/                # 프로젝트 소스 코드
│   ├── api/            # API 요청 관련 코드
│   ├── assets/         # 이미지 및 정적 파일
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   │   ├── atom/       # 작은 단위의 UI 요소
│   │   ├── molecule/   # 조금 더 복잡한 UI 요소
│   │   ├── page/       # 주요 페이지 컴포넌트
│   ├── styles/         # 스타일 파일
│   ├── hooks/          # 커스텀 훅
│   ├── services/       # 
│── .expo/              # Expo 설정
│── package.json        # 프로젝트 메타데이터 및 의존성 목록
│── yarn.lock           # 패키지 버전 고정 파일
│── app.json            # Expo 앱 설정 파일
