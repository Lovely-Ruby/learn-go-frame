-- 查看测试表的详细信息

USE todo_app_go_frame;

-- 1. 查看表的行数和大小
SELECT 
    table_name AS '表名',
    table_rows AS '行数（估算）',
    ROUND(data_length/1024/1024, 2) AS '数据大小(MB)',
    ROUND(index_length/1024/1024, 2) AS '索引大小(MB)',
    ROUND((data_length + index_length)/1024/1024, 2) AS '总大小(MB)',
    ROUND(index_length/(data_length + index_length) * 100, 2) AS '索引占比(%)'
FROM information_schema.TABLES
WHERE table_schema = 'todo_app_go_frame'
AND table_name LIKE 'test_todo%'
ORDER BY table_name;

-- 2. 查看精确的行数
SELECT 
    '无索引表' AS '表名',
    COUNT(*) AS '精确行数'
FROM test_todo_no_index
UNION ALL
SELECT 
    '有索引表' AS '表名',
    COUNT(*) AS '精确行数'
FROM test_todo_with_index;

-- 3. 查看索引详情
SELECT 
    '===== 无索引表的索引 =====' AS '';
    
SHOW INDEX FROM test_todo_no_index;

SELECT 
    '===== 有索引表的索引 =====' AS '';
    
SHOW INDEX FROM test_todo_with_index;

-- 4. 查看表结构
SELECT 
    '===== 表结构对比 =====' AS '';
    
SHOW CREATE TABLE test_todo_no_index\G
SHOW CREATE TABLE test_todo_with_index\G
