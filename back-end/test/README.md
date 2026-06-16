# 🚀 数据库索引性能测试

> 一个用于直观演示 MySQL 索引性能差异的测试程序

作为前端开发者学习后端 GoFrame 时，理解数据库索引至关重要。这个测试程序会用百万级别的数据来展示索引的实际效果。

## 功能说明

该程序会：
1. 创建两个结构相同的测试表（`test_todo_no_index` 和 `test_todo_with_index`）
2. 向每个表插入 100 万条测试数据
3. 为第二个表添加多个索引
4. 执行 6 种常见查询场景，对比有索引和无索引的性能差异

## 测试场景

1. **单列查询** - 根据 user_id 查询
2. **状态过滤** - 根据 done 状态查询
3. **联合查询** - user_id 和 done 组合查询
4. **排序查询** - 根据 priority 排序
5. **范围查询** - 根据日期范围查询
6. **聚合查询** - COUNT 统计

## 🚀 快速开始

> 💡 **新手提示**：如果你只是想快速看效果，直接看 [快速开始指南 (QUICKSTART.md)](./QUICKSTART.md)

### 1. 配置数据库连接

编辑 `config.yaml` 文件，修改数据库连接信息：

```yaml
database:
  default:
    link: "mysql:root:你的密码@tcp(127.0.0.1:3306)/todo_app_go_frame?charset=utf8mb4"
```

### 2. 运行测试程序

**推荐方式**：使用脚本
```bash
cd back-end/test
./run_test.sh
```

**或者直接运行**：
```bash
cd back-end/test
go run index_performance.go
```

**编译后运行**：
```bash
go build -o index_test index_performance.go
./index_test
```

### 3. 等待测试完成

整个测试过程包括：
- 创建表：几秒
- 插入 100 万条数据：约 2-5 分钟（取决于硬件性能）
- 创建索引：约 10-30 秒
- 执行性能测试：约 1 分钟

总耗时约 **5-10 分钟**。

> 💡 **性能有限？** 可以修改 `index_performance.go` 中的 `TotalRecords` 常量来减少数据量

## 预期结果

你会看到类似这样的输出：

```
======================================================================
               🚀 数据库索引性能测试程序
======================================================================
📊 测试数据量: 1,000,000 条
⏰ 开始时间: 2026-06-16 10:30:00
======================================================================

🔧 正在创建测试表...
   ✓ 测试表创建成功

开始插入数据到无索引表...
   [██████████████████████████████] 100.0% (100/100) 耗时: 2m30s
   ✓ 插入完成，共 1,000,000 条记录，耗时: 2m30s

开始插入数据到有索引表...
   [██████████████████████████████] 100.0% (100/100) 耗时: 2m35s
   ✓ 插入完成，共 1,000,000 条记录，耗时: 2m35s

正在为有索引表添加索引...
   创建索引: user_id 单列索引...
   创建索引: done 单列索引...
   创建索引: priority 单列索引...
   创建索引: created_at 单列索引...
   创建索引: user_id+done 联合索引...
   ✓ 所有索引创建成功

=== 开始性能测试 ===

📌 测试 1/6: 根据 user_id 精确查询
----------------------------------------------------------------------
   无索引表: ⏱️  245ms
   有索引表: ⏱️  2ms
   💡 性能提升: 122.50x (快了 99.2%)

📌 测试 2/6: 根据 done 状态查询（高基数）
----------------------------------------------------------------------
   无索引表: ⏱️  380ms
   有索引表: ⏱️  156ms
   💡 性能提升: 2.44x (快了 59.0%)

...

======================================================================
📊 测试结果汇总
======================================================================
测试场景                                  无索引        有索引    提升倍数
----------------------------------------------------------------------
根据 user_id 精确查询                      245ms          2ms     122.50x
根据 done 状态查询（高基数）               380ms        156ms       2.44x
user_id + done 联合查询                    240ms          1ms     240.00x
priority 排序查询                          198ms         12ms      16.50x
日期范围查询                               420ms        210ms       2.00x
COUNT 聚合查询                             230ms          1ms     230.00x
----------------------------------------------------------------------
平均性能提升: 102.24x

======================================================================
📋 索引信息
======================================================================

表名: test_todo_no_index
   ❌ 无索引（仅主键）

表名: test_todo_with_index
   🔑 idx_user_id (列: user_id)
   🔑 idx_done (列: done)
   🔑 idx_priority (列: priority)
   🔑 idx_created_at (列: created_at)
   🔑 idx_user_done (列: user_id)
   🔑 idx_user_done (列: done)

✅ 测试完成！

💡 提示: 可以使用 cleanup.sql 清理测试表
```

