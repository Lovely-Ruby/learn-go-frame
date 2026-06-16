#!/bin/bash

# 索引性能测试快速运行脚本

echo "======================================"
echo "  数据库索引性能测试"
echo "======================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "index_performance.go" ]; then
    echo "错误: 请在 back-end/test 目录下运行此脚本"
    exit 1
fi

# 检查 config.yaml 是否存在
if [ ! -f "config.yaml" ]; then
    echo "错误: config.yaml 配置文件不存在"
    exit 1
fi

echo "提示: 此测试将："
echo "  1. 创建两个测试表"
echo "  2. 插入 100 万条测试数据"
echo "  3. 对比有索引和无索引的查询性能"
echo ""
echo "预计耗时: 5-10 分钟"
echo ""
read -p "是否继续？(y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "已取消"
    exit 0
fi

echo ""
echo "开始运行测试..."
echo ""

# 设置配置文件路径
export GF_GCFG_FILE=config.yaml

# 运行测试
go run index_performance.go

echo ""
echo "======================================"
echo "测试完成！"
echo "======================================"
echo ""
echo "提示: 测试表会保留在数据库中，如需清理请运行："
echo "  mysql -u root -p -e \"USE todo_app_go_frame; DROP TABLE test_todo_no_index, test_todo_with_index;\""
