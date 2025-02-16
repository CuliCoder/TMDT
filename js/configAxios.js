import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';

// Tạo một instance của Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Thay đổi thành URL cơ sở của API
  timeout: 10000, // Thời gian chờ tối đa cho mỗi request
  headers: {
    'Content-Type': 'application/json',
    // Thêm các headers khác nếu cần
  },
});

// Thêm interceptor cho request (tùy chọn)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Thực hiện các thao tác trước khi gửi request, ví dụ: thêm token vào header
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Thêm interceptor cho response (tùy chọn)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Xử lý response trước khi trả về
//     return response;
//   },
//   (error) => {
//     // Xử lý lỗi response
//     return Promise.reject(error);
//   }
// );

// Export instance của Axios để sử dụng trong các module khác
export default axiosInstance;