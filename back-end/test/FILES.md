# 📦 索引性能测试 - 文件说明

## 文件列表

```
back-end/test/
├── index_performance.go   # 主测试程序（带进度条和可视化输出）
├── config.yaml                 # 数据库配置文件
├── run_test.sh                 # 快速运行脚本（推荐）
├── cleanup.sql                 # 清理测试数据的 SQL 脚本
├── README.md                   # 完整文档
├── QUICKSTART.md               # 快速开始指南（5分钟上手）
└── FILES.md                    # 本文件 - 文件说明
```

## 📄 文件说明

### 1. `index_performance.go` ⭐
**主测试程序** - 核心代码文件

**功能**：
- 创建两个相同结构的测试表（有索引 vs 无索引）
- 批量插入 100 万条测试数据
- 为其中一个表添加 5 个索引
- 执行 6 种常见查询场景的性能对比
- 输出美观的进度条和测试结果

**可调参数**：
```go
const (
    TotalRecords = 1000000  // 总数据量，可改为 500000 或 100000
    BatchSize = 10000       // 每批插入数量
)
```

### 2. `config.yaml` ⚙️
**数据库配置文件**

需要修改的地方：
```yaml
database:
  default:
    link: "mysql:root:你的密码@tcp(127.0.0.1:3306)/todo_app_go_frame?charset=utf8mb4"
```

### 3. `run_test.sh` 🚀
**快速运行脚本**（推荐使用）

特点：
- 自动检查配置文件
- 显示友好的提示信息
- 需要确认后才运行

使用：
```bash
cd back-end/test
./run_test.sh
```

### 4. `cleanup.sql` 🧹
**清理脚本** - 删除测试数据

使用：
```bash
mysql -u root -p todo_app_go_frame < cleanup.sql
```

或直接执行：
```sql
DROP TABLE IF EXISTS test_todo_no_index, test_todo_with_index;
```

### 5. `README.md` 📖
**完整文档** - 包含所有详细信息

内容包括：
- 功能说明
- 使用步骤
- 预期结果
- 关键学习点（索引原理、使用场景、代价）
- 执行计划分析
- 进阶实验
- 常见问题解答

### 6. `QUICKSTART.md` ⚡
**快速开始指南** - 5 分钟上手

适合：
- 只想快速看效果
- 不想看长文档
- 初学者友好

内容包括：
- 最快运行方式
- 配置说明
- 常见问题速查表
- 进阶玩法

## 🎯 使用流程

### 新手推荐
```bash
# 1. 阅读快速开始
cat QUICKSTART.md

# 2. 修改配置
vim config.yaml

# 3. 运行测试
./run_test.sh
```

### 老手直接
```bash
# 修改配置后直接运行
go run index_performance.go
```

## 💡 提示

1. **首次运行**：建议先用 10 万条数据测试（修改 `TotalRecords = 100000`）
2. **数据库选择**：确保使用测试数据库，不要在生产环境运行
3. **磁盘空间**：100 万条数据大约需要 200MB 空间
4. **清理数据**：测试完记得用 `cleanup.sql` 清理

## 🔧 定制化

### 修改数据量
编辑 `index_performance.go`：
```go
const TotalRecords = 500000  // 改为你想要的数量
```

### 添加测试场景
在 `runPerformanceTests` 函数中添加：
```go
{
    name: "你的测试场景名称",
    query: func(db gdb.DB, table string) (interface{}, error) {
        return db.Model(table).Where("你的查询条件").All()
    },
},
```

### 修改索引策略
在 `addIndexes` 函数中修改索引定义。

## 📊 输出说明

程序会输出：
- ✅ 带 emoji 的美观界面
- 📊 实时进度条
- ⏱️  精确的时间统计
- 💡 性能提升倍数
- 📋 索引信息汇总
- 📈 测试结果对比表

## ❓ 遇到问题？

1. **连接失败**：检查 `config.yaml` 配置
2. **太慢**：减少 `TotalRecords` 数量
3. **内存不足**：减少数据量或增加批次大小
4. **想了解原理**：阅读 `README.md` 的学习要点部分

## 🎓 学习建议

1. 先运行测试，看看实际效果
2. 使用 `EXPLAIN` 查看执行计划
3. 尝试修改索引策略，观察性能变化
4. 在你的实际项目中应用学到的知识

---

**Happy Learning! 🚀**