## 📚 关键学习点

### 1. 索引的作用 - 为什么快？

| 场景 | 无索引（全表扫描） | 有索引（B+Tree） |
|------|------------------|------------------|
| 查找过程 | 逐行扫描 100 万条 | 树形查找，约 20 次比较 |
| 时间复杂度 | O(n) | O(log n) |
| 比喻 | 翻书每一页找内容 | 用目录直接定位 |

- **无索引**：MySQL 需要扫描整个表（全表扫描）
- **有索引**：MySQL 直接通过 B+Tree 定位数据

### 2. 索引类型
本测试创建了以下索引：
- **单列索引**：`idx_user_id`, `idx_done`, `idx_priority`, `idx_created_at`
- **联合索引**：`idx_user_done` (user_id, done)

> 💡 **联合索引的最左前缀原则**：如果创建了 (user_id, done) 联合索引，查询 user_id 可以用索引，但只查询 done 无法使用该索引。

### 3. 何时使用索引 - 决策指南

| 场景 | 是否需要索引 | 原因 |
|------|-------------|------|
| WHERE 条件频繁查询的列 | ✅ 需要 | 加速查找 |
| JOIN 连接的列 | ✅ 需要 | 加速连接 |
| ORDER BY 排序的列 | ✅ 需要 | 避免文件排序 |
| GROUP BY 分组的列 | ✅ 需要 | 加速分组 |
| 频繁更新的列 | ❌ 谨慎 | 每次更新都要更新索引 |
| 区分度很低的列（如性别） | ❌ 不需要 | 索引效果不明显 |
| 小表（几千条以内） | ❌ 不需要 | 全表扫描也很快 |

### 4. 索引的代价 - 没有免费的午餐

**优势**：
- ✅ 查询速度大幅提升（10x - 1000x）
- ✅ 减少 CPU 和 I/O 负载

**代价**：
- ❌ 占用额外的磁盘空间（每个索引都是一棵 B+Tree）
- ❌ INSERT/UPDATE/DELETE 操作变慢（需要同步更新索引）
- ❌ 过多索引会让优化器难以选择
- ❌ 维护成本（需要定期分析和优化）

> 💡 **经验法则**：一个表的索引数量建议控制在 5 个以内

## 查看 MySQL 执行计划

可以使用 `EXPLAIN` 查看查询是否使用了索引：

```sql
-- 无索引的表
EXPLAIN SELECT * FROM test_todo_no_index WHERE user_id = 5000;

-- 有索引的表
EXPLAIN SELECT * FROM test_todo_with_index WHERE user_id = 5000;
```

关注 `type` 字段：
- `ALL`：全表扫描（最慢）
- `index`：索引扫描
- `range`：索引范围扫描
- `ref`：使用非唯一索引
- `const`：使用主键或唯一索引（最快）

## 清理测试数据

测试完成后，可以删除测试表：

```sql
DROP TABLE IF EXISTS test_todo_no_index;
DROP TABLE IF EXISTS test_todo_with_index;
```

或者运行以下命令：

```bash
mysql -u root -p -e "USE todo_app_go_frame; DROP TABLE IF EXISTS test_todo_no_index, test_todo_with_index;"
```

## 进阶实验

### 修改数据量
编辑 `index_performance.go`，修改常量：

```go
const (
    TotalRecords = 500000  // 改为 50 万条
    BatchSize = 10000
)
```

### 添加更多测试场景
在 `runPerformanceTests` 函数中添加新的测试用例：

```go
{
    name: "7. 模糊查询",
    query: func(db gdb.DB, table string) (interface{}, error) {
        return db.Model(table).Where("title LIKE ?", "%测试%").Limit(100).All()
    },
},
```

### 测试不同的索引组合
修改 `addIndexes` 函数，尝试不同的索引策略。

## 常见问题

**Q: 插入数据太慢怎么办？**  
A: 可以临时关闭索引和外键检查（仅测试环境）：
```sql
SET foreign_key_checks = 0;
SET unique_checks = 0;
```

**Q: 内存不足？**  
A: 减少 `TotalRecords` 到 50 万或 10 万条。

**Q: 如何在 Docker 中运行？**  
A: 修改配置文件中的数据库地址为容器名：
```yaml
link: "mysql:gouser:gopassword@tcp(db:3306)/todo_db?charset=utf8mb4"
```

## 参考资料

- [MySQL 索引优化](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)
- [GoFrame 数据库文档](https://goframe.org/pages/viewpage.action?pageId=1114119)
- [B+Tree 数据结构](https://en.wikipedia.org/wiki/B%2B_tree)
