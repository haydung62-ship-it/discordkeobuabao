import { SlashCommandBuilder } from 'discord.js';

export const commandBuilders = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Xem danh sách trò chơi và lệnh của bot'),

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra bot có đang hoạt động hay không'),

  new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Chơi kéo - búa - bao với bot')
    .addStringOption((option) =>
      option
        .setName('chon')
        .setDescription('Lựa chọn của bạn')
        .setRequired(true)
        .addChoices(
          { name: '✂️ Kéo', value: 'keo' },
          { name: '🪨 Búa', value: 'bua' },
          { name: '📄 Bao', value: 'bao' },
        ),
    ),

  new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Trò chơi đoán số')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription('Bắt đầu một ván đoán số')
        .addStringOption((option) =>
          option
            .setName('do_kho')
            .setDescription('Chọn độ khó')
            .setRequired(true)
            .addChoices(
              { name: 'Dễ: 1–20', value: 'easy' },
              { name: 'Thường: 1–100', value: 'normal' },
              { name: 'Khó: 1–500', value: 'hard' },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('try')
        .setDescription('Nhập số bạn đoán')
        .addIntegerOption((option) =>
          option
            .setName('so')
            .setDescription('Số bạn muốn đoán')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(500),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stop').setDescription('Dừng ván đoán số hiện tại'),
    ),

  new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Trả lời một câu hỏi trắc nghiệm ngẫu nhiên'),

  new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Tung xúc xắc')
    .addIntegerOption((option) =>
      option
        .setName('mat')
        .setDescription('Số mặt của xúc xắc')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false),
    )
    .addIntegerOption((option) =>
      option
        .setName('so_luong')
        .setDescription('Số viên xúc xắc')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName('caro')
    .setDescription('Thách đấu cờ caro 3×3 với một thành viên')
    .addUserOption((option) =>
      option
        .setName('doi_thu')
        .setDescription('Người bạn muốn thách đấu')
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Xem hồ sơ trò chơi')
    .addUserOption((option) =>
      option
        .setName('thanh_vien')
        .setDescription('Để trống để xem hồ sơ của bạn')
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName('top')
    .setDescription('Xem bảng xếp hạng XP của server'),
];

export const commandData = commandBuilders.map((command) => command.toJSON());
