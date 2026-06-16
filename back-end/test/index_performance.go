package main

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gctx"

	// 导入 MySQL 驱动（必需）
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
)

const (
	// 插入数据的总数量 - 可以根据机器性能调整
	TotalRecords = 500000
	// 每批插入的数量
	BatchSize = 10000
)

// TestResult 存储测试结果
type TestResult struct {
	TestName       string
	NoIndexTime    time.Duration
	WithIndexTime  time.Duration
	SpeedupFactor  float64
	ImprovementPct float64
}

func main() {
	ctx := gctx.New()

	printHeader()

	// 1. 创建测试表
	if err := createTestTables(ctx); err != nil {
		panic(err)
	}

	// 2. 插入测试数据到两个表
	fmt.Println("开始插入数据到无索引表...")
	if err := insertTestData(ctx, "test_todo_no_index"); err != nil {
		panic(err)
	}

	fmt.Println("\n开始插入数据到有索引表...")
	if err := insertTestData(ctx, "test_todo_with_index"); err != nil {
		panic(err)
	}

	// 3. 添加索引到第二个表
	fmt.Println("\n正在为有索引表添加索引...")
	if err := addIndexes(ctx); err != nil {
		panic(err)
	}

	// 4. 执行性能测试
	fmt.Println("\n=== 开始性能测试 ===\n")
	results := runPerformanceTests(ctx)

	// 5. 显示汇总结果
	fmt.Println("\n" + strings.Repeat("=", 70))
	printSummary(results)

	// 6. 显示索引信息
	showTableIndexes(ctx)

	fmt.Println("\n✅ 测试完成！")
	fmt.Println("\n💡 提示: 可以使用 cleanup.sql 清理测试表")
}

func printHeader() {
	fmt.Println(strings.Repeat("=", 70))
	fmt.Println("               🚀 数据库索引性能测试程序")
	fmt.Println(strings.Repeat("=", 70))
	fmt.Printf("📊 测试数据量: %s 条\n", formatNumber(TotalRecords))
	fmt.Printf("⏰ 开始时间: %s\n", time.Now().Format("2006-01-02 15:04:05"))
	fmt.Println(strings.Repeat("=", 70))
	fmt.Println()
}

// createTestTables 创建测试表
func createTestTables(ctx context.Context) error {
	fmt.Println("🔧 正在创建测试表...")

	// 删除已存在的表
	_, _ = g.DB().Exec(ctx, "DROP TABLE IF EXISTS test_todo_no_index")
	_, _ = g.DB().Exec(ctx, "DROP TABLE IF EXISTS test_todo_with_index")

	// 创建无索引的表
	sqlNoIndex := `
	CREATE TABLE test_todo_no_index (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
		title VARCHAR(255) NOT NULL COMMENT '待办事项内容',
		done TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否完成 0:未完成 1:已完成',
		user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
		priority INT NOT NULL DEFAULT 0 COMMENT '优先级',
		created_at DATETIME NOT NULL COMMENT '创建时间',
		updated_at DATETIME NOT NULL COMMENT '更新时间',
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='测试表-无索引'
	`

	if _, err := g.DB().Exec(ctx, sqlNoIndex); err != nil {
		return fmt.Errorf("创建无索引表失败: %v", err)
	}

	// 创建有索引的表（结构相同，稍后添加索引）
	sqlWithIndex := `
	CREATE TABLE test_todo_with_index (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
		title VARCHAR(255) NOT NULL COMMENT '待办事项内容',
		done TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否完成 0:未完成 1:已完成',
		user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
		priority INT NOT NULL DEFAULT 0 COMMENT '优先级',
		created_at DATETIME NOT NULL COMMENT '创建时间',
		updated_at DATETIME NOT NULL COMMENT '更新时间',
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='测试表-有索引'
	`

	if _, err := g.DB().Exec(ctx, sqlWithIndex); err != nil {
		return fmt.Errorf("创建有索引表失败: %v", err)
	}

	fmt.Println("   ✓ 测试表创建成功")
	return nil
}

