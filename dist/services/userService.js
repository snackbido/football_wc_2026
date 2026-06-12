"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBalance = exports.findUserById = exports.findUserByEmail = exports.getLeaderboard = exports.registerOrVerifyUser = void 0;
const User_1 = require("../models/User");
const emailService_1 = require("./emailService");
const cloudinaryService_1 = require("./cloudinaryService");
// ─────────────────────────────────────────────────────
//  HELPER: Sinh token theo format WC2026-XXXXXX
//  Ký tự hợp lệ: A-Z và 1-9 (loại bỏ số 0 tránh nhầm với O)
// ─────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const generateToken = () => {
    let suffix = "";
    for (let i = 0; i < 6; i++) {
        suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return `WC2026-${suffix}`;
};
// ─────────────────────────────────────────────────────
//  SERVICE: Đăng ký mới hoặc xác thực token
//
//  Logic:
//   1. Tìm user theo { name, email } trong DB
//   2a. Chưa tồn tại → sinh token → gửi email → lưu DB → "registered"
//   2b. Đã tồn tại + có token  → so sánh → "token_match" | "token_mismatch"
//   2c. Đã tồn tại + thiếu token              → "token_required"
// ─────────────────────────────────────────────────────
const registerOrVerifyUser = async (name, email, tokenInput, avatarUrl) => {
    const normEmail = email.trim().toLowerCase();
    const normName = name.trim();
    // Bước 1 – Tìm user theo cả name lẫn email
    const existingUser = await User_1.User.findOne({ name: normName, email: normEmail });
    // ── 2a: Chưa tồn tại → đăng ký mới ──────────────────
    if (!existingUser) {
        const newToken = generateToken();
        // Gửi email trước; nếu lỗi email thì không lưu DB
        await (0, emailService_1.sendTokenEmail)(normEmail, normName, newToken);
        let finalAvatar = avatarUrl || "default-avatar.png";
        if (avatarUrl && avatarUrl.startsWith("data:image/")) {
            try {
                finalAvatar = await (0, cloudinaryService_1.uploadImageToCloudinary)(avatarUrl);
            }
            catch (cloudinaryErr) {
                console.warn("Cloudinary upload failed during registration, using base64 fallback:", cloudinaryErr.message);
                finalAvatar = avatarUrl;
            }
        }
        const newUser = await User_1.User.create({
            name: normName,
            email: normEmail,
            token: newToken,
            avatar: finalAvatar,
        });
        return {
            status: "registered",
            user: newUser,
            message: `Đăng ký thành công! Token đã được gửi đến ${normEmail}.`,
        };
    }
    // ── 2c: Đã tồn tại nhưng chưa cung cấp token ─────────
    if (!tokenInput || tokenInput.trim() === "") {
        return {
            status: "token_required",
            message: "Tài khoản đã tồn tại. Vui lòng nhập token để đăng nhập.",
        };
    }
    // ── 2b: Đã tồn tại + so sánh token ───────────────────
    const isMatch = existingUser.token === tokenInput.trim();
    if (isMatch) {
        return {
            status: "token_match",
            user: existingUser,
            message: "Xác thực thành công! Chào mừng bạn quay lại.",
        };
    }
    return {
        status: "token_mismatch",
        message: "Token không đúng. Vui lòng kiểm tra lại trong email của bạn.",
    };
};
exports.registerOrVerifyUser = registerOrVerifyUser;
// ─────────────────────────────────────────────────────
//  SERVICE: Lấy bảng xếp hạng (balance giảm dần)
// ─────────────────────────────────────────────────────
const getLeaderboard = async () => {
    return User_1.User.find({})
        .select("name email avatar balance")
        .sort({ balance: -1 });
};
exports.getLeaderboard = getLeaderboard;
// ─────────────────────────────────────────────────────
//  SERVICE: Tìm user theo email
// ─────────────────────────────────────────────────────
const findUserByEmail = async (email) => {
    return User_1.User.findOne({ email: email.trim().toLowerCase() });
};
exports.findUserByEmail = findUserByEmail;
// ─────────────────────────────────────────────────────
//  SERVICE: Tìm user theo ID
// ─────────────────────────────────────────────────────
const findUserById = async (id) => {
    return User_1.User.findById(id);
};
exports.findUserById = findUserById;
// ─────────────────────────────────────────────────────
//  SERVICE: Cập nhật balance (cộng / trừ)
// ─────────────────────────────────────────────────────
const updateUserBalance = async (userId, amount) => {
    return User_1.User.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });
};
exports.updateUserBalance = updateUserBalance;
