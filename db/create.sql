--Purpose: Script to create all schema objects

--The results of running this script will be spooled
--into 'spoolCreate.txt'

--\o 'spoolCreate.txt'

-- Output script execution data
\qecho -n 'Script run on '
\qecho -n `date /t`
\qecho -n 'at '
\qecho `time /t`
\qecho -n 'Script run by ' :USER ' on server ' :HOST ' with db ' :DBNAME
\qecho ' '
\qecho 


BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS USERS(
    USERNAME VARCHAR NOT NULL PRIMARY KEY CHECK LENGTH(TRIM(USERNAME))>0,
    FIRSTNAME VARCHAR NOT NULL CHECK LENGTH(TRIM(FIRSTNAME))>0,
    LASTNAME VARCHAR NOT NULL CHECK LENGTH(TRIM(LASTNAME))>0,
    EMAIL VARCHAR NOT NULL UNIQUE CHECK TRIM(EMAIL LIKE '_%@_%._%'),
    HASHEDPASSWORD VARCHAR NOT NULL,
    PROFPIC BYTEA,
    PRIVACYSETTING VARCHAR,
    NOTIFICATIONSETTING VARCHAR
);

CREATE TABLE IF NOT EXISTS TRUSTEDDEVICE(
    USERID SERIAL NOT NULL REFERENCES USERS,
    AUTHTOKEN VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS CURRENTSESSION(
    USERID SERIAL NOT NULL REFERENCES USERS,
    SESSIONID VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS POST(
    ID SERIAL NOT NULL PRIMARY KEY,
    POSTERID SERIAL NOT NULL REFERENCES USERS,
    ORIGINID SERIAL REFERENCES POST,
    MEDIA BYTEA,
    TEXTCONTENT VARCHAR NOT NULL,
    POSTTIME TIMESTAMP NOT NULL,
    LOCATION POINT
);

CREATE TABLE IF NOT EXISTS REPLY(
    ID SERIAL NOT NULL PRIMARY KEY,
    SENDERID SERIAL NOT NULL REFERENCES USERS,
    ORIGINID SERIAL NOT NULL REFERENCES POST,
    REPLYID SERIAL REFERENCES REPLY,
    TEXTCONTENT VARCHAR NOT NULL,
    REPLYTIME TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS FOLLOW(
    FOLLOWER SERIAL REFERENCES USERS,
    FOLLOWEDUSER SERIAL REFERENCES USERS
);

CREATE TABLE IF NOT EXISTS BLOCK(
    BLOCKER SERIAL REFERENCES USERS,
    BLOCKEDUSER SERIAL REFERENCES USERS
);

COMMIT

\qecho ' '
\qecho ---------------------------------------------------------------------
\qecho End of script

-- Turn off spooling
--\o