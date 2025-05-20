# 미니 블로그 프로젝트

## 프로젝트 소개

JWT 기반 인증 처리, 권한 분기 처리, axios 인스턴스 설정이 포함된 미니 블로그 프로젝트입니다.

## 주요 기능

- JWT 기반 로그인/회원가입 기능
- 토큰을 localStorage에 저장하고 axios 요청 시 자동 포함
- 글 작성자에게만 수정/삭제 버튼 표시 (권한 분기 처리)
- 로그인 상태 전역 관리 (Context API 사용)

## 프로젝트 구조

```
mini-blog/
├── client/ (React 앱)
│   ├── src/
│   │   ├── api/axiosInstance.js           // axios 인스턴스 설정
│   │   ├── context/
│   │   │   ├── AuthContext.js             // 인증 상태 관리
│   │   │   └── BlogContext.js             // 블로그 상태 관리
│   │   ├── components/
│   │   │   ├── page/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginPage.jsx      // 로그인 페이지
│   │   │   │   │   └── SignupPage.jsx     // 회원가입 페이지
│   │   │   │   ├── MainPage.jsx           // 메인 페이지
│   │   │   │   ├── PostWritePage.jsx      // 글 작성 페이지
│   │   │   │   ├── PostEditPage.jsx       // 글 수정 페이지
│   │   │   │   └── PostViewPage.jsx       // 글 상세 페이지
│   │   │   ├── list/
│   │   │   │   ├── PostList.jsx           // 포스트 목록 컴포넌트
│   │   │   │   └── PostItem.jsx           // 개별 포스트 컴포넌트
│   │   │   └── ui/
│   │   │       ├── Button.jsx             // 버튼 컴포넌트
│   │   │       └── TextInput.jsx          // 입력 필드 컴포넌트
│   │   └── App.js                         // 라우팅 설정
└── server/
    ├── db.json                           // 데이터베이스 파일
    └── server.js                         // json-server-auth 설정
```

# 시작하기

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 설치 및 실행 방법

### 클라이언트 설치

```bash
npm install
```

### 서버 설치

```bash
cd server
npm install
```

### 서버 실행

```bash
cd server
npm start
```

서버는 http://localhost:8000 에서 실행됩니다.

### 클라이언트 실행

```bash
npm start
```

클라이언트는 http://localhost:3000 에서 실행됩니다.

## 주요 API 엔드포인트

| 기능   | Method | Endpoint        | 설명                |
| ---- | ------ | --------------- | ----------------- |
| 회원가입 | POST   | /register       | 이메일, 비밀번호 전달      |
| 로그인  | POST   | /login          | JWT 토큰 + 유저 정보 응답 |
| 글 목록 | GET    | /660/posts      | 로그인 필요            |
| 글 작성 | POST   | /660/posts      | 토큰 + userId 필요    |
| 글 수정 | PUT    | /660/posts/:id | 본인만 가능            |
| 글 삭제 | DELETE | /660/posts/:id | 본인만 가능            |

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어를 실행할 수 있습니다:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
