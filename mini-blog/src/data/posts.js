// 블로그 포스트 데이터
const posts = [
  {
    id: 1,
    title: "리액트 입문",
    content: "리액트는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 리액트는 상태 기반 UI를 효율적으로 렌더링하고, 컴포넌트 기반 아키텍처를 통해 코드 재사용성을 높입니다.",
    author: "성호영",
    createdAt: new Date(2025, 4, 10).toISOString(),
    comments: [
      {
        id: 1,
        content: "정말 유익한 글이네요!",
        author: "방문자1",
        createdAt: new Date(2025, 4, 11).toISOString(),
      },
      {
        id: 2,
        content: "리액트 너무 재밌어요",
        author: "방문자2",
        createdAt: new Date(2025, 4, 12).toISOString(),
      },
    ],
  },
  {
    id: 2,
    title: "styled-components 활용하기",
    content: "styled-components는 React 컴포넌트 시스템의 스타일링을 위한 라이브러리입니다. CSS-in-JS 접근 방식을 사용하여 컴포넌트에 스타일을 직접 적용할 수 있습니다. 이를 통해 스타일과 컴포넌트 로직을 함께 관리할 수 있어 유지보수가 용이합니다.",
    author: "성호영",
    createdAt: new Date(2025, 4, 12).toISOString(),
    comments: [],
  },
  {
    id: 3,
    title: "React Router 사용법",
    content: "React Router는 React 애플리케이션에서 클라이언트 사이드 라우팅을 구현하기 위한 라이브러리입니다. 이를 통해 단일 페이지 애플리케이션(SPA)에서 여러 페이지를 구현할 수 있습니다.",
    author: "성호영",
    createdAt: new Date(2025, 4, 13).toISOString(),
    comments: [
      {
        id: 1,
        content: "라우터 설명 감사합니다!",
        author: "방문자3",
        createdAt: new Date(2025, 4, 13).toISOString(),
      },
    ],
  },
];

export default posts;
