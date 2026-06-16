-- 查看测试表的大小（更新统计信息后）

USE todo_app_go_frame;

-- 1. 先更新统计信息（重要！）
ANALYZE TABLE test_todo_no_index, test_todo_with_index;

-- 2. 查看表的行数和大小
SELECT 
    table_name AS '表名',
    table_rows AS '行数',
    ROUND(data_length/1024/1024, 2) AS '数据(MB)',
    ROUND(index_length/1024/1024, 2) AS '索引(MB)',
    ROUND((data_length + index_length)/1024/1024, 2) AS '总计(MB)',
    ROUND(index_length/data_length * 100, 2) AS '索引占比(%)'
FROM information_schema.TABLES
WHERE table_schema = 'todo_app_go_frame'
AND table_name LIKE 'test_todo%'
ORDER BY table_name;

-- 3. 查看精确的行数
SELECT 
    '无索引表' AS '表名',
    COUNT(*) AS '实际行数'
FROM test_todo_no_index
UNION ALL
SELECT 
    '有索引表' AS '表名',
    COUNT(*) AS '实际行数'
FROM test_todo_with_index;

-- 4. 查看每个索引的详情
SELECT 
    TABLE_NAME AS '表名',
    INDEX_NAME AS '索引名',
    COLUMN_NAME AS '列名',
    SEQ_IN_INDEX AS '列顺序',
    CARDINALITY AS '基数',
    INDEX_TYPE AS '索引类型'
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'todo_app_go_frame'
AND TABLE_NAME LIKE 'test_todo%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