// insertTestData 插入测试数据
func insertTestData(ctx context.Context, tableName string) error {
	rand.Seed(time.Now().UnixNano())

	startTime := time.Now()
	totalBatches := TotalRecords / BatchSize

	for batch := 0; batch < totalBatches; batch++ {
		// 构建批量插入数据
		data := make([]g.Map, 0, BatchSize)
		now := time.Now()

		for i := 0; i < BatchSize; i++ {
			recordIndex := batch*BatchSize + i
			data = append(data, g.Map{
				"title":      fmt.Sprintf("测试待办事项 #%d", recordIndex),
				"done":       rand.Intn(2),
				"user_id":    rand.Int63n(10000) + 1, // 1-10000 的用户ID
				"priority":   rand.Intn(5),           // 0-4 的优先级
				"created_at": now,
				"updated_at": now,
			})
		}

		// 批量插入
		if _, err := g.DB().Model(tableName).Data(data).Insert(); err != nil {
			return fmt.Errorf("插入数据失败: %v", err)
		}

		// 显示进度条
		if (batch+1)%10 == 0 || batch == totalBatches-1 {
			progress := float64(batch+1) / float64(totalBatches) * 100
			elapsed := time.Since(startTime)
			progressBar := createProgressBar(progress, 30)
			fmt.Printf("\r   %s %.1f%% (%d/%d) 耗时: %v",
				progressBar, progress, batch+1, totalBatches, elapsed.Round(time.Second))
		}
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n   ✓ 插入完成，共 %s 条记录，耗时: %v\n", formatNumber(TotalRecords), totalTime.Round(time.Second))
	return nil
}

// addIndexes 为测试表添加索引
func addIndexes(ctx context.Context) error {
	indexes := []struct {
		name string
		sql  string
	}{
		{"user_id 单列索引", "CREATE INDEX idx_user_id ON test_todo_with_index(user_id)"},
		{"done 单列索引", "CREATE INDEX idx_done ON test_todo_with_index(done)"},
		{"priority 单列索引", "CREATE INDEX idx_priority ON test_todo_with_index(priority)"},
		{"created_at 单列索引", "CREATE INDEX idx_created_at ON test_todo_with_index(created_at)"},
		{"user_id+done 联合索引", "CREATE INDEX idx_user_done ON test_todo_with_index(user_id, done)"},
	}

	for _, idx := range indexes {
		fmt.Printf("   创建索引: %s...\n", idx.name)
		if _, err := g.DB().Exec(ctx, idx.sql); err != nil {
			return fmt.Errorf("创建索引失败: %v", err)
		}
	}

	fmt.Println("   ✓ 所有索引创建成功")
	return nil
}

// runPerformanceTests 执行性能测试
func runPerformanceTests(ctx context.Context) []TestResult {
	tests := []struct {
		name  string
		query func(db gdb.DB, table string) (interface{}, error)
	}{
		{
			name: "根据 user_id 精确查询",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).Where("user_id = ?", 5000).All()
			},
		},
		{
			name: "根据 done 状态查询（高基数）",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).Where("done = ?", 1).Limit(1000).All()
			},
		},
		{
			name: "user_id + done 联合查询",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).Where("user_id = ? AND done = ?", 5000, 1).All()
			},
		},
		{
			name: "priority 排序查询",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).Where("priority >= ?", 3).Order("priority DESC").Limit(100).All()
			},
		},
		{
			name: "日期范围查询",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).
					Where("created_at >= ?", time.Now().Add(-24*time.Hour)).
					Limit(1000).All()
			},
		},
		{
			name: "COUNT 聚合查询",
			query: func(db gdb.DB, table string) (interface{}, error) {
				return db.Model(table).Where("user_id = ?", 5000).Count()
			},
		},
	}

	results := make([]TestResult, 0, len(tests))

	// 对每个测试用例，分别在有索引和无索引的表上执行
	for i, test := range tests {
		fmt.Printf("\n📌 测试 %d/%d: %s\n", i+1, len(tests), test.name)
		fmt.Println(strings.Repeat("-", 70))

		// 无索引表测试
		fmt.Print("   无索引表: ")
		noIndexTime := measureQuery(ctx, "test_todo_no_index", test.query)
		fmt.Printf("⏱️  %v\n", noIndexTime)

		// 有索引表测试
		fmt.Print("   有索引表: ")
		withIndexTime := measureQuery(ctx, "test_todo_with_index", test.query)
		fmt.Printf("⏱️  %v\n", withIndexTime)

		// 计算性能提升
		result := TestResult{
			TestName:      test.name,
			NoIndexTime:   noIndexTime,
			WithIndexTime: withIndexTime,
		}

		if noIndexTime > 0 && withIndexTime > 0 {
			result.SpeedupFactor = float64(noIndexTime) / float64(withIndexTime)
			result.ImprovementPct = (1 - float64(withIndexTime)/float64(noIndexTime)) * 100

			fmt.Printf("   💡 性能提升: %.2fx (快了 %.1f%%)\n",
				result.SpeedupFactor, result.ImprovementPct)
		}

		results = append(results, result)
	}

	return results
}

