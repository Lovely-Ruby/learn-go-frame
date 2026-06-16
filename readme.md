# 简介

[前端 Go-Frame 的学习笔记](https://editor.csdn.net/md?not_checkout=1&spm=1001.2015.3001.4503&articleId=155501045)


# Docker 
```bash
docker compose down
docker compose up --build -d
# -d 分离模式，释放终端，不然终端就会有一堆日志了
```

# 流程

在 GoFrame 的开发流中，引入 GoFrame CLI（ gf  命令行工具）的自动化生成指令后，你会发现绝大部分“无脑且重复的模板代码”都可以自动完成。

  以下是补充了快速生成指令的完整开发闭环流程：
  ──────
  ### 🔄 GoFrame 自动化开发闭环（带 CLI 指令版）

    graph TD                                                                                                                                 
        A[1. 数据库建表] -->|执行 gf gen dao| B[2. 自动生成 DAO/Entity/DO]                                                                   
        B -->|手动在 api/ 编写 Req/Res| C[3. 定义 API 接口协议]                                                                              
        C -->|执行 gf gen ctrl| D[4. 自动生成 Controller 模板代码]                                                                           
        D -->|手动在 internal/logic/ 编写业务逻辑| E[5. 编写 Logic 业务实现]                                                                 
        E -->|执行 gf gen service| F[6. 自动生成 Service 接口与注册]                                                                         
        F -->|挂载路由并启动| G[7. 联调测试]                                                                                                 
  ──────
  ### 💻 详细指令与职责说明

  #### 1️⃣ 步骤一：数据库 ➔ DAO & Entity（数据结构同步）

  当你修改了数据库表结构，或者新增了表时：

  • 执行指令：
    gf gen dao                                                                                                                               

  • 自动生成的代码：
      •  internal/dao/ ：数据库操作对象（CRUD 构造器）。
      •  internal/model/entity/ ：与数据库字段 1:1 完全对应的结构体模型。
      •  internal/model/do/ ：用于增删改操作的数据库领域对象（字段都变成了指针，允许部分更新）。

  ──────
  #### 2 步骤二：定义 API ➔ 生成 Controller（路由与处理器模板）

  当你在  api/  目录下手动定义好  Req  和  Res  结构体（写好路由路径和入参限制）后：

  • 执行指令：
    gf gen ctrl

  • 自动生成的代码：
      • 极其强大！ GoFrame 会解析你的  api/  目录，并自动在  internal/controller/  目录下生成对应的控制器文件和方法空壳（例如  todo_v1_create.
      go ）。
      • 它会自动帮你写好接收  context.Context 、 *v1.CreateReq  并返回  *v1.CreateRes 
      的函数签名，你只需要往空壳里填入具体的业务逻辑即可，再也不用手动复制粘贴方法名了。

  ──────
  #### 3 步骤三：编写 Logic ➔ 生成 Service（业务逻辑与接口解耦）

  当你决定采用更规范的三层架构，并在  internal/logic/  目录下手写了具体的业务逻辑代码后：

  • 执行指令：
    gf gen service

  • 自动生成的代码：
      •  internal/service/ ：自动提取  logic  里的实现类并生成对应的接口（Interface），同时自动生成依赖注入（Dependency
      Injection）的注册代码。
      • 这样你在 Controller 里就可以通过  service.Todo().Create(...)  直接调用，实现了“面向接口编程”，Controller 和 Logic 完美解耦。

  ──────
  ### 💡 极简开发流口诀（三板斧）

  通常在日常新增一个接口功能时，你的终端只需要频繁用到这三行指令：

    gf gen dao     # 1. 表结构变了，刷一下 DAO
    # (手动在 api/ 目录下定义好 Req/Res 结构体)
    gf gen ctrl    # 2. 刷一下控制器，自动长出 Controller 的代码空壳，在里面填业务
    gf gen service # 3. 如果写了新的逻辑层代码，刷一下服务，生成接口供 Controller 调用

  这套 CLI 工具链是 GoFrame 最核心的优势之一，它能保证整个后端项目的代码风格高度统一，同时为开发者省去了大量手写模板代码的时间。