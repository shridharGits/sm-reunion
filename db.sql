CREATE DATABASE reunion;

-- \c into database

CREATE TABLE IF NOT EXISTS userDatabase(
user_id uuid DEFAULT uuid_generate_v4(),
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(200) UNIQUE NOT NULL,
password VARCHAR(50) NOT NULL,
posts TEXT [],
followers TEXT [],
followings TEXT [],
timestamp timestamp default current_timestamp,
token VARCHAR (255),
PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS postDatabase(
post_id uuid DEFAULT uuid_generate_v4(),
user_id uuid,
title VARCHAR(50) UNIQUE NOT NULL,
description VARCHAR(255) NOT NULL,
likes TEXT[],
comments TEXT[],
timestamp timestamp default current_timestamp,
FOREIGN KEY (user_id) REFERENCES userDatabase (user_id),
PRIMARY KEY (post_id)
);

CREATE TABLE IF NOT EXISTS commentDatabase(
comment_id uuid DEFAULT uuid_generate_v4(),
user_id uuid,
post_id uuid,
comment VARCHAR(255) NOT NULL,
timestamp timestamp default current_timestamp,
FOREIGN KEY (user_id) REFERENCES userDatabase (user_id),
FOREIGN KEY (post_id) REFERENCES postDatabase (post_id),
PRIMARY KEY (comment_id)
);

-- test
CREATE TABLE userDatabase(
user_id serial PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(200) UNIQUE NOT NULL,
password VARCHAR(50) NOT NULL,
posts TEXT [],
followers TEXT [],
followings TEXT [],
timestamp timestamp default current_timestamp,
token VARCHAR (255)
);


CREATE TABLE postDatabase(
post_id serial PRIMARY KEY,
user_id INT,
title VARCHAR(50) UNIQUE NOT NULL,
description VARCHAR(255) NOT NULL,
likes INT DEFAULT 0,
comments TEXT[],
timestamp timestamp default current_timestamp,
FOREIGN KEY (user_id) REFERENCES userDatabase(user_id)
);

CONSTRAINT fk_userid FOREIGN KEY(user_id) REFERENCES userDatabase(user_id) ON DELETE SET NULL

-- CONSTRAINT fk_userid FOREIGN KEY(user_id) REFERENCES userDatabase(user_id)