// measureQuery 测量查询执行时间
func measureQuery(ctx context.Context, table string, queryFunc func(gdb.DB, string) (interface{}, error)) time.Duration {
	db := g.DB()

	// 多次执行取平均值，提高准确性
	const iterations = 3
	var totalDuration time.Duration

	for i := 0; i < iterations; i++ {
		start := time.Now()
		_, err := queryFunc(db, table)
		duration := time.Since(start)

		if err != nil {
			fmt.Printf("查询错误: %v\n", err)
			return 0
		}

		totalDuration += duration
	}

	return totalDuration / iterations
}

// showTableIndexes 显示表的索引信息
func showTableIndexes(ctx context.Context) {
	fmt.Println("\n" + strings.Repeat("=", 70))
	fmt.Println("📋 索引信息")
	fmt.Println(strings.Repeat("=", 70))

	tables := []string{"test_todo_no_index", "test_todo_with_index"}

	for _, table := range tables {
		fmt.Printf("\n表名: %s\n", table)
		result, err := g.DB().GetAll(ctx, fmt.Sprintf("SHOW INDEX FROM %s", table))
		if err != nil {
			fmt.Printf("   ⚠️  获取索引信息失败: %v\n", err)
			continue
		}

		hasIndex := false
		for _, row := range result {
			if row["Key_name"].String() != "PRIMARY" {
				fmt.Printf("   🔑 %s (列: %s)\n",
					row["Key_name"].String(),
					row["Column_name"].String())
				hasIndex = true
			}
		}

		if !hasIndex {
			fmt.Println("   ❌ 无索引（仅主键）")
		}
	}
}

// printSummary 打印汇总结果
func printSummary(results []TestResult) {
	fmt.Println("📊 测试结果汇总")
	fmt.Println(strings.Repeat("=", 70))

	fmt.Printf("%-35s %12s %12s %10s\n", "测试场景", "无索引", "有索引", "提升倍数")
	fmt.Println(strings.Repeat("-", 70))

	var totalSpeedup float64
	validResults := 0

	for _, result := range results {
		if result.SpeedupFactor > 0 {
			fmt.Printf("%-35s %12v %12v %9.2fx\n",
				truncateString(result.TestName, 35),
				result.NoIndexTime.Round(time.Millisecond),
				result.WithIndexTime.Round(time.Millisecond),
				result.SpeedupFactor)
			totalSpeedup += result.SpeedupFactor
			validResults++
		}
	}

	fmt.Println(strings.Repeat("-", 70))

	if validResults > 0 {
		avgSpeedup := totalSpeedup / float64(validResults)
		fmt.Printf("平均性能提升: %.2fx\n", avgSpeedup)
	}
}

// 工具函数

func createProgressBar(percent float64, width int) string {
	filled := int(percent / 100 * float64(width))
	bar := strings.Repeat("█", filled) + strings.Repeat("░", width-filled)
	return fmt.Sprintf("[%s]", bar)
}

func formatNumber(n int) string {
	str := fmt.Sprintf("%d", n)
	if len(str) <= 3 {
		return str
	}

	var result []rune
	for i, c := range str {
		if i > 0 && (len(str)-i)%3 == 0 {
			result = append(result, ',')
		}
		result = append(result, c)
	}
	return string(result)
}

func truncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}
