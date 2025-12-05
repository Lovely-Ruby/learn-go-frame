-- back-end/init.sql

-- 检查并创建 todo 表
CREATE TABLE IF NOT EXISTS `todo` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` VARCHAR(255) NOT NULL COMMENT '待办事项内容',
  `done` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否完成 0:未完成 1:已完成',
  `created_at` DATETIME NOT NULL COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='待办事项表';

-- 插入一些初始数据 (可选)
INSERT INTO `todo` (`title`, `done`, `created_at`, `updated_at`) VALUES
('完成企业级部署模拟', 1, NOW(), NOW()),
('修复 127.0.0.1 连接问题', 1, NOW(), NOW()),
('创建数据库初始化脚本', 0, NOW(), NOW());
