-- CreateTable
CREATE TABLE "mcp_usage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "threadId" TEXT,
    "serverId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "inputData" TEXT,
    "outputData" TEXT,
    "errorDetails" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "mcp_usage_serverId_idx" ON "mcp_usage"("serverId");

-- CreateIndex
CREATE INDEX "mcp_usage_timestamp_idx" ON "mcp_usage"("timestamp");

-- CreateIndex
CREATE INDEX "mcp_usage_sessionId_idx" ON "mcp_usage"("sessionId");
