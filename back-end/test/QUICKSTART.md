## 🎯 快速开始指南

### 适合谁？
- 🎨 前端开发者，想学习后端 GoFrame
- 📚 对数据库索引概念感到困惑
- 💡 想看看索引的实际性能差异

### 5 分钟快速运行

#### 方式一：使用脚本（推荐）

```bash
cd back-end/test
./run_test.sh
```

#### 方式二：直接运行

```bash
cd back-end/test

# 修改 config.yaml 配置数据库连接
# 然后运行
go run index_performance.go
```

### 配置说明

编辑 `config.yaml`：

```yaml
database:
  default:
    # 本地开发
    link: "mysql:root:你的密码@tcp(127.0.0.1:3306)/todo_app_go_frame?charset=utf8mb4"
    
    # Docker 环境
    # link: "mysql:gouser:gopassword@tcp(db:3306)/todo_db?charset=utf8mb4"
```

### 常见问题速查

| 问题 | 解决方案 |
|------|---------|
| 连接不上数据库 | 检查 config.yaml 中的数据库配置 |
| 插入太慢 | 减少 TotalRecords 到 50 万或 10 万 |
| 内存不足 | 降低数据量或增加批次大小 |
| 想清理测试数据 | 运行 `mysql < cleanup.sql` |

### 调整数据量

如果机器性能有限，可以编辑 `index_performance.go`：

```go
const (
    TotalRecords = 500000  // 改为 50 万
    BatchSize = 10000
)
```

### 预期耗时

| 数据量 | 插入时间 | 总耗时 |
|--------|---------|--------|
| 10 万  | ~30 秒  | ~2 分钟 |
| 50 万  | ~2 分钟 | ~5 分钟 |
| 100 万 | ~5 分钟 | ~10 分钟 |

*实际时间取决于机器性能和数据库配置*

### 看到什么？

测试会展示 6 种常见查询场景：

1. ✅ **精确查询** - WHERE user_id = 5000
2. ✅ **状态过滤** - WHERE done = 1
3. ✅ **联合查询** - WHERE user_id = 5000 AND done = 1
4. ✅ **排序查询** - ORDER BY priority
5. ✅ **范围查询** - WHERE created_at >= 某个日期
6. ✅ **聚合查询** - COUNT(*)

每个场景都会对比有索引和无索引的性能差异。

### 进阶玩法

#### 1. 查看执行计划

```bash
# 进入 MySQL
mysql -u root -p

USE todo_app_go_frame;

# 查看无索引表的执行计划
EXPLAIN SELECT * FROM test_todo_no_index WHERE user_id = 5000;

# 查看有索引表的执行计划
EXPLAIN SELECT * FROM test_todo_with_index WHERE user_id = 5000;
```

关注 `type` 列：
- `ALL` = 全表扫描（慢）😱
- `ref` = 使用索引（快）🚀

#### 2. 添加自己的测试场景

编辑 `index_performance.go`，在 `runPerformanceTests` 函数中添加：

```go
{
    name: "模糊查询测试",
    query: func(db gdb.DB, table string) (interface{}, error) {
        return db.Model(table).
            Where("title LIKE ?", "%测试%").
            Limit(100).
            All()
    },
},
```

#### 3. 测试不同的索引策略

修改 `addIndexes` 函数，尝试：
- 只创建单列索引
- 只创建联合索引
- 改变联合索引的列顺序

看看不同策略对性能的影响！

### 清理数据

测试完成后清理：

```bash
# 方式一：使用 SQL 文件
mysql -u root -p todo_app_go_frame < cleanup.sql

# 方式二：手动删除
mysql -u root -p -e "DROP TABLE test_todo_no_index, test_todo_with_index;" todo_app_go_frame
```

### 学习要点

运行完测试后，你应该理解：

1. **为什么需要索引** - 全表扫描 vs 索引查找
2. **索引的代价** - 占用空间、影响写入性能
3. **何时使用索引** - WHERE、JOIN、ORDER BY 的列
4. **联合索引** - 多列组合查询的优化
5. **索引的局限** - 并非所有场景都适合索引

### 下一步

- 📖 阅读 [MySQL 索引优化官方文档](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)
- 🔍 尝试 `EXPLAIN` 分析你的实际项目查询
- 🎯 在你的 todo 应用中合理添加索引
- 💪 学习 GoFrame 的其他高级特性

---

**提示**：索引不是银弹！过多的索引会降低写入性能。合理的索引设计需要根据实际查询场景来决定。
