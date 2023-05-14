Mô tả:
1. Sử dụng thư viện next-i18next. Tạo folder public/locales cho các mã ngôn ngữ, set up i18next config trong file next-i18next.config. 
Trang web đã ngôn ngữ, dịch theo các file json được định nghĩa sẵn, để truy cập vào trang với ngôn ngữ thì truy cập vào path 'website-name/{mã ngôn ngữ tương ứng}'.
2. Định nghĩa file request để call api, các phương thức trong useAuth để store token và refresh token vào cookie.
set token: Đăng nhập -> lấy token từ response -> set token vào cookie. Mỗi lần gọi các api khác, sử dụng phương thức privateRequest đã được định nghĩa để call api với token.
refresh token: Trong trong phương thức request sẽ sử dụng TokenManager từ thư viện brainless-token-manager để lấy token call api, đồng thời cũng cài đặt các phương thức onInvalidRefreshToken() để kiểm tra refresh token, executeRefreshToken() để thực hiện refresh token, lấy token và refresh token mới nếu token cũ hết hạn.
3. Config file Dockerfile để tạo môi trường chung khi build project. Chia thành 3 stage: base, build, production
4. Sử dụng thư viện @react-google-maps/api. Gen api key trên gg map playform. Sử dụng component <GoogleMap> để gen map, <Marker> để vẽ marker theo lat, lng, <Circle> để vẽ hình tròn. Cách làm tạo 1 state marker, trong event onCLick vào gg map sẽ setState marker và truyền vào <Marker> và <Circle>.