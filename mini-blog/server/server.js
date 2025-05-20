const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');
const path = require('path');

// 서버 생성
const server = jsonServer.create();

// 미들웨어 설정
server.use(cors());
server.use(jsonServer.bodyParser);

// 기본 json-server 라우터 설정
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// ✅ 필수: json-server-auth가 작동하기 위해 app.db에 router.db를 연결
server.db = router.db;

// json-server-auth 규칙 설정
const rules = auth.rewriter({
  // 사용자는 자신의 리소스만 수정/삭제 가능
  users: 600,
  // 인증된 사용자만 posts에 접근 가능
  posts: 660
});

// 라우트에 규칙 적용
server.use(rules);
server.use(auth);
server.use(router);

// 서버 시작
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on http://localhost:${PORT}`);
});
