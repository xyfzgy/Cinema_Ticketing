-- ========== 用户 ==========
CREATE TABLE SYSTEM_USER (
                             id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                             username     VARCHAR(50)  NOT NULL UNIQUE,
                             PASSWORD     VARCHAR(100) NOT NULL COMMENT 'bcrypt',
                             nickname     VARCHAR(50),
                             phone        VARCHAR(20),
                             role         VARCHAR(20)  NOT NULL DEFAULT 'USER' COMMENT 'USER / ADMIN',
                             STATUS       TINYINT      DEFAULT 1,
                             create_time  DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- ========== 影片 ==========
CREATE TABLE system_movie (
                              id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                              NAME         VARCHAR(100) NOT NULL,
                              director     VARCHAR(50),
                              actors       VARCHAR(255),
                              TYPE         VARCHAR(50),
                              duration     INT COMMENT '分钟',
                              release_date DATE,
                              poster_url   VARCHAR(255),
                              description  TEXT,
                              STATUS       TINYINT DEFAULT 1 COMMENT '1上架 0下架',
                              COUNT        BIGINT DEFAULT 0 COMMENT '播放次数'
);

-- ========== 影厅 ==========
CREATE TABLE system_hall (
                             id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                             NAME         VARCHAR(50) NOT NULL,
                             hall_type    VARCHAR(20) NOT NULL COMMENT 'NORMAL / VIP',
                             ROW_COUNT    INT NOT NULL,
                             col_count    INT NOT NULL
);

-- ========== 座位 ==========
CREATE TABLE system_seat (
                             id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                             hall_id      BIGINT NOT NULL,
                             seat_row     INT NOT NULL,
                             seat_col     INT NOT NULL,
                             seat_no      VARCHAR(20) NOT NULL COMMENT '如 A1',
                             seat_type    VARCHAR(20) DEFAULT 'NORMAL',
                             UNIQUE KEY uk_hall_seat (hall_id, seat_row, seat_col)
);

-- ========== 排片 ==========
CREATE TABLE system_schedule (
                                 id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                                 movie_id     BIGINT NOT NULL,
                                 hall_id      BIGINT NOT NULL,
                                 start_time   DATETIME NOT NULL,
                                 end_time     DATETIME NOT NULL,
                                 price        DECIMAL(10,2) NOT NULL COMMENT '票价',
                                 STATUS       TINYINT DEFAULT 1
);

-- ========== 订单 ==========
CREATE TABLE system_order (
                              id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                              order_no      VARCHAR(64) NOT NULL UNIQUE,
                              user_id       BIGINT NOT NULL,
                              schedule_id   BIGINT NOT NULL,
                              total_amount  DECIMAL(10,2) NOT NULL,
                              order_type    VARCHAR(20) DEFAULT 'NORMAL' COMMENT 'NORMAL / SECKILL',
                              STATUS        VARCHAR(20) NOT NULL COMMENT 'UNPAID/PAID/CANCELLED/REFUNDED',
                              pay_time      DATETIME,
                              expire_time   DATETIME COMMENT '下单+15min',
                              create_time   DATETIME DEFAULT CURRENT_TIMESTAMP,
                              INDEX idx_user (user_id),
                              INDEX idx_status_expire (STATUS, expire_time)
);

-- ========== 票 ==========
CREATE TABLE system_ticket (
                               id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                               order_id     BIGINT NOT NULL,
                               schedule_id  BIGINT NOT NULL,
                               seat_id      BIGINT NOT NULL,
                               price        DECIMAL(10,2) NOT NULL,
                               ticket_no    VARCHAR(64) NOT NULL UNIQUE,
                               STATUS       VARCHAR(20) DEFAULT 'VALID' COMMENT 'VALID/USED/REFUNDED',
                               UNIQUE KEY uk_schedule_seat (schedule_id, seat_id)
);

-- ========== 秒杀活动 ==========
CREATE TABLE system_seckill_activity (
                                         id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                                         schedule_id   BIGINT NOT NULL,
                                         seckill_price DECIMAL(10,2) NOT NULL,
                                         stock         INT NOT NULL COMMENT '秒杀座位总数',
                                         start_time    DATETIME NOT NULL,
                                         end_time      DATETIME NOT NULL,
                                         STATUS        TINYINT DEFAULT 1
);

-- ========== 秒杀记录 ==========
CREATE TABLE system_seckill_record (
                                       id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       activity_id  BIGINT NOT NULL,
                                       user_id      BIGINT NOT NULL,
                                       order_no     VARCHAR(64),
                                       create_time  DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       UNIQUE KEY uk_act_user (activity_id, user_id)
);
