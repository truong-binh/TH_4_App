# StudyManager — Thực hành 4: API & Offline Mode

Ứng dụng Quản lý học tập (React Native + Expo), nâng cấp từ Thực hành 3:
dữ liệu lấy từ REST API (json-server), dùng được khi **offline** và **tự đồng bộ**
khi có mạng trở lại.

## 1. Công nghệ

- React Native (Expo SDK 54)
- React Navigation (Bottom Tab + Native Stack)
- `@react-native-async-storage/async-storage` — cache + hàng đợi offline
- `@react-native-community/netinfo` — theo dõi trạng thái mạng
- `json-server@0.17.4` — mock API

## 2. Cách chạy

### Bước 1. Cài dependencies

```bash
npm install
```

### Bước 2. Chạy mock API (độ trễ giả lập 800 ms)

```bash
npm run server
# tương đương: json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```

### Bước 3. Cấu hình địa chỉ server

Mở `src/config.js` và chỉnh `BASE_URL`:

| Môi trường | BASE_URL |
|---|---|
| Máy ảo Android (emulator) | `http://10.0.2.2:3000` (mặc định) |
| Điện thoại thật + Expo Go | `http://<IP-LAN-của-máy-tính>:3000` |

> Điện thoại và máy tính phải **cùng mạng Wi-Fi**. Xem IP máy tính bằng
> `ipconfig` (Windows) — lấy địa chỉ IPv4 của card Wi-Fi.

### Bước 4. Chạy ứng dụng

```bash
npx expo start
```

Quét QR bằng Expo Go (điện thoại thật) hoặc nhấn `a` để mở máy ảo Android.

## 3. Sơ đồ luồng dữ liệu

```
┌──────────────┐      ┌──────────────────────────┐      ┌───────────────────┐
│   Màn hình   │ ───▶ │          Hook            │ ───▶ │      Service      │
│  (screens/)  │      │ useCachedQuery           │      │  (src/api/*.js)   │
│              │      │ useOutboxSync            │      │   dùng client.js  │
└──────────────┘      │ useNetworkStatus         │      └─────────┬─────────┘
       │              └──────┬──────────┬────────┘                │
       │                     │          │                         ▼
       │ đọc qua Context     ▼          ▼                 ┌──────────────┐
       └──────────── ┌────────────┐ ┌────────────┐  HTTP  │  json-server │
                     │   Cache    │ │   Outbox   │ ─────▶ │   (db.json)  │
                     │ (storage/) │ │ (storage/) │        └──────────────┘
                     └────────────┘ └────────────┘
```

- **Đọc (GET)** — chiến lược *cache trước, mạng sau*: màn hình hiển thị ngay dữ
  liệu trong AsyncStorage (`{ data, savedAt }`), sau đó gọi API để cập nhật;
  thành công thì ghi đè cache. Khi offline hiển thị "Cập nhật lần cuối: …".
- **Ghi (PATCH/POST)** — khi online gọi API trực tiếp (kèm *optimistic update*,
  lỗi thì hoàn tác); khi offline thao tác được ghi vào **outbox**
  (`{ id, method, url, body, createdAt }`) và mục đó mang nhãn **"Chưa đồng bộ"**.
- **Đồng bộ** — khi mạng chuyển offline → online, `useOutboxSync` gửi lần lượt
  các thao tác theo đúng thứ tự: thành công thì xóa khỏi hàng đợi, lỗi mạng thì
  dừng lại để thử lần sau. Xong hiện thông báo "Đã đồng bộ N thay đổi" và tải
  lại dữ liệu từ server.

## 4. Xử lý xung đột (B5)

Mỗi thao tác ghi offline lưu kèm `updatedAt` = thời điểm người dùng thao tác.
Khi đồng bộ một thao tác `PATCH`, ứng dụng:

1. `GET` bản ghi hiện tại trên server.
2. So sánh `updatedAt` của server với `updatedAt` trong thao tác offline.
3. Nếu **server mới hơn** (có người/nơi khác đã sửa sau khi mình offline):
   **ưu tiên dữ liệu server** — thao tác offline bị loại khỏi hàng đợi, không
   ghi đè, và ứng dụng hiện cảnh báo *"N thay đổi offline bị bỏ qua vì dữ liệu
   trên máy chủ mới hơn"*. Sau đó dữ liệu được tải lại từ server nên giao diện
   hiển thị đúng bản mới nhất.
4. Nếu thao tác offline mới hơn → gửi PATCH bình thường.

Cách này chọn quy tắc **"server wins theo updatedAt"**: đơn giản, không mất
dữ liệu của người sửa sau cùng trên server, và người dùng luôn được báo khi
thay đổi của mình bị bỏ qua.

## 5. Ghi chú cài đặt

- `useNetworkStatus` chỉ dựa vào `isConnected` (không dùng `isInternetReachable`)
  để trường hợp Wi-Fi LAN không có internet vẫn gọi được json-server.
- GPA hệ 4 có trọng số tín chỉ: `GPA = Σ(điểm hệ 4 × tín chỉ) / Σ(tín chỉ)`;
  môn điểm F vẫn tính vào GPA nhưng **không** tính vào tín chỉ tích lũy.
- Bài tập thêm mới khi offline có `id` tạm (`tmp_…`); sau khi đồng bộ, danh sách
  được tải lại từ server và nhận `id` thật.
- PATCH trùng URL trong outbox được gộp lại (toggle 2 lần cùng 1 bài khi offline
  chỉ sinh 1 thao tác với trạng thái cuối cùng).

## 6. Kịch bản kiểm thử (mục 6 đề bài)

1. **Tắt json-server, mở app lần đầu** → màn hình lỗi + nút "Thử lại", app không crash.
2. **Có mạng → bật máy bay → mở lại app** → vẫn thấy dữ liệu từ cache, banner
   "Bạn đang offline" + dòng "Cập nhật lần cuối".
3. **Offline: đánh dấu 2 bài xong + thêm 1 bài mới** → UI đổi ngay, các mục có
   nhãn "Chưa đồng bộ".
4. **Tắt máy bay** → tự đồng bộ, nhãn biến mất, `db.json` thay đổi đúng,
   thông báo "Đã đồng bộ 3 thay đổi".
5. **Offline sửa họ tên + sửa db.json với updatedAt mới hơn + bật mạng** →
   server wins, có cảnh báo xung đột (xem mục 4).
6. **Tìm môn không tồn tại / lọc học kỳ trống** → trạng thái rỗng thân thiện.
7. **Kéo để làm mới** trên các danh sách → dữ liệu tải lại.
