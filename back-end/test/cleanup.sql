-- 清理索引性能测试生成的表

USE todo_app_go_frame;

-- 删除测试表
DROP TABLE IF EXISTS test_todo_no_index;
DROP TABLE IF EXISTS test_todo_with_index;

-- 显示剩余的表
SHOW TABLES;

SELECT '测试表已清理完成' AS message;
