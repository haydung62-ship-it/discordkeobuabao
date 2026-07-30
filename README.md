# Discord Game Bot — Railway 24/7

Bot Discord trò chơi bằng **Node.js + discord.js**, sử dụng slash commands và được cấu hình sẵn để triển khai trên Railway.

## Trò chơi và chức năng

| Lệnh | Chức năng |
|---|---|
| `/help` | Xem danh sách lệnh |
| `/ping` | Kiểm tra trạng thái và độ trễ bot |
| `/rps` | Chơi kéo – búa – bao với bot |
| `/guess start` | Bắt đầu trò đoán số |
| `/guess try` | Nhập số dự đoán |
| `/guess stop` | Dừng ván đoán số |
| `/quiz` | Trả lời câu hỏi trắc nghiệm bằng nút |
| `/dice` | Tung 1–10 viên xúc xắc, 2–100 mặt |
| `/caro` | Thách đấu caro 3×3 với thành viên khác |
| `/profile` | Xem XP, xu và thành tích |
| `/top` | Xem bảng xếp hạng của server |

Bot chỉ dùng intent `Guilds`; không cần bật Message Content Intent.

---

## 1. Tạo bot trong Discord Developer Portal

1. Mở **Discord Developer Portal** và chọn **New Application**.
2. Vào mục **Bot** → tạo bot → chọn **Reset Token**.
3. Sao chép token và lưu kín. Không gửi token cho người khác và không đưa vào GitHub.
4. Vào **General Information**, sao chép **Application ID**. Đây là `CLIENT_ID`.
5. Vào **Installation** hoặc **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`.
   - Quyền tối thiểu: View Channels, Send Messages, Embed Links, Read Message History.
6. Mở URL cài đặt và thêm bot vào server.

### Lấy GUILD_ID để thử nghiệm

1. Discord → User Settings → Advanced → bật **Developer Mode**.
2. Nhấp phải vào biểu tượng server → **Copy Server ID**.
3. Dùng ID đó làm biến `GUILD_ID` để slash commands cập nhật nhanh trong server thử nghiệm.

---

## 2. Chạy thử trên máy

Yêu cầu Node.js theo phiên bản được ghi trong `package.json`.

```bash
npm install
```

Sao chép `.env.example` thành `.env`, sau đó điền:

```env
DISCORD_TOKEN=token_bot_cua_ban
CLIENT_ID=application_id_cua_bot
GUILD_ID=id_server_thu_nghiem
AUTO_REGISTER_COMMANDS=true
DATA_DIR=./data
PORT=3000
```

Chạy bot:

```bash
npm run dev
```

Kiểm tra:

```text
http://localhost:3000/health
```

---

## 3. Triển khai trên Railway

### Cách dễ nhất: GitHub

1. Tạo một repository GitHub mới.
2. Tải toàn bộ mã nguồn trong thư mục này lên repository.
3. Railway → **New Project** → **Deploy from GitHub Repo**.
4. Chọn repository vừa tạo.
5. Trong service Railway, mở tab **Variables** và thêm:

```env
DISCORD_TOKEN=token_bot_cua_ban
CLIENT_ID=application_id_cua_bot
GUILD_ID=id_server_thu_nghiem
AUTO_REGISTER_COMMANDS=true
DATA_DIR=/data
```

6. Railway sẽ tự chạy `npm start` theo `railway.json`.
7. Khi log hiện dòng `Đã đăng nhập`, bot đã online.

### Lưu điểm và xu lâu dài

Nếu không gắn Volume, dữ liệu có thể mất khi service được triển khai lại.

1. Thêm Railway Volume cho service.
2. Mount path: `/data`.
3. Đặt biến:

```env
DATA_DIR=/data
```

Dữ liệu sẽ được lưu tại `/data/users.json`.

### Chạy liên tục

- Giữ service ở trạng thái hoạt động và tắt App Sleep nếu tài khoản của bạn có tùy chọn này.
- Tài khoản Railway phải còn hạn mức sử dụng hoặc gói thanh toán phù hợp.
- File `railway.json` đã cấu hình healthcheck `/health` và restart policy `ALWAYS`.

---

## 4. Đăng ký slash commands

Mặc định bot tự đăng ký lệnh khi khởi động vì:

```env
AUTO_REGISTER_COMMANDS=true
```

- Có `GUILD_ID`: lệnh được đăng ký riêng cho server thử nghiệm.
- Không có `GUILD_ID`: lệnh được đăng ký toàn cục cho các server đã cài bot.

Khi đã hoàn thiện bot, bạn có thể xóa biến `GUILD_ID` để dùng lệnh toàn cục.

---

## 5. Cấu trúc dự án

```text
.
├── src/
│   ├── index.js       # Bot, trò chơi, nút bấm, health server
│   ├── commands.js    # Định nghĩa slash commands
│   └── store.js       # Lưu XP, xu và bảng xếp hạng
├── .env.example
├── .gitignore
├── package.json
├── railway.json
└── README.md
```

---

## 6. Bảo mật

- Không ghi token trực tiếp vào mã nguồn.
- Không tải file `.env` lên GitHub.
- Nếu token bị lộ, vào Discord Developer Portal và **Reset Token** ngay.
- Chỉ đặt bí mật trong Railway Variables.

## Tài liệu chính thức

- [Discord — Interactions & Commands](https://docs.discord.com/developers/platform/interactions)
- [Discord — Building your first bot](https://docs.discord.com/developers/quick-start/getting-started)
- [Railway — Variables](https://docs.railway.com/variables)
- [Railway — Config as Code](https://docs.railway.com/config-as-code/reference)
- [Railway — Healthchecks](https://docs.railway.com/deployments/healthchecks)

## Khắc phục Railway Healthcheck

Bản này tách hai endpoint:

- `/health`: liveness, luôn trả `200` khi tiến trình Node đang chạy; dùng làm Railway Healthcheck Path.
- `/ready`: readiness, chỉ trả `200` khi bot đã kết nối Discord.

Không tự tạo biến `PORT`; Railway tự cấp và mã nguồn đã lắng nghe tại `0.0.0.0:$PORT`.
