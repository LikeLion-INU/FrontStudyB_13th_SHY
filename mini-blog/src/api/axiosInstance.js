import axios from 'axios';

/**
 * Axios 인스턴스 설정
 * 
 * baseURL과 인증 토큰을 자동으로 포함하는 axios 인스턴스를 생성합니다.
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API 요청 로깅 함수
 * 
 * API 요청 정보를 콘솔에 기록합니다.
 * @param {Object} config - 요청 구성 객체
 */
const logRequest = (config) => {
  console.group(`%c🚀 API 요청: ${config.method.toUpperCase()} ${config.url}`, 'color: #2196F3; font-weight: bold;');
  console.log('\u2022 요청 URL:', `${config.baseURL}${config.url}`);
  console.log('\u2022 요청 메서드:', config.method.toUpperCase());
  console.log('\u2022 요청 헤더:', config.headers);
  
  if (config.params) {
    console.log('\u2022 요청 파라미터:', config.params);
  }
  
  if (config.data) {
    console.log('\u2022 요청 데이터:', config.data);
  }
  
  console.groupEnd();
  return config;
};

/**
 * API 응답 로깅 함수
 * 
 * API 응답 정보를 콘솔에 기록합니다.
 * @param {Object} response - 응답 객체
 */
const logResponse = (response) => {
  console.group(`%c✅ API 응답: ${response.config.method.toUpperCase()} ${response.config.url}`, 'color: #4CAF50; font-weight: bold;');
  console.log('\u2022 상태 코드:', response.status);
  console.log('\u2022 응답 데이터:', response.data);
  console.groupEnd();
  return response;
};

/**
 * API 오류 로깅 함수
 * 
 * API 오류 정보를 콘솔에 기록합니다.
 * @param {Object} error - 오류 객체
 */
const logError = (error) => {
  console.group('%c❌ API 오류', 'color: #FF5252; font-weight: bold;');
  
  if (error.response) {
    // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
    console.log('\u2022 상태 코드:', error.response.status);
    console.log('\u2022 응답 데이터:', error.response.data);
    console.log('\u2022 응답 헤더:', error.response.headers);
  } else if (error.request) {
    // 요청이 이뤄졌지만 응답을 받지 못한 경우
    console.log('\u2022 요청 정보:', error.request);
  } else {
    // 요청 설정 중 오류가 발생한 경우
    console.log('\u2022 오류 메시지:', error.message);
  }
  
  console.log('\u2022 오류 구성:', error.config);
  console.groupEnd();
  
  return Promise.reject(error);
};

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    // 토큰이 존재하면 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 요청 로깅
    return logRequest(config);
  },
  (error) => {
    // 요청 오류 로깅
    return logError(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 로깅
    return logResponse(response);
  },
  (error) => {
    // 응답 오류 로깅
    return logError(error);
  }
);

export default axiosInstance;
