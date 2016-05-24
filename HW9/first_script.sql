CREATE DATABASE testDB;

SHOW DATABASES;

USE testDB;

CREATE TABLE user (
	id mediumint not null auto_increment primary key,
    email VARCHAR(255) not null unique,
    name VARCHAR(255) not null unique,
    create_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp
);

CREATE TABLE post (
	id mediumint not null auto_increment primary key,
    user_id mediumint not null,
	foreign key (user_id) references user(id),
    title VARCHAR(255) not null,
    content text not null,
    create_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp
);

CREATE TABLE tag (
	id mediumint not null auto_increment primary key,
    name VARCHAR(255) not null
);

CREATE TABLE post_tag (
	post_id mediumint not null,
    foreign key (post_id) references post(id),
    tag_id mediumint not null,
    foreign key (tag_id) references tag(id)
);

SHOW TABLES;

SELECT * FROM testDB.user;

SELECT * FROM testDB.post;

SELECT * FROM testDB.tag;

SELECT * FROM testDB.post_tag;

INSERT INTO user (email, name) VALUES ('harveyycyang@gmail.com', 'Harvey');

UPDATE user SET name='Harvey Yang' WHERE name='Harvey';

INSERT INTO post (user_id, title, content)
SELECT id, 'First Post', 'HAHAHAHAHAHAHAHAHA' 
  FROM user
 WHERE name = 'Harvey Yang'
 LIMIT 1;

INSERT INTO tag (name) VALUES ('NTU');
INSERT INTO tag (name) VALUES ('EE');

INSERT INTO post_tag (post_id, tag_id)
SELECT p.id, (SELECT t.id FROM tag t WHERE name='EE' LIMIT 1)
  FROM post p
 WHERE title='First Post'
 LIMIT 1
