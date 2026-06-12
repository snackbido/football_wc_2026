import { User, IUser } from "../models/User";
import { sendTokenEmail } from "./emailService";
import { uploadImageToCloudinary } from "./cloudinaryService";

// ─────────────────────────────────────────────────────
//  HELPER: Sinh token theo format WC2026-XXXXXX
//  Ký tự hợp lệ: A-Z và 1-9 (loại bỏ số 0 tránh nhầm với O)
// ─────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

const generateToken = (): string => {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `WC2026-${suffix}`;
};

// ─────────────────────────────────────────────────────
//  TYPE: Kết quả trả về của registerOrVerifyUser
// ─────────────────────────────────────────────────────
export type RegisterResult =
  | { status: "registered"; user: IUser; message: string }
  | { status: "token_match"; user: IUser; message: string }
  | { status: "token_mismatch"; message: string }
  | { status: "token_required"; message: string };

// ─────────────────────────────────────────────────────
//  SERVICE: Đăng ký mới hoặc xác thực token
//
//  Logic:
//   1. Tìm user theo { name, email } trong DB
//   2a. Chưa tồn tại → sinh token → gửi email → lưu DB → "registered"
//   2b. Đã tồn tại + có token  → so sánh → "token_match" | "token_mismatch"
//   2c. Đã tồn tại + thiếu token              → "token_required"
// ─────────────────────────────────────────────────────
export const registerOrVerifyUser = async (
  name: string,
  email: string,
  tokenInput?: string,
  avatarUrl?: string
): Promise<RegisterResult> => {
  const normEmail = email.trim().toLowerCase();
  const normName  = name.trim();

  // Bước 1 – Tìm user theo cả name lẫn email
  const existingUser = await User.findOne({ name: normName, email: normEmail });

  // ── 2a: Chưa tồn tại → đăng ký mới ──────────────────
  if (!existingUser) {
    const newToken = generateToken();

    // Gửi email trước; nếu lỗi email thì không lưu DB
    await sendTokenEmail(normEmail, normName, newToken);

    let finalAvatar = avatarUrl || "default-avatar.png";
    if (avatarUrl && avatarUrl.startsWith("data:image/")) {
      try {
        finalAvatar = await uploadImageToCloudinary(avatarUrl);
      } catch (cloudinaryErr: any) {
        console.warn("Cloudinary upload failed during registration, using base64 fallback:", cloudinaryErr.message);
        finalAvatar = avatarUrl;
      }
    }

    const newUser = await User.create({
      name:  normName,
      email: normEmail,
      token: newToken,
      avatar: finalAvatar,
    });

    return {
      status:  "registered",
      user:    newUser,
      message: `Đăng ký thành công! Token đã được gửi đến ${normEmail}.`,
    };
  }

  // ── 2c: Đã tồn tại nhưng chưa cung cấp token ─────────
  if (!tokenInput || tokenInput.trim() === "") {
    return {
      status:  "token_required",
      message: "Tài khoản đã tồn tại. Vui lòng nhập token để đăng nhập.",
    };
  }

  // ── 2b: Đã tồn tại + so sánh token ───────────────────
  const isMatch = existingUser.token === tokenInput.trim();

  if (isMatch) {
    return {
      status:  "token_match",
      user:    existingUser,
      message: "Xác thực thành công! Chào mừng bạn quay lại.",
    };
  }

  return {
    status:  "token_mismatch",
    message: "Token không đúng. Vui lòng kiểm tra lại trong email của bạn.",
  };
};

// ─────────────────────────────────────────────────────
//  SERVICE: Lấy bảng xếp hạng (balance giảm dần)
// ─────────────────────────────────────────────────────
export const getLeaderboard = async (): Promise<IUser[]> => {
  return User.find({})
    .select("name email avatar balance")
    .sort({ balance: -1 });
};

// ─────────────────────────────────────────────────────
//  SERVICE: Tìm user theo email
// ─────────────────────────────────────────────────────
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.trim().toLowerCase() });
};

// ─────────────────────────────────────────────────────
//  SERVICE: Tìm user theo ID
// ─────────────────────────────────────────────────────
export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

// ─────────────────────────────────────────────────────
//  SERVICE: Cập nhật balance (cộng / trừ)
// ─────────────────────────────────────────────────────
export const updateUserBalance = async (
  userId: string,
  amount: number
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );
};
