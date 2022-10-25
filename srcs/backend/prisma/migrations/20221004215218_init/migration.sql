-- CreateTable
CREATE TABLE "Account" (
    "user_id" SERIAL NOT NULL,
    "user_login" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_avatar" TEXT NOT NULL,
    "games_lost" INTEGER NOT NULL DEFAULT 0,
    "games_won" INTEGER NOT NULL DEFAULT 0,
    "games_drawn" INTEGER NOT NULL DEFAULT 0,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "two_authentication" TEXT,
    "instagram" TEXT NOT NULL DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "discord" TEXT NOT NULL DEFAULT '',
    "online" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingFriends" (
    "pending_friendship_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "friend_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PendingFriends_pkey" PRIMARY KEY ("pending_friendship_id")
);

-- CreateTable
CREATE TABLE "match_history" (
    "match_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "opponent_id" INTEGER NOT NULL DEFAULT 0,
    "user_score" INTEGER NOT NULL DEFAULT 0,
    "opponent_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_history_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL DEFAULT 0,
    "opponent_id" INTEGER NOT NULL DEFAULT 0,
    "i_delivered" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_login_key" ON "Account"("user_login");

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_name_key" ON "Account"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_avatar_key" ON "Account"("user_avatar");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingFriends" ADD CONSTRAINT "PendingFriends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
