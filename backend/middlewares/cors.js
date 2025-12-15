
export const corsOptions = {
  origin: 'http://localhost:5173', // Chỉ cho phép Frontend từ Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ], // Các phương thức được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers được phép
  credentials: true, // Cho phép gửi cookie hoặc credentials
};

