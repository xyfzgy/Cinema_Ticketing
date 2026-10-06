# Cinema Ticketing JMeter 测试说明

## 1. 测试内容

| 脚本 | 测试场景 | 主要接口 | 数据文件 |
| --- | --- | --- | --- |
| `test-auth/01-auth.jmx` | 登录认证 | `/auth/login` | `data/user.csv` |
| `test-auth/02-order.jmx` | 登录后创建订单 | `/auth/login`、`/order/create` | `data/user.csv`、`data/seats.csv` |
| `test-auth/03-seckill.jmx` | 秒杀并发 | `/auth/login`、`/seckill/1` | `data/user.csv`、`data/activities.csv` |
| `test-auth/04-ai-chat.jmx` | AI 客服对话 | `/auth/login`、`/ai/chat` | `data/user.csv` |
| `test-auth/05-mixed.jmx` | 综合业务压测 | 登录、订单、秒杀、订单查询、AI 对话 | `data/user.csv` |

测试脚本通过 `host`、`port`、`protocol` 参数指定后端地址。用户数据使用 `data/user.csv`，格式为 `username,password`；订单座位使用 `data/seats.csv`，格式为 `scheduleId,seatId`；秒杀活动使用 `data/activities.csv`，格式为 `activityId`。

## 2. 前置条件

1. 安装 JDK 17 或更高版本，并安装 Apache JMeter 5.6.3。
2. 启动影院后端，确认健康接口和目标接口可访问。当前后端默认端口为 `9090`，如实际端口不同，在执行命令中修改 `-Jport`。
3. 在测试数据库中准备 `data/user.csv` 中的账号，并确保账号密码与 CSV 一致。
4. 执行订单测试前，准备有效的场次和座位；执行秒杀测试前，准备活动 ID 为 `1` 的秒杀活动及库存。
5. 执行 AI 测试前配置后端 `OPENAI_API_KEY`，并确认模型服务可用；不测试 AI 时可跳过 `04-ai-chat.jmx` 和综合脚本中的 AI 请求。
6. 压测前确认 Redis、RabbitMQ 和数据库已启动，并观察 CPU、内存、连接池、Redis、RabbitMQ 队列和数据库连接数。

## 3. 图形界面操作流程

1. 启动 JMeter：Windows 执行 `jmeter.bat`，Linux/macOS 执行 `jmeter`。
2. 选择 **File → Open**，打开 `test-auth/01-auth.jmx` 等测试计划。
3. 在测试计划中检查 CSV 文件路径。脚本默认使用相对于 `cinema-jmeter` 的 `data/user.csv`、`data/seats.csv` 和 `data/activities.csv`。
4. 打开 **Thread Group**，设置线程数、Ramp-Up 时间和循环次数。先用 1 至 5 个线程做冒烟测试，再逐步增加并发。
5. 在 **HTTP Request Defaults** 或测试计划参数中设置 `host`、`port`、`protocol`，使其与后端地址一致。
6. 点击绿色启动按钮执行测试。调试阶段可添加或启用 **View Results Tree**，正式压测应禁用该监听器以避免占用内存。
7. 测试结束后查看 **Summary Report**、**Aggregate Report** 和响应断言结果，确认错误率、吞吐量、平均响应时间及 90/95/99 分位响应时间。

## 4. 命令行操作流程

在 `cinema-jmeter` 目录执行以下命令：

```bash
# 登录认证
jmeter -n -t test-auth/01-auth.jmx -q jmeter.properties -Jhost=localhost -Jport=9090 -Jthreads=20 -Jrampup=20 -l results/auth.jtl -e -o results/auth-report

# 订单测试
jmeter -n -t test-auth/02-order.jmx -q jmeter.properties -Jhost=localhost -Jport=9090 -Jthreads=20 -Jrampup=20 -l results/order.jtl -e -o results/order-report

# 秒杀测试
jmeter -n -t test-auth/03-seckill.jmx -q jmeter.properties -Jhost=localhost -Jport=9090 -Jthreads=100 -Jrampup=10 -l results/seckill.jtl -e -o results/seckill-report

# AI 客服测试
jmeter -n -t test-auth/04-ai-chat.jmx -q jmeter.properties -Jhost=localhost -Jport=9090 -Jthreads=10 -Jrampup=10 -l results/ai.jtl -e -o results/ai-report

# 综合测试
jmeter -n -t test-auth/05-mixed.jmx -q jmeter.properties -Jhost=localhost -Jport=9090 -Jthreads=100 -Jrampup=30 -l results/mixed.jtl -e -o results/mixed-report
```

参数说明：`-n` 表示非 GUI 模式，`-t` 指定测试计划，`-q` 加载 JMeter 属性，`-Jthreads` 设置线程数，`-Jrampup` 设置启动全部线程所需秒数，`-l` 保存结果文件，`-e -o` 生成 HTML 报告。报告目录必须不存在或为空目录。

Windows 可直接执行目录中的批处理脚本（文件名虽为 `.sh`，内容为 Windows 批处理）：

```powershell
.\run.sh
```

也可以按需传入环境变量：

```powershell
$env:JMETER_HOME = 'D:\apache-jmeter-5.6.3'
.\run.sh
```

## 5. 推荐测试顺序

1. **冒烟测试**：每个脚本使用 1 个线程、1 次循环，确认接口地址、账号、场次和断言均正确。
2. **基线测试**：使用 10 至 20 个线程，记录正常负载下的平均响应时间和吞吐量。
3. **负载测试**：逐步增加线程数，观察响应时间、错误率和资源使用率变化。
4. **压力测试**：继续增加线程直到达到预设错误率、响应时间或资源上限，记录系统拐点。
5. **恢复测试**：停止压测后再次访问登录、订单查询和库存接口，确认服务、消息队列和数据库恢复正常。

## 6. 结果判定与排查

- 登录、订单、秒杀和 AI 请求应检查 HTTP 状态码、业务响应码和响应断言，不能只看 HTTP 200。
- 秒杀重点检查超卖、重复购买、库存归零后的响应和 RabbitMQ 消费积压。
- 订单重点检查同一座位是否产生多个有效订单、重复提交是否幂等、超时订单是否释放座位。
- AI 测试重点检查超时、限流和模型不可用时的错误响应。
- 发现错误时先查看 `result.jtl` 中的请求 URL、响应码和错误消息，再结合后端日志、数据库慢查询、Redis 命中率及 RabbitMQ 消费者日志定位。

## 7. 结果文件

建议将结果按日期保存，例如 `results/20261005/mixed.jtl` 和 `results/20261005/mixed-report/`。`.jtl` 用于二次分析，`html/index.html` 为浏览器报告入口。压测结果文件可能包含业务数据，提交代码时不要将真实生产账号、令牌或结果文件纳入版本库。
