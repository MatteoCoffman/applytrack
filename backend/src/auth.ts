import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export function getUserId(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): string {
  const sub = event.requestContext.authorizer?.jwt?.claims?.sub;
  if (typeof sub !== "string" || !sub) {
    throw new Error("Missing authenticated user");
  }
  return sub;
}

export function userPk(userId: string): string {
  return `USER#${userId}`;
}

export function appSk(applicationId: string): string {
  return `APP#${applicationId}`;
}

export function parseApplicationId(path: string): string | null {
  const match = path.match(/^\/applications\/([^/]+)$/);
  return match?.[1] ?? null;
}
